import { usePrivy } from '@privy-io/react-auth'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const login = () => {
    const { login, authenticated, ready } = usePrivy()
    const navigate = useNavigate()

    useEffect(() => {
        if (authenticated && ready) {
            navigate('/')
        }
    }, [authenticated, ready, navigate])

    return (
        <div className="w-screen flex justify-center items-center bg-slate-400 h-screen">
            <div className='flex flex-col gap-4 bg-white shadow-lg my-auto w-[90%] md:w-[50%] mx-auto rounded-xl min-h-96 justify-center items-center'>
                <h1 className='text-2xl font-bold'>Welcome to memego</h1>
                <button className='bg-red-500 text-white px-4 py-2 rounded-md' onClick={() => login()}>Connect your wallet</button>
            </div>
        </div>
    )
}

export default login