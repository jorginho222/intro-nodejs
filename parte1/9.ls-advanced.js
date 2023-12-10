const fs = require('node:fs/promises')
const path = require('parte1/path')
const folder = process.argv[2] ?? '.'
const pc = require('picocolors')

async function ls (folder) {
  let files
  try {
    files = await fs.readdir(folder)
  } catch {
    console.error(pc.red(`No se pudo leer el directorio ${folder}`))
    process.exit(1)
  }

  const filePromises = files.map(async file => {
    const filePath = path.join(folder, file)
    let fileStats
    try {
      fileStats = await fs.stat(filePath) // informacion de cada archivo
    } catch {
      console.error(`No se pudo leer el archivo ${filePath}`)
    }

    const isDirectory = fileStats.isDirectory()
    const fileType = isDirectory ? 'd' : 'f'
    const fileSize = fileStats.size
    const fileModified = fileStats.mtime.toLocaleString()

    return `${fileType.padEnd(3)} ${pc.blue(file.padEnd(30))} ${pc.green(fileSize.toString().padStart(10))} ${pc.yellow(fileModified)}`
  })

  const filesInfo = await Promise.all(filePromises)

  filesInfo.forEach(fileInfo => console.log(fileInfo))
}

ls(folder).then(r => r)
