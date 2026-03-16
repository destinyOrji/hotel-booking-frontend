import { format } from 'date-fns'

// Generate ICS file for calendar export
export const generateICSFile = (event) => {
  const { title, description, location, startDate, endDate } = event

  // Format dates for ICS format (YYYYMMDDTHHMMSSZ)
  const formatICSDate = (date) => {
    return format(date, "yyyyMMdd'T'HHmmss'Z'")
  }

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hotel Booking System//EN',
    'BEGIN:VEVENT',
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')

  // Create blob and download
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `booking-${format(startDate, 'yyyy-MM-dd')}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

// Generate Google Calendar URL
export const generateGoogleCalendarURL = (event) => {
  const { title, description, location, startDate, endDate } = event

  const formatGoogleDate = (date) => {
    return format(date, "yyyyMMdd'T'HHmmss'Z'")
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: description,
    location: location,
    dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// Generate Outlook Calendar URL
export const generateOutlookCalendarURL = (event) => {
  const { title, description, location, startDate, endDate } = event

  const formatOutlookDate = (date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss")
  }

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: title,
    body: description,
    location: location,
    startdt: formatOutlookDate(startDate),
    enddt: formatOutlookDate(endDate)
  })

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}
