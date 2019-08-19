# tweet-generator-microservice
Generate fake tweets images as a [Now](https://zeit.co/now) microservice.

Support [Twemoji](https://twemoji.twitter.com/) and tweet quotes.

## Usage
Append the following url queries to [https://tweet-generator.now.sh/screenshot](https://tweet-generator.now.sh/screenshot) generate a tweet image 

### Url query
| Name | Description |
| ---- | ----------- |
| `style` | Tweet template to use (see [Tweet templates](#tweet-templates)) |
| `tweetData` | Stringified JSON object containing tweet's data (see [Tweet data object](#tweet-data-object)) |

### Tweet templates
| Name | Description |
| ---- | ----------- |
| `classic` | Normal tweet (default if not specified) |
| `no-stats` | Normal tweet without statistics |

### Tweet data object
| Name | type | Required | Default |
| ---- | ---- | :------: | ------- |
| pseudo | `string` | ✅ |  |
| handle | `string` | ✅ |  |
| content | `string` | ✅ |  |
| verified | `boolean` |  | `false` |
| date | `Date` |  | Current date |
| retweets | `number` |  | `0` |
| likes | `number` |  | `0` |
| replies | `number` |  | `0` |
| avatar | `string` |  | [Default Twitter image](https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png) |
| quoted | `Object` - all of the above except `quoted` |  | No quote |

## Public demo
You can use the provided demo endpoint or host your own using [Now](https://zeit.co/now). Examples are given at the root of the website.

[https://tweet-generator.now.sh/](https://tweet-generator.now.sh/)

## Implementation example
The following ESM module script (`.mjs`) will generate a tweet image and download it to `generatedTweet.png`.

```js
import fs from 'fs'
import fetch from 'node-fetch'

const setup = async () => {
  // My future tweet data
  const tweet = {
    pseudo: 'My cool pseudo 🎉',
    handle: 'my_handle',
    content: 'My awesome tweet content 💖',
    verified: true,
    date: new Date(),
    retweets: 54371,
    likes: 54371,
    replies: 543,
    avatar: 'https://cdn.pixabay.com/photo/2016/03/09/16/47/woman-1246844_960_720.jpg',
    quoted: {
      pseudo: 'Quoted pseudo 🤷‍♂️',
      handle: 'quoted_handle',
      content: 'quoted tweet content',
      verified: true,
      date: new Date(Date.now() - 3694200),
      retweets: 1,
      likes: 14,
      replies: 21,
      avatar: 'https://cdn.pixabay.com/photo/2016/03/09/16/46/hiking-1246836__340.jpg'
    }
  }

  // Create the uri (encodeURI is important as stringified JSON can contain invalid query characters)
  const uri = encodeURI(`https://tweet-generator.now.sh/screenshot?style=classic&tweetData=${JSON.stringify(tweet)}`)
  const { body } = await fetch(uri)
    .then(async res => {
      // The endpoint returned errors, throw
      if (!res.ok) throw (await res.json()).errors.join(', ')
      return res
    })

  // Save the response body to an image file
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream('./generatedTweet.png')
    body.pipe(fileStream)
    body.on('error', err => reject(err))
    fileStream.on('finish', () => resolve())
  })
}

setup()
```

## Contributing
If you want to contribute to this project, you can open an [issue](https://github.com/rigwild/tweet-generator-microservice/issues) detailing your suggestions or bugs.

Feel free to open a [pull request](https://github.com/rigwild/tweet-generator-microservice/pulls).

## License
[The MIT license](./LICENSE)
