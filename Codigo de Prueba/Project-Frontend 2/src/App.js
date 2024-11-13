import React from 'react'
import Sidenav from './Sidenav'
import {Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from "./pages/settings";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home/>}></Route>
        <Route path="/about" exact element={<about/>}></Route>
        <Route path="/settings" exact element={<settings/>}></Route>
          
      </Routes>
    </BrowserRouter>
  )
}
