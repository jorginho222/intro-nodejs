const fs = require('node:fs')

console.log('leyendo el 1er archivo')
const text = fs.readFileSync('./archivo.txt', 'utf-8')
console.log('1ero: ', text)

console.log('hacer cosas mientras lee el arch...')

console.log('leyendo el 2do archivo')
const text2 = fs.readFileSync('./archivo2.txt', 'utf-8')
console.log('2do: ', text2)

