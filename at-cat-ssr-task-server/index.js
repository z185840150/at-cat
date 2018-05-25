const express = require('express')
const bodyParser = require('body-parser')
const redis = require('promise-redis')()
const client = redis.createClient(6379, '127.0.0.1')
const fs = require('fs')

const app = express()
app.use(bodyParser.json({limit: '512kb'})) // application/json
app.use(bodyParser.urlencoded({ extended: false })) // application/x-www-form-urlencoded

// 接收后端生成基因的时候发过来的基因
app.post('/', (req, res, next) => {
  if (req.body && req.body.hash && req.body.gene) {
    client.set(`ssrender_${req.body.hash}`, req.body.gene)
      .then(result => {
        if (result === 'OK') res.json({ message: 'success' })
        else res.json({ message: 'failed' })
      })
      .catch(err => {
        console.error(err)
        res.json({ message: 'failed' })
      })
  } else {
    res.json({ message: 'failed' })
  }
})
// 公司渲染主机请求任务接口
app.get('/task', (req, res, next) => {
  let hash = ''
  client.keys('ssrender_*').then(keys => {
    if (keys.length > 0) return keys[0]
    else res.json({ message: 'error' })
  }).then(key => {
    hash = key
    return client.get(key)
  }).then(value => {
    res.json({ message: 'success', hash, gene: value })
  })
})
// 公司渲染主机发送过来图像接口
app.post('/img', (req, res, next) => {
  if (req.body && req.body.hash && req.body.data) {
    fs.writeFile(`c:\\www\\images\\cat\\${req.body.hash.replace('ssrender_', '')}.png`, req.body.data, function (err) {
      if (err) res.json({ message: 'error' })
      else client.del(req.body.hash); res.json({ message: 'success' })
    })
  } else res.json({ message: 'error' })
})

app.listen(8000, () => {
  console.log('艾特猫SSR任务服务器已启动')
})
