import { type DateArg, differenceInMinutes, differenceInSeconds, formatISO } from 'date-fns'

export const formatDifferenceInHours = (
  endDate: DateArg<Date>,
  startDate: DateArg<Date>
): string => {
  const totalMinutes = differenceInMinutes(endDate, startDate)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h${minutes || ''}`
}

export const strictDifferenceInHours = (endDate: DateArg<Date>, startDate: DateArg<Date>) =>
  differenceInSeconds(endDate, startDate) / 3600

export const formatDateIso = (date: DateArg<Date>) => formatISO(date, { representation: 'date' })

export const formatDateTimeIso = (date: DateArg<Date>) => formatISO(date)
