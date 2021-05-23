import { util } from '@citation-js/core'
import { parse as parseDate, format as formatDate } from '@citation-js/date'

const TYPES = {
  toTarget: {
    artwork: 'graphic',
    attachment: 'article',
    audioRecording: 'song',
    bill: 'bill',
    blogPost: 'post-weblog',
    book: 'book',
    bookSection: 'chapter',
    case: 'legal_case',
    computerProgram: 'book',
    conferencePaper: 'paper-conference',
    dictionaryEntry: 'entry-dictionary',
    document: 'article',
    email: 'personal_communication',
    encyclopediaArticle: 'entry-encyclopedia',
    film: 'motion_picture',
    forumPost: 'post',
    hearing: 'bill',
    instantMessage: 'personal_communication',
    interview: 'interview',
    journalArticle: 'article-journal',
    letter: 'personal_communication',
    magazineArticle: 'article-magazine',
    manuscript: 'manuscript',
    map: 'map',
    newspaperArticle: 'article-newspaper',
    note: 'article',
    patent: 'patent',
    podcast: 'song',
    presentation: 'speech',
    radioBroadcast: 'broadcast',
    report: 'report',
    statute: 'legislation',
    thesis: 'thesis',
    tvBroadcast: 'broadcast',
    videoRecording: 'motion_picture',
    webpage: 'webpage'
  },
  toSource: {
    // article: '',
    'article-magazine': 'magazineArticle',
    'article-newspaper': 'newspaperArticle',
    'article-journal': 'journalArticle',
    bill: 'bill',
    book: 'book',
    // broadcast: '', tv or radio?
    chapter: 'bookSection',
    // dataset: '',
    // entry: '',
    'entry-dictionary': 'dictionaryEntry',
    'entry-encyclopedia': 'encyclopediaArticle',
    figure: 'artwork',
    graphic: 'artwork',
    interview: 'interview',
    legislation: 'statute',
    legal_case: 'case',
    manuscript: 'manuscript',
    map: 'map',
    motion_picture: 'motion_picture',
    // musical_score: '',
    // pamphlet: '',
    'paper-conference': 'conferencePaper',
    patent: 'patent',
    post: 'forumPost',
    'post-weblog': 'blogPost',
    personal_communication: 'letter', // or instantMessage, email
    report: 'report',
    // review: '',
    // 'review-book': '',
    song: 'audioRecording',
    speech: 'presentation',
    thesis: 'thesis',
    // treaty: '',
    webpage: 'webpage'
  }
}

const CONVERTERS = {
  DATE: {
    toTarget (date) {
      return parseDate(date.split('T')[0])
    },
    toSource (date) {
      return formatDate(date)
    }
  },
  CREATORS: {
    toTarget (creators) {
      return creators.map(creator => zoteroCreator.convertToTarget(creator))
    },
    toSource (creators) {
      return creators.map(creator => zoteroCreator.convertToSource(creator))
    }
  },
  TAGS: {
    toTarget (tags) {
      return tags.length ? tags.map(tag => tag.tag).join(',') : undefined
    },
    toSource (tags) {
      return tags.split(',').map(tag => ({ tag, type: 1 }))
    }
  },
  TYPE: {
    toTarget (type) {
      return TYPES.toTarget[type]
    },
    toSource (type) {
      if (type === 'book' && this.version) return 'computerProgram'
      return TYPES.toSource[type] || 'document'
    }
  }
}

const CREATOR_MAPPING = [
  { source: 'firstName', target: 'given' },
  { source: 'lastName', target: 'family' },
  { source: 'name', target: 'literal' }
]

const zoteroCreator = new util.Translator(CREATOR_MAPPING)

const MAPPING = [
  { source: 'key', target: 'id' },
  {
    source: 'tags',
    target: 'keyword',
    convert: CONVERTERS.TAGS
  },
  {
    source: 'itemType',
    target: 'type',
    convert: CONVERTERS.TYPE
  },
  {
    source: 'DOI',
    target: 'DOI',
    when: {
      source: { itemType: ['journalArticle', 'conferencePaper'] },
      target: { type: ['article-journal', 'paper-conference'] }
    }
  },
  {
    source: 'ISBN',
    target: 'ISBN',
    when: {
      source: {
        itemType: [
          'book',
          'bookSection',
          'map',
          'audioRecording',
          'videoRecording',
          'computerProgram',
          'conferencePaper',
          'encyclopediaArticle',
          'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'map',
          'song',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'ISSN',
    target: 'ISSN',
    when: {
      source: {
        itemType: ['journalArticle', 'magazineArticle', 'newspaperArticle']
      },
      target: {
        type: ['article-journal', 'article-magazine', 'article-newspaper']
      }
    }
  },
  {
    source: 'url',
    target: 'URL',
    when: {
      source: {
        itemType: [
          'book', 'bookSection',
          'journalArticle', 'magazineArticle',
          'newspaperArticle', 'thesis',
          'letter', 'manuscript',
          'interview', 'film',
          'artwork', 'webpage',
          'attachment', 'report',
          'bill', 'case',
          'hearing', 'patent',
          'statute', 'email',
          'map', 'blogPost',
          'instantMessage', 'forumPost',
          'audioRecording', 'presentation',
          'videoRecording', 'tvBroadcast',
          'radioBroadcast', 'podcast',
          'computerProgram', 'conferencePaper',
          'document', 'encyclopediaArticle',
          'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'thesis',
          'personal_communication',
          'manuscript',
          'interview',
          'figure',
          'graphic',
          'webpage',
          'report',
          'bill',
          'legal_case',
          'patent',
          'legislation',
          'map',
          'post-weblog',
          'post',
          'song',
          'speech',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'abstractNote',
    target: 'abstract',
    when: {
      source: {
        itemType: [
          'book', 'bookSection',
          'journalArticle', 'magazineArticle',
          'newspaperArticle', 'thesis',
          'letter', 'manuscript',
          'interview', 'film',
          'artwork', 'webpage',
          'report', 'bill',
          'case', 'hearing',
          'patent', 'statute',
          'email', 'map',
          'blogPost', 'instantMessage',
          'forumPost', 'audioRecording',
          'presentation', 'videoRecording',
          'tvBroadcast', 'radioBroadcast',
          'podcast', 'computerProgram',
          'conferencePaper', 'document',
          'encyclopediaArticle', 'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'thesis',
          'personal_communication',
          'manuscript',
          'interview',
          'figure',
          'graphic',
          'webpage',
          'report',
          'bill',
          'legal_case',
          'patent',
          'legislation',
          'map',
          'post-weblog',
          'post',
          'song',
          'speech',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'accessDate',
    target: 'accessed',
    when: {
      source: {
        itemType: [
          'book', 'bookSection',
          'journalArticle', 'magazineArticle',
          'newspaperArticle', 'thesis',
          'letter', 'manuscript',
          'interview', 'film',
          'artwork', 'webpage',
          'attachment', 'report',
          'bill', 'case',
          'hearing', 'patent',
          'statute', 'email',
          'map', 'blogPost',
          'instantMessage', 'forumPost',
          'audioRecording', 'presentation',
          'videoRecording', 'tvBroadcast',
          'radioBroadcast', 'podcast',
          'computerProgram', 'conferencePaper',
          'document', 'encyclopediaArticle',
          'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'thesis',
          'personal_communication',
          'manuscript',
          'interview',
          'figure',
          'graphic',
          'webpage',
          'report',
          'bill',
          'legal_case',
          'patent',
          'legislation',
          'map',
          'post-weblog',
          'post',
          'song',
          'speech',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    },
    convert: CONVERTERS.DATE
  },
  {
    source: 'archive',
    target: 'archive',
    when: {
      source: {
        itemType: [
          'book', 'bookSection',
          'journalArticle', 'magazineArticle',
          'newspaperArticle', 'thesis',
          'letter', 'manuscript',
          'interview', 'film',
          'artwork', 'report',
          'map', 'audioRecording',
          'videoRecording', 'tvBroadcast',
          'radioBroadcast', 'computerProgram',
          'conferencePaper', 'document',
          'encyclopediaArticle', 'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'thesis',
          'personal_communication',
          'manuscript',
          'interview',
          'figure',
          'graphic',
          'report',
          'map',
          'song',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'archiveLocation',
    target: 'archive_location',
    when: {
      source: {
        itemType: [
          'book', 'bookSection',
          'journalArticle', 'magazineArticle',
          'newspaperArticle', 'thesis',
          'letter', 'manuscript',
          'interview', 'film',
          'artwork', 'report',
          'map', 'audioRecording',
          'videoRecording', 'tvBroadcast',
          'radioBroadcast', 'computerProgram',
          'conferencePaper', 'document',
          'encyclopediaArticle', 'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'thesis',
          'personal_communication',
          'manuscript',
          'interview',
          'figure',
          'graphic',
          'report',
          'map',
          'song',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'author',
    target: 'author',
    when: {
      source: { itemType: 'book' },
      target: { type: 'book', version: false }
    },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'author',
    target: 'author',
    when: {
      source: {
        itemType: [
          'bookSection', 'journalArticle',
          'magazineArticle', 'newspaperArticle',
          'thesis', 'letter',
          'manuscript', 'webpage',
          'report', 'case',
          'statute', 'email',
          'blogPost', 'instantMessage',
          'forumPost', 'conferencePaper',
          'document', 'encyclopediaArticle',
          'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'thesis',
          'personal_communication',
          'manuscript',
          'webpage',
          'report',
          'legal_case',
          'legislation',
          'post-weblog',
          'post',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'contributor',
    target: 'author',
    when: {
      source: {
        itemType: [
          'book', 'bookSection',
          'journalArticle', 'magazineArticle',
          'newspaperArticle', 'thesis',
          'letter', 'manuscript',
          'interview', 'film',
          'artwork', 'webpage',
          'report', 'bill',
          'case', 'hearing',
          'patent', 'statute',
          'email', 'map',
          'blogPost', 'instantMessage',
          'forumPost', 'audioRecording',
          'presentation', 'videoRecording',
          'tvBroadcast', 'radioBroadcast',
          'podcast', 'computerProgram',
          'conferencePaper', 'document',
          'encyclopediaArticle', 'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'thesis',
          'personal_communication',
          'manuscript',
          'interview',
          'figure',
          'graphic',
          'webpage',
          'report',
          'bill',
          'legal_case',
          'patent',
          'legislation',
          'map',
          'post-weblog',
          'post',
          'song',
          'speech',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'interviewee',
    target: 'author',
    when: { source: { itemType: 'interview' }, target: { type: 'interview' } },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'artist',
    target: 'author',
    when: {
      source: { itemType: 'artwork' },
      target: { type: ['figure', 'graphic'] }
    },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'sponsor',
    target: 'author',
    when: { source: { itemType: 'bill' }, target: { type: 'bill' } },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'inventor',
    target: 'author',
    when: { source: { itemType: 'patent' }, target: { type: 'patent' } },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'cartographer',
    target: 'author',
    when: { source: { itemType: 'map' }, target: { type: 'map' } },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'performer',
    target: 'author',
    when: { source: { itemType: 'audioRecording' }, target: { type: 'song' } },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'presenter',
    target: 'author',
    when: { source: { itemType: 'presentation' }, target: { type: 'speech' } },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'podcaster',
    target: 'author',
    when: { source: { itemType: 'podcast' }, target: false },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'programmer',
    target: 'author',
    when: {
      source: { itemType: 'computerProgram' },
      target: { type: 'book', version: true }
    },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'legislativeBody',
    target: 'authority',
    when: {
      source: { itemType: ['bill', 'hearing'] },
      target: { type: 'bill' }
    }
  },
  {
    source: 'court',
    target: 'authority',
    when: { source: { itemType: 'case' }, target: { type: 'legal_case' } }
  },
  {
    source: 'issuingAuthority',
    target: 'authority',
    when: { source: { itemType: 'patent' }, target: { type: 'patent' } }
  },
  {
    source: 'callNumber',
    target: 'call-number',
    when: {
      source: {
        itemType: [
          'book', 'bookSection',
          'journalArticle', 'magazineArticle',
          'newspaperArticle', 'thesis',
          'letter', 'manuscript',
          'interview', 'film',
          'artwork', 'report',
          'map', 'audioRecording',
          'videoRecording', 'tvBroadcast',
          'radioBroadcast', 'computerProgram',
          'conferencePaper', 'document',
          'encyclopediaArticle', 'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'thesis',
          'personal_communication',
          'manuscript',
          'interview',
          'figure',
          'graphic',
          'report',
          'map',
          'song',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'applicationNumber',
    target: 'call-number',
    when: { source: { itemType: 'patent' }, target: { type: 'patent' } }
  },
  {
    source: 'session',
    target: 'chapter-number',
    when: {
      source: { itemType: ['bill', 'hearing', 'statute'] },
      target: { type: ['bill', 'legislation'] }
    }
  },
  {
    source: 'seriesEditor',
    target: 'collection-editor',
    when: {
      source: { itemType: 'book' },
      target: { type: 'book', version: false }
    },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'seriesEditor',
    target: 'collection-editor',
    when: {
      source: {
        itemType: [
          'bookSection',
          'report',
          'map',
          'conferencePaper',
          'encyclopediaArticle',
          'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'chapter',
          'report',
          'map',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'seriesNumber',
    target: 'collection-number',
    when: {
      source: { itemType: 'book' },
      target: { type: 'book', version: false }
    }
  },
  {
    source: 'seriesNumber',
    target: 'collection-number',
    when: {
      source: {
        itemType: ['bookSection', 'encyclopediaArticle', 'dictionaryEntry']
      },
      target: { type: ['chapter', 'entry-encyclopedia', 'entry-dictionary'] }
    }
  },
  {
    source: 'series',
    target: 'collection-title',
    when: {
      source: { itemType: 'book' },
      target: { type: 'book', version: false }
    }
  },
  {
    source: 'series',
    target: 'collection-title',
    when: {
      source: {
        itemType: [
          'bookSection',
          'journalArticle',
          'conferencePaper',
          'encyclopediaArticle',
          'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'chapter',
          'article-journal',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'seriesTitle',
    target: 'collection-title',
    when: {
      source: { itemType: 'computerProgram' },
      target: { type: 'book', version: true }
    }
  },
  {
    source: 'seriesTitle',
    target: 'collection-title',
    when: {
      source: {
        itemType: [
          'journalArticle',
          'report',
          'map',
          'audioRecording',
          'videoRecording',
          'podcast'
        ]
      },
      target: { type: ['article-journal', 'report', 'map', 'song'] }
    }
  },
  {
    source: 'composer',
    target: 'composer',
    when: { source: { itemType: 'audioRecording' }, target: { type: 'song' } },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'bookAuthor',
    target: 'container-author',
    when: { source: { itemType: 'bookSection' }, target: { type: 'chapter' } },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'bookTitle',
    target: 'container-title',
    when: { source: { itemType: 'bookSection' }, target: { type: 'chapter' } }
  },
  {
    source: 'publicationTitle',
    target: 'container-title',
    when: {
      source: {
        itemType: ['journalArticle', 'magazineArticle', 'newspaperArticle']
      },
      target: {
        type: ['article-journal', 'article-magazine', 'article-newspaper']
      }
    }
  },
  {
    source: 'websiteTitle',
    target: 'container-title',
    when: { source: { itemType: 'webpage' }, target: { type: 'webpage' } }
  },
  {
    source: 'code',
    target: 'container-title',
    when: {
      source: { itemType: ['bill', 'statute'] },
      target: { type: ['bill', 'legislation'] }
    }
  },
  {
    source: 'reporter',
    target: 'container-title',
    when: { source: { itemType: 'case' }, target: { type: 'legal_case' } }
  },
  {
    source: 'blogTitle',
    target: 'container-title',
    when: { source: { itemType: 'blogPost' }, target: { type: 'post-weblog' } }
  },
  {
    source: 'forumTitle',
    target: 'container-title',
    when: { source: { itemType: 'forumPost' }, target: { type: 'post' } }
  },
  {
    source: 'programTitle',
    target: 'container-title',
    when: {
      source: { itemType: ['tvBroadcast', 'radioBroadcast'] },
      target: false
    }
  },
  {
    source: 'proceedingsTitle',
    target: 'container-title',
    when: {
      source: { itemType: 'conferencePaper' },
      target: { type: 'paper-conference' }
    }
  },
  {
    source: 'encyclopediaTitle',
    target: 'container-title',
    when: {
      source: { itemType: 'encyclopediaArticle' },
      target: { type: 'entry-encyclopedia' }
    }
  },
  {
    source: 'dictionaryTitle',
    target: 'container-title',
    when: {
      source: { itemType: 'dictionaryEntry' },
      target: { type: 'entry-dictionary' }
    }
  },
  {
    source: 'runningTime',
    target: 'dimensions',
    when: {
      source: {
        itemType: [
          'film',
          'audioRecording',
          'videoRecording',
          'tvBroadcast',
          'radioBroadcast',
          'podcast'
        ]
      },
      target: { type: 'song' }
    }
  },
  {
    source: 'artworkSize',
    target: 'dimensions',
    when: {
      source: { itemType: 'artwork' },
      target: { type: ['figure', 'graphic'] }
    }
  },
  {
    source: 'director',
    target: 'director',
    when: {
      source: {
        itemType: ['film', 'videoRecording', 'tvBroadcast', 'radioBroadcast']
      },
      target: false
    },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'edition',
    target: 'edition',
    when: {
      source: { itemType: 'book' },
      target: { type: 'book', version: false }
    }
  },
  {
    source: 'edition',
    target: 'edition',
    when: {
      source: {
        itemType: [
          'bookSection',
          'newspaperArticle',
          'map',
          'encyclopediaArticle',
          'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'chapter',
          'article-newspaper',
          'map',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'editor',
    target: 'editor',
    when: {
      source: { itemType: 'book' },
      target: { type: 'book', version: false }
    },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'editor',
    target: 'editor',
    when: {
      source: {
        itemType: [
          'bookSection',
          'journalArticle',
          'conferencePaper',
          'document',
          'encyclopediaArticle',
          'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'chapter',
          'article-journal',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'meetingName',
    target: 'event',
    when: { source: { itemType: 'presentation' }, target: { type: 'speech' } }
  },
  {
    source: 'conferenceName',
    target: 'event',
    when: {
      source: { itemType: 'conferencePaper' },
      target: { type: 'paper-conference' }
    }
  },
  {
    source: 'place',
    target: 'event-place',
    when: {
      source: {
        itemType: [
          'book', 'bookSection',
          'newspaperArticle', 'thesis',
          'manuscript', 'report',
          'hearing', 'patent',
          'map', 'audioRecording',
          'presentation', 'videoRecording',
          'tvBroadcast', 'radioBroadcast',
          'computerProgram', 'conferencePaper',
          'encyclopediaArticle', 'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'article-newspaper',
          'thesis',
          'manuscript',
          'report',
          'patent',
          'map',
          'song',
          'speech',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'thesisType',
    target: 'genre',
    when: { source: { itemType: 'thesis' }, target: { type: 'thesis' } }
  },
  {
    source: 'letterType',
    target: 'genre',
    when: {
      source: { itemType: 'letter' },
      target: { type: 'personal_communication' }
    }
  },
  {
    source: 'manuscriptType',
    target: 'genre',
    when: { source: { itemType: 'manuscript' }, target: { type: 'manuscript' } }
  },
  {
    source: 'genre',
    target: 'genre',
    when: { source: { itemType: 'film' }, target: false }
  },
  {
    source: 'websiteType',
    target: 'genre',
    when: {
      source: { itemType: ['webpage', 'blogPost'] },
      target: { type: ['webpage', 'post-weblog'] }
    }
  },
  {
    source: 'reportType',
    target: 'genre',
    when: { source: { itemType: 'report' }, target: { type: 'report' } }
  },
  {
    source: 'mapType',
    target: 'genre',
    when: { source: { itemType: 'map' }, target: { type: 'map' } }
  },
  {
    source: 'postType',
    target: 'genre',
    when: { source: { itemType: 'forumPost' }, target: { type: 'post' } }
  },
  {
    source: 'presentationType',
    target: 'genre',
    when: { source: { itemType: 'presentation' }, target: { type: 'speech' } }
  },
  {
    source: 'programmingLanguage',
    target: 'genre',
    when: {
      source: { itemType: 'computerProgram' },
      target: { type: 'book', version: true }
    }
  },
  {
    source: 'interviewer',
    target: 'interviewer',
    when: { source: { itemType: 'interview' }, target: { type: 'interview' } },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'issue',
    target: 'issue',
    when: {
      source: { itemType: ['journalArticle', 'magazineArticle'] },
      target: { type: ['article-journal', 'article-magazine'] }
    }
  },
  {
    source: 'priorityNumbers',
    target: 'issue',
    when: { source: { itemType: 'patent' }, target: { type: 'patent' } }
  },
  {
    source: 'date',
    target: 'issued',
    when: {
      source: {
        itemType: [
          'book', 'bookSection',
          'journalArticle', 'magazineArticle',
          'newspaperArticle', 'thesis',
          'letter', 'manuscript',
          'interview', 'film',
          'artwork', 'webpage',
          'report', 'bill',
          'hearing', 'email',
          'map', 'blogPost',
          'instantMessage', 'forumPost',
          'audioRecording', 'presentation',
          'videoRecording', 'tvBroadcast',
          'radioBroadcast', 'computerProgram',
          'conferencePaper', 'document',
          'encyclopediaArticle', 'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'thesis',
          'personal_communication',
          'manuscript',
          'interview',
          'figure',
          'graphic',
          'webpage',
          'report',
          'bill',
          'map',
          'post-weblog',
          'post',
          'song',
          'speech',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    },
    convert: CONVERTERS.DATE
  },
  {
    source: 'dateDecided',
    target: 'issued',
    when: { source: { itemType: 'case' }, target: { type: 'legal_case' } },
    convert: CONVERTERS.DATE
  },
  {
    source: 'issueDate',
    target: 'issued',
    when: { source: { itemType: 'patent' }, target: { type: 'patent' } },
    convert: CONVERTERS.DATE
  },
  {
    source: 'dateEnacted',
    target: 'issued',
    when: { source: { itemType: 'statute' }, target: { type: 'legislation' } },
    convert: CONVERTERS.DATE
  },
  {
    source: 'journalAbbreviation',
    target: 'journalAbbreviation',
    when: {
      source: { itemType: 'journalArticle' },
      target: { type: 'article-journal' }
    }
  },
  {
    source: 'language',
    target: 'language',
    when: {
      source: { itemType: 'book' },
      target: { type: 'book', version: false }
    }
  },
  {
    source: 'language',
    target: 'language',
    when: {
      source: {
        itemType: [
          'bookSection', 'journalArticle',
          'magazineArticle', 'newspaperArticle',
          'thesis', 'letter',
          'manuscript', 'interview',
          'film', 'artwork',
          'webpage', 'report',
          'bill', 'case',
          'hearing', 'patent',
          'statute', 'email',
          'map', 'blogPost',
          'instantMessage', 'forumPost',
          'audioRecording', 'presentation',
          'videoRecording', 'tvBroadcast',
          'radioBroadcast', 'podcast',
          'conferencePaper', 'document',
          'encyclopediaArticle', 'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'thesis',
          'personal_communication',
          'manuscript',
          'interview',
          'figure',
          'graphic',
          'webpage',
          'report',
          'bill',
          'legal_case',
          'patent',
          'legislation',
          'map',
          'post-weblog',
          'post',
          'song',
          'speech',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'interviewMedium',
    target: 'medium',
    when: { source: { itemType: 'interview' }, target: { type: 'interview' } }
  },
  {
    source: 'videoRecordingFormat',
    target: 'medium',
    when: {
      source: { itemType: ['film', 'videoRecording', 'tvBroadcast'] },
      target: false
    }
  },
  {
    source: 'artworkMedium',
    target: 'medium',
    when: {
      source: { itemType: 'artwork' },
      target: { type: ['figure', 'graphic'] }
    }
  },
  {
    source: 'audioRecordingFormat',
    target: 'medium',
    when: {
      source: { itemType: ['audioRecording', 'radioBroadcast'] },
      target: { type: 'song' }
    }
  },
  {
    source: 'audioFileType',
    target: 'medium',
    when: { source: { itemType: 'podcast' }, target: false }
  },
  {
    source: 'system',
    target: 'medium',
    when: {
      source: { itemType: 'computerProgram' },
      target: { type: 'book', version: true }
    }
  },
  {
    source: 'extra',
    target: 'note',
    when: {
      source: {
        itemType: [
          'book', 'bookSection',
          'journalArticle', 'magazineArticle',
          'newspaperArticle', 'thesis',
          'letter', 'manuscript',
          'interview', 'film',
          'artwork', 'webpage',
          'report', 'bill',
          'case', 'hearing',
          'patent', 'statute',
          'email', 'map',
          'blogPost', 'instantMessage',
          'forumPost', 'audioRecording',
          'presentation', 'videoRecording',
          'tvBroadcast', 'radioBroadcast',
          'podcast', 'computerProgram',
          'conferencePaper', 'document',
          'encyclopediaArticle', 'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'thesis',
          'personal_communication',
          'manuscript',
          'interview',
          'figure',
          'graphic',
          'webpage',
          'report',
          'bill',
          'legal_case',
          'patent',
          'legislation',
          'map',
          'post-weblog',
          'post',
          'song',
          'speech',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'reportNumber',
    target: 'number',
    when: { source: { itemType: 'report' }, target: { type: 'report' } }
  },
  {
    source: 'billNumber',
    target: 'number',
    when: { source: { itemType: 'bill' }, target: { type: 'bill' } }
  },
  {
    source: 'docketNumber',
    target: 'number',
    when: { source: { itemType: 'case' }, target: { type: 'legal_case' } }
  },
  {
    source: 'documentNumber',
    target: 'number',
    when: { source: { itemType: 'hearing' }, target: false }
  },
  {
    source: 'patentNumber',
    target: 'number',
    when: { source: { itemType: 'patent' }, target: { type: 'patent' } }
  },
  {
    source: 'publicLawNumber',
    target: 'number',
    when: { source: { itemType: 'statute' }, target: { type: 'legislation' } }
  },
  {
    source: 'episodeNumber',
    target: 'number',
    when: {
      source: { itemType: ['tvBroadcast', 'radioBroadcast', 'podcast'] },
      target: false
    }
  },
  {
    source: 'numPages',
    target: 'number-of-pages',
    when: {
      source: { itemType: 'book' },
      target: { type: 'book', version: false }
    }
  },
  {
    source: 'numPages',
    target: 'number-of-pages',
    when: {
      source: { itemType: ['thesis', 'manuscript'] },
      target: { type: ['thesis', 'manuscript'] }
    }
  },
  {
    source: 'numberOfVolumes',
    target: 'number-of-volumes',
    when: {
      source: { itemType: 'book' },
      target: { type: 'book', version: false }
    }
  },
  {
    source: 'numberOfVolumes',
    target: 'number-of-volumes',
    when: {
      source: {
        itemType: [
          'bookSection',
          'hearing',
          'audioRecording',
          'videoRecording',
          'encyclopediaArticle',
          'dictionaryEntry'
        ]
      },
      target: {
        type: ['chapter', 'song', 'entry-encyclopedia', 'entry-dictionary']
      }
    }
  },
  {
    source: 'pages',
    target: 'page',
    when: {
      source: {
        itemType: [
          'bookSection',
          'journalArticle',
          'magazineArticle',
          'newspaperArticle',
          'report',
          'hearing',
          'patent',
          'statute',
          'conferencePaper',
          'encyclopediaArticle',
          'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'report',
          'patent',
          'legislation',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'codePages',
    target: 'page',
    when: { source: { itemType: 'bill' }, target: { type: 'bill' } }
  },
  {
    source: 'firstPage',
    target: 'page',
    when: { source: { itemType: 'case' }, target: { type: 'legal_case' } }
  },
  {
    source: 'publisher',
    target: 'publisher',
    when: {
      source: { itemType: 'book' },
      target: { type: 'book', version: false }
    }
  },
  {
    source: 'publisher',
    target: 'publisher',
    when: {
      source: {
        itemType: [
          'bookSection',
          'hearing',
          'map',
          'conferencePaper',
          'document',
          'encyclopediaArticle',
          'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'chapter',
          'map',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'university',
    target: 'publisher',
    when: { source: { itemType: 'thesis' }, target: { type: 'thesis' } }
  },
  {
    source: 'distributor',
    target: 'publisher',
    when: { source: { itemType: 'film' }, target: false }
  },
  {
    source: 'institution',
    target: 'publisher',
    when: { source: { itemType: 'report' }, target: { type: 'report' } }
  },
  {
    source: 'label',
    target: 'publisher',
    when: { source: { itemType: 'audioRecording' }, target: { type: 'song' } }
  },
  {
    source: 'studio',
    target: 'publisher',
    when: { source: { itemType: 'videoRecording' }, target: false }
  },
  {
    source: 'network',
    target: 'publisher',
    when: {
      source: { itemType: ['tvBroadcast', 'radioBroadcast'] },
      target: false
    }
  },
  {
    source: 'company',
    target: 'publisher',
    when: {
      source: { itemType: 'computerProgram' },
      target: { type: 'book', version: true }
    }
  },
  {
    source: 'recipient',
    target: 'recipient',
    when: {
      source: { itemType: ['letter', 'email', 'instantMessage'] },
      target: { type: 'personal_communication' }
    },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'history',
    target: 'references',
    when: {
      source: { itemType: ['bill', 'case', 'hearing', 'statute'] },
      target: { type: ['bill', 'legal_case', 'legislation'] }
    }
  },
  {
    source: 'references',
    target: 'references',
    when: { source: { itemType: 'patent' }, target: { type: 'patent' } }
  },
  {
    source: 'reviewedAuthor',
    target: 'reviewed-author',
    when: {
      source: {
        itemType: [
          'journalArticle',
          'magazineArticle',
          'newspaperArticle',
          'document'
        ]
      },
      target: {
        type: ['article-journal', 'article-magazine', 'article-newspaper']
      }
    },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'scale',
    target: 'scale',
    when: { source: { itemType: 'map' }, target: { type: 'map' } }
  },
  {
    source: 'section',
    target: 'section',
    when: {
      source: { itemType: ['newspaperArticle', 'bill', 'statute'] },
      target: { type: ['article-newspaper', 'bill', 'legislation'] }
    }
  },
  {
    source: 'committee',
    target: 'section',
    when: { source: { itemType: 'hearing' }, target: false }
  },
  {
    source: 'shortTitle',
    target: 'shortTitle',
    when: {
      source: {
        itemType: [
          'book', 'bookSection',
          'journalArticle', 'magazineArticle',
          'newspaperArticle', 'thesis',
          'letter', 'manuscript',
          'interview', 'film',
          'artwork', 'webpage',
          'report', 'bill',
          'case', 'hearing',
          'patent', 'statute',
          'email', 'map',
          'blogPost', 'instantMessage',
          'forumPost', 'audioRecording',
          'presentation', 'videoRecording',
          'tvBroadcast', 'radioBroadcast',
          'podcast', 'computerProgram',
          'conferencePaper', 'document',
          'encyclopediaArticle', 'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'thesis',
          'personal_communication',
          'manuscript',
          'interview',
          'figure',
          'graphic',
          'webpage',
          'report',
          'bill',
          'legal_case',
          'patent',
          'legislation',
          'map',
          'post-weblog',
          'post',
          'song',
          'speech',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'libraryCatalog',
    target: 'source',
    when: {
      source: {
        itemType: [
          'book', 'bookSection',
          'journalArticle', 'magazineArticle',
          'newspaperArticle', 'thesis',
          'letter', 'manuscript',
          'interview', 'film',
          'artwork', 'report',
          'map', 'audioRecording',
          'videoRecording', 'tvBroadcast',
          'radioBroadcast', 'computerProgram',
          'conferencePaper', 'document',
          'encyclopediaArticle', 'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'thesis',
          'personal_communication',
          'manuscript',
          'interview',
          'figure',
          'graphic',
          'report',
          'map',
          'song',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'legalStatus',
    target: 'status',
    when: { source: { itemType: 'patent' }, target: { type: 'patent' } }
  },
  {
    source: 'filingDate',
    target: 'submitted',
    when: { source: { itemType: 'patent' }, target: { type: 'patent' } },
    convert: CONVERTERS.DATE
  },
  {
    source: 'title',
    target: 'title',
    when: {
      source: {
        itemType: [
          'book', 'bookSection',
          'journalArticle', 'magazineArticle',
          'newspaperArticle', 'thesis',
          'letter', 'manuscript',
          'interview', 'film',
          'artwork', 'webpage',
          'attachment', 'report',
          'bill', 'hearing',
          'patent', 'map',
          'blogPost', 'instantMessage',
          'forumPost', 'audioRecording',
          'presentation', 'videoRecording',
          'tvBroadcast', 'radioBroadcast',
          'podcast', 'computerProgram',
          'conferencePaper', 'document',
          'encyclopediaArticle', 'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'thesis',
          'personal_communication',
          'manuscript',
          'interview',
          'figure',
          'graphic',
          'webpage',
          'report',
          'bill',
          'patent',
          'map',
          'post-weblog',
          'post',
          'song',
          'speech',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'caseName',
    target: 'title',
    when: { source: { itemType: 'case' }, target: { type: 'legal_case' } }
  },
  {
    source: 'nameOfAct',
    target: 'title',
    when: { source: { itemType: 'statute' }, target: { type: 'legislation' } }
  },
  {
    source: 'subject',
    target: 'title',
    when: { source: { itemType: 'email' }, target: false }
  },
  {
    source: 'translator',
    target: 'translator',
    when: {
      source: { itemType: 'book' },
      target: { type: 'book', version: false }
    },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'translator',
    target: 'translator',
    when: {
      source: {
        itemType: [
          'bookSection',
          'journalArticle',
          'magazineArticle',
          'newspaperArticle',
          'manuscript',
          'interview',
          'webpage',
          'report',
          'conferencePaper',
          'document',
          'encyclopediaArticle',
          'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'chapter',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'manuscript',
          'interview',
          'webpage',
          'report',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    },
    convert: CONVERTERS.CREATORS
  },
  {
    source: 'version',
    target: 'version',
    when: {
      source: { itemType: 'computerProgram' },
      target: { type: 'book', version: true }
    }
  },
  {
    source: 'volume',
    target: 'volume',
    when: {
      source: { itemType: 'book' },
      target: { type: 'book', version: false }
    }
  },
  {
    source: 'volume',
    target: 'volume',
    when: {
      source: {
        itemType: [
          'bookSection',
          'journalArticle',
          'magazineArticle',
          'audioRecording',
          'videoRecording',
          'conferencePaper',
          'encyclopediaArticle',
          'dictionaryEntry'
        ]
      },
      target: {
        type: [
          'chapter',
          'article-journal',
          'article-magazine',
          'song',
          'paper-conference',
          'entry-encyclopedia',
          'entry-dictionary'
        ]
      }
    }
  },
  {
    source: 'codeVolume',
    target: 'volume',
    when: { source: { itemType: 'bill' }, target: { type: 'bill' } }
  },
  {
    source: 'reporterVolume',
    target: 'volume',
    when: { source: { itemType: 'case' }, target: { type: 'legal_case' } }
  },
  {
    source: 'codeNumber',
    target: 'volume',
    when: { source: { itemType: 'statute' }, target: { type: 'legislation' } }
  }
]

const zoteroJson = new util.Translator(MAPPING)

const ZOTERO_CREATORS = [
  'author',
  'contributor',
  'editor',
  'seriesEditor',
  'translator',
  'bookAuthor',
  'reviewedAuthor',
  'recipient',
  'interviewee',
  'interviewer',
  'director',
  'producer',
  'scriptwriter',
  'artist',
  'sponsor',
  'cosponsor',
  'counsel',
  'inventor',
  'attorneyAgent',
  'cartographer',
  'commenter',
  'performer',
  'composer',
  'wordsBy',
  'presenter',
  'castMember',
  'guest',
  'podcaster',
  'programmer'
]

const EXTRA_FIELDS = {
  UPPERCASE: {
    DOI: true,
    ISBN: true,
    ISSN: true,
    PMCID: true,
    PMID: true,
    URL: true
  },

  DATE: {
    accessed: true,
    // container: true,
    'event-date': true,
    issued: true,
    'original-date': true,
    submitted: true
  },

  NAME: {
    author: true,
    'collection-editor': true,
    composer: true,
    'container-author': true,
    director: true,
    editor: true,
    'editorial-director': true,
    illustrator: true,
    interviewer: true,
    'original-author': true,
    recipient: true,
    'reviewed-author': true,
    translator: true
  }
}

function extractExtraFields (extra) {
  const allFields = extra.trim().split('\n')
  const cslFields = {}

  for (const field of allFields) {
    const [key, value] = field.split(': ')
    if (!value) { continue }

    const cslKey = key in EXTRA_FIELDS.UPPERCASE ? key : key.replace(/ /g, '-').toLowerCase()

    if (value in EXTRA_FIELDS.NAME) {
      if (!cslFields[cslKey]) { cslFields[cslKey] = [] }
      const [family, given] = value.split(' || ')
      cslFields[cslKey].push(given ? { family, given } : { family })
    } else if (value in EXTRA_FIELDS.DATE) {
      cslFields[cslKey] = parseDate(...value.split('/'))
    } else {
      cslFields[cslKey] = value
    }
  }

  return cslFields
}

function formatExtraName (name) {
  if (name.literal) {
    return name.literal
  } else {
    const last = ['non-dropping-particles', 'family', 'suffix']
      .map(key => name[key]).filter(Boolean)
    const first = ['given', 'dropping-particles']
      .map(key => name[key]).filter(Boolean)
    return first ? `${last} || ${first}` : last
  }
}

function formatExtraField (input) {
  return Object.keys(input)
    .filter(key => key[0] !== '_')
    .flatMap(key => Array.isArray(input[key]) ? input[key].map(value => [key, value]) : [[key, input[key]]])
    .map(([key, value]) => {
      const outputKey = key.replace(/-_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase())
      if (key in EXTRA_FIELDS.NAME) {
        return `${outputKey}: ${formatExtraName(value)}`
      } else if (key in EXTRA_FIELDS.DATE) {
        return `${outputKey}: ${formatDate(value)}`
      } else if (typeof value === 'string' && value.includes('\n')) {
        return `${outputKey}: "${value.replace(/\n/g, '\\n')}"`
      } else {
        return `${outputKey}: ${value}`
      }
    })
    .join('\n')
}

function getCreatorFields (creators = []) {
  const creatorFields = {}
  for (const creator of creators) {
    if (!creatorFields[creator.creatorType]) { creatorFields[creator.creatorType] = [] }
    creatorFields[creator.creatorType].push(creator)
  }
  return creatorFields
}

export function parse (input) {
  const processedInput = Object.assign(getCreatorFields(input.creators), input)
  const output = zoteroJson.convertToTarget(processedInput)

  if (input.extra) {
    const extra = extractExtraFields(input.extra)
    const processedOutput = Object.assign(extra, output)

    if (extra.type) { processedOutput.type = extra.type }
    for (const dateField in EXTRA_FIELDS.DATE) {
      if (dateField in extra) {
        processedOutput[dateField] = extra[dateField]
      }
    }

    return processedOutput
  }

  return output
}

export function format (input) {
  const output = zoteroJson.convertToSource(input)

  for (const creatorType of ZOTERO_CREATORS) {
    if (creatorType in output) {
      if (!output.creators) { output.creators = [] }
      output.creators.push(...output[creatorType].map(creator => ({ ...creator, creatorType })))
      delete output[creatorType]
    }
  }

  output.extra = formatExtraField(input)

  return output
}
