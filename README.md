This is a Citation.js plugin for [Zotero Translation Server](https://github.com/zotero/translation-server) instances. The default instance is `http://localhost:1969` but that can be configured like this:

```js
const { plugins } = require('@citation-js/core')
// assuming the plugin is loaded, see below
plugins.config.get('@zotero').host = 'https://translate.example.org'
```

A known host is `https://translate.manubot.org`, but it is specifically ["a public instance for Manubot users"](https://github.com/manubot/manubot/issues/82#issue-387529150).

To set up your own host, you can [use the Docker image](https://hub.docker.com/r/zotero/translation-server)
([short guide](https://github.com/zotero/translation-server#running-via-docker))
or run it from the source ([longer guide](https://github.com/manubot/manubot/issues/82#issuecomment-444579414)).

## Install

```js
npm install @citation-js/plugin-zotero-translation-server
```

## Use

Install the plugin by `require`-ing it:

```js
require('@citation-js/plugin-zotero-translation-server')
```

## Formats

Formats and other features added by this plugin.

### Input

This plugins hijacks (or "procedurally enhances") the `@else/url` type, scraping the resulting site with the Translation Server. This may interfere with other plugins that expect `@else/url` to behave normally. This plugin selects all options if multiple arise, such as with search results pages.

#### Zotero API JSON

This plugin adds support for Zotero API JSON.
