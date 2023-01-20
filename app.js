require('dotenv').config()

const fetch = require('node-fetch')
const path = require('path')
const express = require('express')

const app = express()
const port = process.env.PORT || 3000

const Prismic = require('@prismicio/client')
const PrismicH = require('@prismicio/helpers')

// Initialize the prismic.io api
const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch
})
}

const HandleLinkResolver = (doc) => {
  return '/'
}
// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: HandleLinkResolver
  }
  res.locals.PrismicH = PrismicH

  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const handleRequest = async (api) => {
  const [about] = await Promise.all([
    api.getSingle('about'),
    api.query(Prismic.Predicates.at('document.type', 'collection'), {
      fetchLinks: 'product.image'
    })
  ])

  const assets = []
  about.data.gallery.forEach((item) => {
    assets.push(item.image.url)
  })

  about.data.body.forEach((section) => {
    if (section.slice_type === 'gallery') {
      section.items.forEach((item) => {
        assets.push(item.image.url)
      })
    }
  })

  return {
    about
  }
}

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('pages/home', {
    ...defaults
  })
})

app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('pages/about', {
    ...defaults
  })
})

app.get('/collection', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('pages/collection', {
    ...defaults
  })
})

app.get('/detail/:uid', (req, res) => {
  res.render('pages/detail')
})

app.listen(port, () => {
  console.log(`Example app listening on port  http://localhost:${port}`)
})