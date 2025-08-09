import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Outlet, replace, Route, Routes, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './components/Login'
import Signup from './components/Signup'

const App = () => {

  const navigate = useNavigate()
  const[currentUser, setCurrentUser] = useState(()=>{
    const stored = localStorage.getItem('currentUser')
    return stored ? JSON.parse(stored) : null;
  })

  useEffect(()=>{
    if(currentUser){
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    }else{
      localStorage.removeItem('currentUser')
    }
  },[currentUser]);

  const handleAuthSubmit=(data)=>{
    const user = {
      email:data.email,
      name:data.name || 'User',
      avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`
    }
    setCurrentUser(user)
    navigate('/', {replace:true})
  }

  const handleLogout=()=>{
    localStorage.removeItem('token')
    setCurrentUser(null);
    navigate('/login', {replace:true})
  }

  const protectedLayout=()=>{
    <Layout user={currentUser} onLogout={handleLogout} >
      <Outlet />
    </Layout>
  }

  return (
    <div>
      <Routes>
        <Route path='/login' element={<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center '>
          <Login onSubmit={handleAuthSubmit} onSwitchMode={()=>navigate('/signup')} />
        </div>} />

        <Route path='/signup' element={<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center '>
          <Signup onSubmit={handleAuthSubmit} onSwitchMode={()=>navigate('/login')} />
        </div>} />
        <Route path='/' element={<Layout />} />
      </Routes>
    </div>
  )
}

export default App