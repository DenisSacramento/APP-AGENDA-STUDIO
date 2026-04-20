import { labels } from './bookingConstants'

export const BookingStepper = ({ step }: { step: number }) => (
  <ol className="grid gap-3 sm:grid-cols-5">
    {labels.map((label, index) => {
      const current = index + 1
      const isActive = step === current
      const isDone = step > current

      return (
        <li
          key={label}
          className={`rounded-2xl border px-3 py-2 text-center text-xs font-semibold sm:text-sm ${
            isDone
              ? 'border-rose-300 bg-rose-100 text-rose-900'
              : isActive
                ? 'border-rose-400 bg-rose-500 text-white'
                : 'border-rose-100 bg-white text-zinc-500'
          }`}
        >
          {current}. {label}
        </li>
      )
    })}
  </ol>
)
