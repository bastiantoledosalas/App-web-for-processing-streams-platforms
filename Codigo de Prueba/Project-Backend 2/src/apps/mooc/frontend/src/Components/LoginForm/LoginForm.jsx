import React, { useState } from 'react'
import './LoginForm.css'
import Card from '../Card/Card'
import GoogleIcon from '@mui/icons-material/Google'
import { database } from '../../utils/database'

const LoginForm = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessages, setErrorMessages] = useState({})

  const errors = {
    username: 'Nombre de usuario invalido',
    password: 'Password invalido',
    noUsername: 'Porfavor ingrese su usuario',
    noPassword: 'Porfavor ingrese su contraseña'
  }

  const handleSubmit = (e) => {
    // Previene la recarga de la página
    e.preventDefault()

    if (!username) {
      // Si el campo de usuario está vacío
      setErrorMessages({ name: 'noUsername', message: errors.noUsername })
      return
    }

    if (!password) {
      // Si el campo de contraseña está vacío
      setErrorMessages({ name: 'noPassword', message: errors.noPassword })
      return
    }

    // Busca las credenciales de usuario
    const currentUser = database.find((user) => user.username === username)

    if (currentUser) {
      if (currentUser.password !== password) {
        // Contraseña incorrecta
        setErrorMessages({ name: 'password', message: errors.password })
      } else {
        // Password correcto, login de usuario
        setErrorMessages({})
        setIsLoggedIn(true)
      }
    } else {
      // El nombre de usuario no existe en la DB
      setErrorMessages({ name: 'username', message: errors.username })
    }
  }

  // Mensajes de error de render
  const renderErrorMsg = (name) =>
    name === errorMessages.name && (
      <p className="error_msg">{errorMessages.message}</p>
    )

  return (
    <Card>
      <h1 className="title">Iniciar Sesión</h1>
      <p className="subtitle">Iniciar sesión en el simulador</p>
      <form onSubmit={handleSubmit}>
        <div className="inputs_container">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {renderErrorMsg('username')}
          {renderErrorMsg('noUsername')}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {renderErrorMsg('password')}
          {renderErrorMsg('noPassword')}
        </div>
        <input type="submit" value="Iniciar Sesión" className="login_button" />
      </form>
      <div className="link_container">
        <a href="#" className="small">
          Olvidé la contraseña
        </a>
      </div>
      <p className="g_login">O iniciar sesión con:</p>
      <div className="icons">
        <GoogleIcon className="icon" />
      </div>
    </Card>
  )
}

export default LoginForm
