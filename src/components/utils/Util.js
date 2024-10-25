const format = function (number, n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = parseFloat(number).toFixed(Math.max(0, ~~n))

  return (c ? num.replace('.', c) : num).replace(
    new RegExp(re, 'g'),
    '$&' + (s || ',')
  )
}

const formatLv = function (number) {
  return format(number, 2, 3, ' ', ',')
}

const formatPop = function (number) {
  return format(Math.floor(number), 0, 3, ' ', ',')
}

const pad = (num) => {
  var s = String(num)
  while (s.length < 2) {
    s = '0' + s
  }
  return s
}

const month = (monthStr) => {
  switch (monthStr) {
    case 0:
      return 'януари'
      break
    case 1:
      return 'февруари'
      break
    case 2:
      return 'март'
      break
    case 3:
      return 'април'
      break
    case 4:
      return 'май'
      break
    case 5:
      return 'юни'
      break
    case 6:
      return 'юли'
      break
    case 7:
      return 'август'
      break
    case 8:
      return 'септември'
      break
    case 9:
      return 'октомври'
      break
    case 10:
      return 'ноември'
      break
    case 11:
      return 'декември'
      break
  }
}

const formatDay = (d) => {
  if (d >= 10 && d <= 20) return d + '-ти'

  switch (d % 10) {
    case 1:
      return d + '-ви'
      break
    case 2:
      return d + '-ри'
      break
    case 7:
    case 8:
      return d + '-ми'
      break
    default:
      return d + '-ти'
      break
  }
}

const formatDate = (dateTime) => {
  const date = new Date(dateTime)

  return (
    formatDay(date.getDate()) +
    ' ' +
    month(date.getMonth()) +
    ' ' +
    date.getFullYear()
  )
}

const formatTime = (dateTime) => {
  const date = new Date(dateTime)
  return pad(date.getHours()) + ':' + pad(date.getMinutes())
}

const formatDateTime = (dateTime) => {
  return formatTime(dateTime) + ' ' + formatDateShort(dateTime)
}

const formatSecs = (secs) => {
  return pad(Math.floor(secs / 60)) + ':' + pad(secs % 60)
}

const formatDateShort = (dateTime) => {
  const date = new Date(dateTime)

  return (
    pad(date.getDate()) +
    '.' +
    pad(date.getMonth() + 1) +
    '.' +
    pad(date.getFullYear())
  )
}

const mapRoleLocalization = (roles, roleValue) => {
  return roles?.find((role) => role.role === roleValue).roleLocalized
}

const checkPaths = (path1, path2) => {
  if (!path1 || !path2) return false

  if (path1[path1.length - 1] !== '/') path1 = path1 + '/'
  if (path2[path2.length - 1] !== '/') path2 = path2 + '/'

  return path1 === path2
}

const formatTextWithLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  )
}

module.exports = {
  formatLv,
  formatPop,
  formatDate,
  formatDateShort,
  formatDateTime,
  formatTime,
  formatSecs,
  format,
  checkPaths,
  mapRoleLocalization,
  formatTextWithLinks,
}
