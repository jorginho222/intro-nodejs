// process => informacion acerca del proceso q se esta ejecutando

console.log(process.argv) // argumentos pasados en ejec

// process.exit(1)

// controlar eventos del proceso
process.on('exit', () => {
    // ej. limpiar los recursos
})

// directorio sobre el cual estamoso ejecutando el proceso (NO ES DONDE ESTA EL ARCHIVO ESTE)
console.log(process.cwd())

// var de ent (globales)
console.log(process.env.CACHO)