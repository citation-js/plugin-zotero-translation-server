import { util } from '@citation-js/core'
import makeRequest from './translationServer'
import { parse as parseRecord } from './zotero'

function makeParsers (type, format) {
  return {
    parse (body) {
      return util.fetchFile(...makeRequest(type, body, format))
    },
    parseAsync (body) {
      return util.fetchFileAsync(...makeRequest(type, body, format))
    }
  }
}

export const ref = '@zotero'
export const formats = {
  // translate to CSL-JSON
  '@zotero/record': {
    parse: parseRecord,
    parseType: {
      dataType: 'SimpleObject',
      propertyConstraint: {
        props: ['key', 'itemType']
      }
    }
  },
  '@zotero/records': {
    parse (records) { return records.map(parseRecord) },
    parseType: {
      dataType: 'Array',
      elementConstraint: '@zotero/record'
    }
  },
  // fetch complete records
  '@zotero/session': {
    ...makeParsers('web'),
    parseType: {
      dataType: 'SimpleObject',
      propertyConstraint: {
        props: ['url', 'session', 'items']
      }
    }
  },
  // scrape web-pages
  '@else/url': makeParsers('web')
}
