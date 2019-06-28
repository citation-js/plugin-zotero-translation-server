import config from './config'

export default function (type, body, format) {
  if (typeof config.host !== 'string') {
    throw new Error('No host configured')
  }

  return [config.host + '/' + type + (format ? '?format=' + format : ''), { body }]
}
