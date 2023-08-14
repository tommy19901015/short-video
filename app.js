const express = require('express')
const ejs = require('ejs')
const fs = require('fs')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger.json')

const cors = require('cors')
const app = express()

const { setting_host, setting_port } = require('./setting')

app.use(cors())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

// 定義一個獲取伺服器位址和連接埠的中間件
const getAddress = (req, res, next) => {
  const address = req.app.listen().address()
  const host = address.address === '::' ? setting_host : address.address

  res.locals.host = host
  res.locals.serverAddress = `http://${host}:${setting_port}`
  next()
}

app.get('/following_list', getAddress, (req, res) => {
  /* #swagger.responses[200] = {
            description: 'Following list',
            schema: {
              "title": "標題",
              "cover": "預設圖",
              "play_url": "m3u8 URL"
            }
    } */
  fs.readFile('database/following.ejs', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('Internal Server Error')
      return
    }

    const template = ejs.compile(data)
    const json = template({ server: res.locals.host, port: setting_port })
    res.json(JSON.parse(json))
  })
})

app.get('/for_you_list', getAddress, (req, res) => {
  /* #swagger.responses[200] = {
            description: 'For you list',
            schema: {
              "title": "標題",
              "cover": "預設圖",
              "play_url": "m3u8 URL"
            }
    } */
  fs.readFile('database/for_you.ejs', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('Internal Server Error')
      return
    }

    const template = ejs.compile(data)
    const json = template({ server: res.locals.host, port: setting_port })
    res.json(JSON.parse(json))
  })
})

app.get('/media/:title', getAddress, (req, res) => {
  /* #swagger.ignore = true */
  const path = req.path;

  // 檢查路徑中是否包含 .m3u8 副檔名
  if (path.endsWith('.m3u8')) {
    fs.readFile(`media/${req.params.title.replace('m3u8', 'ejs')}`, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('Internal Server Error')
        return
      }

      const template = ejs.compile(data)
      const m3u8 = template({ server: res.locals.host, port: setting_port })
      res.send(m3u8)
    })
  } else {
    const data = fs.readFileSync(`media/${req.params.title}`)
    res.send(data)
  }
})

app.get('/images/:title', getAddress, (req, res) => {
  /* #swagger.ignore = true */
  const data = fs.readFileSync(`images/${req.params.title}`)
  res.send(data)
})

const server = app.listen(setting_port, () => {
  const host = server.address().address === '::' ? setting_host : server.address().address
  console.log(`Server listening at http://${host}:${setting_port}`)
})
