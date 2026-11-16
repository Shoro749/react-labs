import { formatTime } from '../formatTime.js'

/**
 * Простий (presentational) компонент таймера: лише показує те, що отримав у
 * props, і викликає передані обробники. Власного стану й ефектів не має.
 *
 * Використання:
 *   <TimerView
 *     method={method}
 *     secondsLeft={175}
 *     status="running"   // 'idle' | 'running' | 'paused' | 'done'
 *     onStart={…}
 *     onPause={…}
 *     onReset={…}
 *   />
 *
 * Вимоги — у тестах tests/TimerView.test.jsx.
 */
export default function TimerView({
  method,
  secondsLeft,
  status,
  onStart,
  onPause,
  onReset,
})
{
  let mainButtonText = 'Старт'
  let mainButtonHandler = onStart

  if (status === 'running') {
    mainButtonText = 'Пауза'
    mainButtonHandler = onPause
  } else if (status === 'paused') {
    mainButtonText = 'Продовжити'
    mainButtonHandler = onStart
  } else if (status === 'done') {
    mainButtonText = 'Спочатку'
    mainButtonHandler = onReset
  }

  return (
    <article className="brew-timer" aria-labelledby={`${method.id}-title`}>
      <h3 id={`${method.id}-title`}>{method.name}</h3>
      <p>{method.recipe}</p>
      <p className="time" role="timer">
        {formatTime(secondsLeft)}
      </p>
      <div className="timer-controls">
        <button type="button" onClick={mainButtonHandler}>
          {mainButtonText}
        </button>

        {(status === 'running' || status === 'paused') && (
          <button type="button" onClick={onReset}>
            Скинути
          </button>
        )}
      </div>

      <p className={status === 'done' ? 'timer-done' : ''} role="status">
        {status === 'done' ? 'Готово! Час пити каву.' : ''}
      </p>
    </article>
  )
}
