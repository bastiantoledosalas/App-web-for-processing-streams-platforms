import React from 'react'
import './LoggedIn.css'

const LoggedIn = ({ setIsLoggedIn }) => {
  return (
    <>
      <h1 className="title">Sesión iniciada!</h1>
      <button className="back_button" onClick={() => setIsLoggedIn(false)}>
        Regresar
      </button>
    </>
  )
}

export default LoggedIn
