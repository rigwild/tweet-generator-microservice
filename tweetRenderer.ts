import express from 'express'
const twemoji = require('twemoji')

/**
 * Convert a text's emojis to twitter SVG emojis (chrome-aws-lambda does not support emojis)
 * @param text Any text containing unicode emojis
 * @returns Text with emojis replaced
 */
const emojify = (text: string): string => twemoji.parse(text, { folder: 'svg', ext: '.svg' })

import extractTweetData from './extractTweetData'

const app = express()

app.set('views', __dirname + '/tweet')
app.set('view engine', 'ejs')
app.engine('ejs', require('ejs').renderFile)

app.use('/assets', express.static(__dirname + '/tweet/assets'))

app.get('/tweet', async (req, res) => {
  // Load the tweet data from the url `tweetData` JSON query object
  const tweetData = await extractTweetData(req, res)
  const tweetDataEmojified = {
    ...tweetData,
    pseudo: emojify(tweetData.pseudo),
    content: emojify(tweetData.content),
    quoted: tweetData.quoted && tweetData.quoted.content ? {
      ...tweetData.quoted,
      pseudo: emojify(tweetData.quoted.pseudo),
      content: emojify(tweetData.quoted.content)
    } : null
  }

  // Check if a custom template was asked
  if (['no-stats'].some(x => x === req.query.style)) res.render(req.query.style, { tweetData: { ...tweetDataEmojified } })
  else res.render('classic', { tweetData: { ...tweetDataEmojified } })
})

app.listen()
