/**
 * @module input/bibjson
 */

import { plugins } from '@citation-js/core'
import { ref, formats as input } from './input'
import { format as formatRecord } from './zotero'
import config from './config'

const output = {
  'zotero-json' (records) {
    return records.map(formatRecord)
  }
}

plugins.add(ref, { input, config, output })
