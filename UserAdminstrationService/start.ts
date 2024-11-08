
//Se importa la clase principal encargada de controlar el ciclo de vida del servidor http
import { BackendApp } from './BackendApp'

// Se implementa try-catch para manejar cualquier error que pueda ocurrir durante la creación e inicio de una instancia de BackendApp
try {

  // Se crea una nueva instancia de BackendApp y se llama al método start responsable de iniciar el servidor htpp
  // Se usa void puesto que no se espera ningún retorno del método start
  void new BackendApp().start()
} catch (error) {

  // Se registra el error en la consola 
  console.error(error)

  // Se termina el proceso de Node.js con un código de salida 1, indica que el error que ocurrio no se pudo controlar
  process.exit(1)
}

// Se registra un controlador de eventos para uncaughtException
// uncaughtException es un evento que se dispara cuando una excepción no controlada ocurre
process.on('uncaughtException', (err) => {

  // Se imprime por consola el mensaje de error con el prefijo uncaughtException
  console.error('uncaughtException', err)

  // Se termina el proceso de Node.js con un código de salida 1, indica que se produjo una excepeción no controlada señalando un fallo critico
  process.exit(1)
})
