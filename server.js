require('dotenv').config();

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const port = process.env.PORT;

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res) => {
  res.send('Hello');
});

app.post('/dgif',(req,res) => {
  const giphyApiKey = process.env.GIPHY_API_KEY;
  const slackToken = process.env.SLACK_TOKEN;
  const { text, token } = req.body;

  if (!token || token !== slackToken) {
    return res.send('Incorrect or missing token information. Naughty')
  }

  if (!text || text.trim().length === 0) {
    return res.send('Missing a search string. Did you forget to type something?')
  }

  const search = encodeURIComponent(text.trim());

  const url = `http://api.giphy.com/v1/gifs/search?q=the+office+${search}&api_key=${giphyApiKey}&limit=100&offset=0`;

  axios.get(url).then((response) => {
    const {data} = response.data;

    let gifs = data.filter((gif) => {
      const doesIncludeTheOffice = gif.slug.includes('the-office') || gif.source.includes('the-office');
      const doesIncludeSearch = gif.slug.includes(search) || gif.source.includes(search);

      return doesIncludeTheOffice && doesIncludeSearch;
    });

    if (gifs.length === 0) {
      gifs = data.filter((gif) => {
        return doesIncludeTheOffice = gif.slug.includes('the-office') || gif.source.includes('the-office');
      });
    }

    if (gifs.length === 0) {
     return res.send(`No gifs found for "${text}"`);
    }

    const gif = _.sample(gifs);

    res.send({
      response_type: 'in_channel',
      attachments: [{
        image_url: gif.images.fixed_height.url
      }]
    });
  }).catch((e) => {
    res.send('error');
  });

});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };