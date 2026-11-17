import * as yup from 'yup'

const pad = (n) => String(n).padStart(2, '0')

export function today() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function nowTime() {
  const d = new Date()
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const bookingSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .min(2, "Вкажіть ім'я: щонайменше дві літери")
      .required("Вкажіть ім'я: щонайменше дві літери"),

    phone: yup
      .string()
      .trim()
      .matches(/^\+380\d{9}$/, 'Вкажіть телефон у форматі +380XXXXXXXXX')
      .required('Вкажіть телефон у форматі +380XXXXXXXXX'),

    date: yup
      .string()
      .required('Оберіть дату')
      .test('not-in-past', 'Ця дата вже минула', (date) => {
        return !date || date >= today()
      }),

    time: yup
      .string()
      .required('Оберіть час')
      .test(
        'opening-hours',
        'Столик можна забронювати з 8:00 до 20:00',
        (time) => {
          return !time || (time >= '08:00' && time <= '20:00')
        },
      ),

    guests: yup
      .number()
      .integer('Щонайменше 1 гість')
      .min(1, 'Щонайменше 1 гість')
      .max(8, 'Не більше 8 гостей')
      .required('Щонайменше 1 гість'),

    comment: yup
      .string()
      .trim()
      .max(200, 'Коментар — до 200 символів')
  })
  .test('future-time-today', function (booking) {
    if (!booking?.date || !booking?.time) return true

    if (booking.date === today() && booking.time <= nowTime()) {
      return this.createError({
        path: 'time',
        message: 'Цей час сьогодні вже минув',
      })
    }

    return true
  })
