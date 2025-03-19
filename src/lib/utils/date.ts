import { type DateArg, differenceInMinutes, formatISO } from 'date-fns'

export const formatDifferenceInHours = (
  endDate: DateArg<Date>,
  startDate: DateArg<Date>
): string => {
  const totalMinutes = differenceInMinutes(endDate, startDate)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h${minutes || ''}`
}

export const formatDateIso = (date: DateArg<Date>) =>
  formatISO(date, { representation: 'date' })
