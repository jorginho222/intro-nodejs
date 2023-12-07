const os = require('node:os')

console.log('Info del sist operativo: ')
console.log('_________________________')

console.log('Nombre del SO: ', os.platform())
console.log('Version del SO: ', os.release())
console.log('Arquitectura: ', os.arch())
console.log('CPUs', os.cpus())
console.log('Memoria libre', os.freemem() / 1024 / 1024)
console.log('Memoria total', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2), ' GB')