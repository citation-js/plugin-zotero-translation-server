/**
 * @module input/bibjson
 */

import { plugins } from '@citation-js/core'
import { ref, formats as input } from './input'
import config from './config'

plugins.add(ref, { input, config })
