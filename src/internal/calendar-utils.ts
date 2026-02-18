/** Returns true when the Gregorian year is leap. */
export const isLeapYear = (year: number): boolean => {
  if (year % 400 === 0) {
    return true
  }

  if (year % 100 === 0) {
    return false
  }

  return year % 4 === 0
}

/** Returns the number of days in a Gregorian month (month is 1-12). */
export const getDaysInMonth = (year: number, month: number): number => {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28
  }

  if (month === 4 || month === 6 || month === 9 || month === 11) {
    return 30
  }

  return 31
}
