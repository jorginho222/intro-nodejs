// para transformar el fs en fs/promise. En caso de q algun modulo nativo no tuviera disponible el promise
// const {promisify} = require('node:util')
// const readFilePromise = promisify(fs.readFile)

const fs = require('node:fs/promises')

console.log('leyendo el 1er archivo')
fs.readFile('./archivo.txt', 'utf-8')
    .then(data => {
        console.log('1ero: ', data)
    })

console.log('hacer cosas mientras lee el arch...')

console.log('leyendo el 2do archivo')
fs.readFile('./archivo2.txt', 'utf-8')
    .then(data => {
        console.log('2do: ', data)
    })

