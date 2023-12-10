const path = require('node:path')

// que tipo de barra separadora se usa en mi sist op (en los path)
console.log(path.sep)

// unir rutas
const filePath = path.join('content', 'subfolder', 'pepe', 'test.txt')
console.log(filePath)

const fileName = path.basename(filePath)
console.log(fileName)

const baseName = path.basename(filePath, '.txt')
console.log(baseName)

const extension = path.extname(filePath)
console.log(extension)
