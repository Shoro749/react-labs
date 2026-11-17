import { useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import GuestsStepper from './GuestsStepper.jsx'
import { bookingSchema } from '../bookingSchema.js'
import { sendBooking } from '../api.js'

const defaultValues = {
  name: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  comment: '',
}

const fieldOrder = ['name', 'phone', 'date', 'time']

export default function BookingForm() {
  const fieldRefs = useRef({})

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: bookingSchema,
    validateOnBlur: true,
    validateOnChange: true,

    async onSubmit(values, { resetForm, setStatus }) {
      const response = await sendBooking(values)

      if (response.ok) {
        resetForm({
          values: defaultValues,
          status: response,
        })
      } else {
        setStatus(response)
      }
    },
  })

  const {
    values,
    errors,
    touched,
    status,
    isSubmitting,
    submitCount,
    isValidating,
    handleSubmit,
    handleBlur,
    handleChange,
    getFieldProps,
    setFieldValue,
    resetForm,
  } = formik

  // Після невдалої спроби надсилання фокусуємо перше поле з помилкою.
  useEffect(() => {
    if (submitCount === 0 || isValidating) return

    const firstInvalidField = fieldOrder.find((field) => errors[field])

    if (firstInvalidField) {
      fieldRefs.current[firstInvalidField]?.focus()
    }
  }, [submitCount, errors, isValidating])

  function handleKeyDown(event) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.currentTarget.requestSubmit()
    }
  }

  function handleReset() {
    resetForm({
      values: defaultValues,
      status: null,
    })

    fieldRefs.current.name?.focus()
  }

  function showError(field) {
    return touched[field] && errors[field]
  }

  return (
    <form
      className="booking-form"
      noValidate
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
    >
      <div className="field">
        <label>
          Ім'я
          <input
            {...getFieldProps('name')}
            ref={(element) => {
              fieldRefs.current.name = element
            }}
            autoComplete="name"
            required
            aria-invalid={showError('name') ? 'true' : 'false'}
            aria-describedby="name-error"
          />
        </label>

        <p id="name-error" className="field-error">
          {showError('name') ? errors.name : ''}
        </p>
      </div>

      <div className="field">
        <label>
          Телефон
          <input
            type="tel"
            {...getFieldProps('phone')}
            ref={(element) => {
              fieldRefs.current.phone = element
            }}
            autoComplete="tel"
            placeholder="+380671234567"
            required
            aria-invalid={showError('phone') ? 'true' : 'false'}
            aria-describedby="phone-error"
          />
        </label>

        <p id="phone-error" className="field-error">
          {showError('phone') ? errors.phone : ''}
        </p>
      </div>

      <div className="row">
        <div className="field">
          <label>
            Дата
            <input
              type="date"
              {...getFieldProps('date')}
              ref={(element) => {
                fieldRefs.current.date = element
              }}
              aria-invalid={showError('date') ? 'true' : 'false'}
              aria-describedby="date-error"
              required
            />
          </label>

          <p id="date-error" className="field-error">
            {showError('date') ? errors.date : ''}
          </p>
        </div>

        <div className="field">
          <label>
            Час
            <input
              type="time"
              {...getFieldProps('time')}
              ref={(element) => {
                fieldRefs.current.time = element
              }}
              aria-invalid={showError('time') ? 'true' : 'false'}
              aria-describedby="time-error"
              required
            />
          </label>

          <p id="time-error" className="field-error">
            {showError('time') ? errors.time : ''}
          </p>
        </div>
      </div>

      <GuestsStepper
        value={values.guests}
        onChange={(value) => setFieldValue('guests', value)}
      />

      <label>
        Коментар
        <textarea
          {...getFieldProps('comment')}
          maxLength={200}
          aria-describedby="comment-counter"
        />
      </label>

      <p id="comment-counter" className="counter">
        {values.comment.length} / 200
      </p>

      <div className="actions">
        <button type="submit" aria-disabled={isSubmitting}>
          {isSubmitting ? 'Надсилаємо…' : 'Забронювати'}
        </button>

        <button type="button" onClick={handleReset}>
          Очистити
        </button>
      </div>

      <p
        role="status"
        className={status?.ok === false ? 'status error' : 'status'}
      >
        {status?.message}
      </p>
    </form>
  )
}