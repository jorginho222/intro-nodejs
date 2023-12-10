const fs = require('node:fs')

console.log('leyendo el 1er archivo')
fs.readFile('./archivo.txt', 'utf-8', (err, data) => {
  // execute this callback when the file reading is finished
  console.log('1ero: ', data)
})

console.log('hacer cosas mientras lee el arch...')

console.log('leyendo el 2do archivo')
fs.readFile('./archivo2.txt', 'utf-8', (err, data) => {
  console.log('2do: ', data)
})
