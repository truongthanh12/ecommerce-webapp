const https = require('https');
const fs = require('fs');
const paths = require('../routing/path')
const pattern = require('../routing/pattern');
const express = require('express')
const compression = require('compression')
const next = require('next')
const cache = require("./cache")
const { loadEnvConfig } = require('@next/env')
const cookieParser = require('cookie-parser')
const projectDir = process.cwd()
loadEnvConfig(projectDir)
const port = parseInt(process.env.PORT, 10) || 3100
const dev = process.env.NEXT_PUBLIC_NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PATTERN_LIST_410 = [
  pattern.P_410.CATEGORY, pattern.P_410.COLLECTION, pattern.P_410.TAG,
  pattern.P_410.VOD, pattern.P_410.VOD_EPS, pattern.P_410.CHAPTER_LIST,
  pattern.P_410.RECOMMENDED, pattern.P_410.VOD_REL
]
const PATTERN_LIST_DUPLICATE = [
  pattern.PAGE_MENU, pattern.PAGE_TAG, pattern.PAGE_RIBBON
]

app.prepare().then(() => {
  const server = express()
  server.use(cookieParser())
  server.use(compression())

  const { staticPath } = paths
  server.use(express.static(staticPath, {
    maxAge: '30d',
    immutable: true
  }))

  // only local
  if (dev) {
    server.get('*.map', (req, res) => {
      return res.sendStatus(404)
    })
    server.get('*/assets/*', (req, res) => {
      return res.sendStatus(404)
    })
    server.get('*/fonts/*', (req, res) => {
      return res.sendStatus(404)
    })
  }
  
  server.post('/events', (req, res) => {
    return res.send("success")
  })
  
  server.post('/events/', (req, res) => {
    return res.send("success")
  })

  server.get('/reset-cache', (req, res) => {
    cache.resetCache()
    return res.send("success")
  })

  server.get('/readiness', (req, res) => {
    return res.send("ok")
  })

  server.get('/:slug--rel-:rel.html', (req, res) => {
    return app.render(req, res, `/[slug].html`, {...req.params, ...req.query})
  })

  server.get('/:slug--eps-:eps.html', (req, res) => {
    return app.render(req, res, `/[slug].html`, {...req.params, ...req.query})
  })

  server.get('/:slug.html', (req, res) => {
    return app.render(req, res, `/[slug].html`, {...req.params, ...req.query})
  })

  PATTERN_LIST_DUPLICATE.forEach(item => {
    server.get(item, (req, res) => {
      return handle(req, res)
    })
  })

  PATTERN_LIST_410.forEach(item => {
    server.get(item, (req, res) => {
      if(req.params.category !== 'truyen-hinh-truc-tuyen' &&
        req.params.category !== 'smart-tv' &&
        req.params.category !== 'in-app'
      ) {
        res.status(410)
        return app.render(req, res, '/page-410', req.params)
      } else {
        return handle(req, res)
      }
    })
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  const startServer = () => {
    server.use(handle).listen(port, () => {
      //console.log(`>Server Ready on http://localhost:${port} `)
    })
  }

  const certOptions = {
    key: fs.readFileSync(__dirname + '/../certificate/localhost.key'),
    cert: fs.readFileSync(__dirname + '/../certificate/localhost.crt')
  };
  const httpsServer = https.createServer(certOptions, server);
  if (dev) {
    httpsServer.listen(443);
  } else {
    startServer()
  }
})

const customRender = async (req, res, page, query) => {
  //get key cache
  const key = cache.getCacheKey(req)
  //check key cache is allow to cache
  if (dev || !cache.isAllowCache(key)) {
    app.render(req, res, page, query)
    return
  }
  // If we have a page in the cache, let's serve it
  if (cache.isExistCache(key)) {
    res.setHeader('x-cache', 'HIT')
    res.send(cache.getCache(key))
    return
  }
  // No cache present for specific key? let's try to render and cache
  try {
    // console.log("No cache found! Let render from api")
    const html = await app.renderToHTML(req, res, page, query)
    // If something is wrong with the request, let's not cache
    // Send the generated content as is for further inspection
    if (res.statusCode !== 200) {
      res.setHeader('x-cache', 'SKIP')
      res.send(html)
      return
    }
    // Everything seems OK... let's cache
    cache.setCache(key, html)
    res.setHeader('x-cache', 'MISS')
    res.send(html)
  } catch (err) {
    // console.log("Something was wrong!", error.message)
    app.renderError(err, req, res, page, query)
  }
}
