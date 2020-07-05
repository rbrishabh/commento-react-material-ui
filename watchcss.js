const chokidar = require('chokidar')
const fs = require('fs')
const path = require('path')
// One-liner for current directory
chokidar.watch('./src/commento-style.css').on('all', (event, filePath) => {
  console.log(event, filePath)
  fs.copyFileSync(
    path.resolve('.', filePath),
    path.resolve('./dist/commento-style.css')
  )
})
