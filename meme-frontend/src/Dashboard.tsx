import React, { useEffect } from 'react'
import { Button } from './components/ui/button'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePrivy } from '@privy-io/react-auth'
const Dashboard = () => {
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
    <div className=' p-7  bg-slate-100 w-full'>
        <div className="flex justify-between items-center">
        <h1 className='text-xl font-bold'>Welcome Back, <span className='text-blue-600 text-2xl '>John Pork</span></h1>
        <Button onClick={handleLogout}>
            <LogOut className='w-4 h-4'/>
        </Button>
        </div>
    <div className="flex pt-8 justify-center gap-4">
        <div className="p-4 w-full bg-white flex justify-between items-center rounded-lg">
            <h1 className='text-lg font-bold text-blue-600'>Portfolio Value</h1>
            <p className='text-lg font-bold'>$100</p>
        </div>
    </div>
    <h2 className='text-lg font-bold mt-4'>Your Memecoins</h2>
    <div className="bg-white rounded-lg mt-2 pb-4 px-2">
        {
            Array.from({length: 10}).map((_, index) => (        
        <div className="flex justify-between pt-4 px-4 items-center">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-blue-600 rounded-full"></div>
                <div className="flex flex-col">
                    <p className=' font-bold'>Memecoins</p>
                    <p className='text-sm text-gray-500'>0x1234567890</p>
                </div>
            </div>
            <p className='text-sm text-blue-600 font-bold'>$100</p>
        </div>))
        }
    </div>
    </div>
  )
}

export default Dashboard