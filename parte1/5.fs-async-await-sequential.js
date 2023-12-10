const { readFile } = require('node:fs/promises');

// IIFE: Immediately invoked function expression
(
  async () => {
    console.log('leyendo el 1er archivo...')
    const text = await readFile('./archivo.txt', 'utf-8')
    // aqui "se libera" el hilo, menos recursos. Pero hasta q no se resuelva, no pasa a ejecutar lo q sigue
    console.log('1ero: ', text)
    console.log('hacer cosas mientras lee el arch...')

    console.log('leyendo el 2do archivo...')
    const secondText = await readFile('./archivo2.txt', 'utf-8')
    console.log('2do: ', secondText)
  }
)()
