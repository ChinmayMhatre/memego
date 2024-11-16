import { usePrivy } from '@privy-io/react-auth'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const mapbox = () => {
    const { authenticated, ready, logout } = usePrivy()
    const navigate = useNavigate()
    useEffect(() => {
        if (!authenticated && ready) {
            navigate('/login')
        }
    }, [authenticated, ready, navigate])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div>
            mapbox
            <button 
                onClick={handleLogout}
                className=" bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
                Logout
            </button>
        </div>
  )
}

export default mapbox