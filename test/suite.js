/* eslint-env mocha */

import '../src/'

import assert from 'assert'
import { plugins } from '@citation-js/core'

const apiTests = [
  {
    name: 'single result',
    input: 'https://www.nytimes.com/2018/06/11/technology/net-neutrality-repeal.html',
    output: [{
      ISSN: '0362-4331',
      URL: 'https://www.nytimes.com/2018/06/11/technology/net-neutrality-repeal.html',
      abstract: 'Net Neutrality rules that required internet service providers to offer equal access to all web content are no longer in effect as of Monday.',
      author: [
        { family: 'Collins', given: 'Keith' }
      ],
      'container-title': 'The New York Times',
      issued: { 'date-parts': [['2018', 6, 11]] },
      language: 'en-US',
      section: 'Technology',
      source: 'NYTimes.com',
      title: 'Net Neutrality Has Officially Been Repealed. Here’s How That Could Affect You.',
      type: 'article-newspaper'
    }]
  },
  {
    name: 'multiple results',
    input: 'https://www.ncbi.nlm.nih.gov/pubmed?term=%221878%2F01%2F05%22%5BDate%20-%20Publication%5D',
    output: [
      {
        type: 'article-journal',
        title: 'Jaborandi Proposed as a Remedy in Hydrophobia',
        'container-title': 'British Medical Journal',
        page: '9-10',
        volume: '1',
        issue: '888',
        source: 'PubMed',
        DOI: '10.1136/bmj.1.888.9',
        ISSN: '0007-1447',
        note: 'PMID: 20748736\nPMCID: PMC2221215',
        journalAbbreviation: 'Br Med J',
        language: 'eng',
        author: [
          { family: 'Coghill', given: 'J. G.' }
        ],
        issued: { 'date-parts': [['1878', 1, 5]] }
      },
      {
        type: 'article-journal',
        title: 'Report Of Fifth Series of Fifty Cases of Ovariotomy',
        'container-title': 'British Medical Journal',
        page: '8-9',
        volume: '1',
        issue: '888',
        source: 'PubMed',
        DOI: '10.1136/bmj.1.888.8',
        ISSN: '0007-1447',
        note: 'PMID: 20748735\nPMCID: PMC2221208',
        journalAbbreviation: 'Br Med J',
        language: 'eng',
        author: [
          { family: 'Keith', given: 'T.' }
        ],
        issued: { 'date-parts': [['1878', 1, 5]] }
      },
      {
        type: 'article-journal',
        title: 'Cheiro-Pompholyx',
        'container-title': 'British Medical Journal',
        page: '7',
        volume: '1',
        issue: '888',
        source: 'PubMed',
        DOI: '10.1136/bmj.1.888.7',
        ISSN: '0007-1447',
        note: 'PMID: 20748734\nPMCID: PMC2221211',
        journalAbbreviation: 'Br Med J',
        language: 'eng',
        author: [
          { family: 'Tay', given: 'W.' }
        ],
        issued: { 'date-parts': [['1878', 1, 5]] }
      },
      {
        type: 'article-journal',
        title: 'Clinical Observations on Ovariotomy',
        'container-title': 'British Medical Journal',
        page: '5-6',
        volume: '1',
        issue: '888',
        source: 'PubMed',
        DOI: '10.1136/bmj.1.888.5',
        ISSN: '0007-1447',
        note: 'PMID: 20748733\nPMCID: PMC2221222',
        journalAbbreviation: 'Br Med J',
        language: 'eng',
        author: [
          { family: 'Thorburn', given: 'J.' }
        ],
        issued: { 'date-parts': [['1878', 1, 5]] }
      },
      {
        type: 'article-journal',
        title: 'Clinical Memoranda',
        'container-title': 'British Medical Journal',
        page: '12-13',
        volume: '1',
        issue: '888',
        source: 'PubMed',
        ISSN: '0007-1447',
        note: 'PMID: 20748732\nPMCID: PMC2221224',
        journalAbbreviation: 'Br Med J',
        language: 'eng',
        issued: { 'date-parts': [['1878', 1, 5]] }
      },
      {
        type: 'article-journal',
        title: 'The Treatment of Hip-Joint Disease by Extension with Motion: As Practised by the American Surgeons, Instead of Long-Continued Rest and Immobility',
        'container-title': 'British Medical Journal',
        page: '10-11',
        volume: '1',
        issue: '888',
        source: 'PubMed',
        DOI: '10.1136/bmj.1.888.10',
        ISSN: '0007-1447',
        note: 'PMID: 20748731\nPMCID: PMC2221206',
        shortTitle: 'The Treatment of Hip-Joint Disease by Extension with Motion',
        journalAbbreviation: 'Br Med J',
        language: 'eng',
        author: [
          { family: 'Adams', given: 'W.' }
        ],
        issued: { 'date-parts': [['1878', 1, 5]] }
      },
      {
        type: 'article-journal',
        title: 'Lectures on the Infective Processes of Disease',
        'container-title': 'British Medical Journal',
        page: '1-2',
        volume: '1',
        issue: '888',
        source: 'PubMed',
        DOI: '10.1136/bmj.1.888.1',
        ISSN: '0007-1447',
        note: 'PMID: 20748730\nPMCID: PMC2221223',
        journalAbbreviation: 'Br Med J',
        language: 'eng',
        author: [
          { family: 'Sanderson', given: 'J. B.' }
        ],
        issued: { 'date-parts': [['1878', 1, 5]] }
      }
    ]
  }
]

function fixResults (results) {
  return results.map(result => {
    // these change all the time
    delete result.id
    delete result.accessed
    return result
  })
}

describe('zotero', function () {
  describe('web-scraping', function () {
    for (let { name, input, output } of apiTests) {
      it(name, async function () {
        this.timeout(4000)
        const results = await plugins.input.chainAsync(input, { generateGraph: false })
        assert.deepStrictEqual(fixResults(results), output)
      })
    }
  })
})
