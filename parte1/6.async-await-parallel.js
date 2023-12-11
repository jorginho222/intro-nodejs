const {readFile} = require('node:fs/promises');

console.log('(Arrancan las promises) Leyendo archivos...')

// start the promises at same time (in parallel)
Promise.all([
    readFile('./archivo.txt', 'utf-8'),
    readFile('./archivo2.txt', 'utf-8')
]).then(([text1, text2]) => {
    console.log('1ero: ', text1)
    console.log('2do: ', text2)
    console.log(calc)
})

console.log('resolviendo calculo...')
const calc = 222222222 * 22222 / 55 * 5 / 8 - 66 * 8 * 10000000




