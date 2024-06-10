import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/notification/Notification'
import ProfilePage from './pages/profile/ProfilePage'
import { Toaster } from 'react-hot-toast'
function App() {
	return (
		<div className='flex max-w-6xl mx-auto'>
			<Sidebar />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<Signup/>} />
				<Route path='/login' element={<Login />} />
				<Route path="/notifications" element={<NotificationPage />} />
				<Route path="/profile/:username" element={<ProfilePage />}/>
			</Routes>
			<RightPanel />
			<Toaster />
		</div>
	);
}

export default App
