import React from 'react'
import { Button } from './components/ui/button'

const ArWindow = () => {
  return (
    <div className=' p-7 h-screen bg-gradient flex flex-col justify-center items-center gap-4 w-full'>
        <h1 className='text-xl bg-white rounded-lg font-bold w-[90%] h-[70vh]'>AR Window</h1>
        <Button className='bg-blue-400  text-black ' size={'lg'}>Collect Coin</Button>
    </div>
  )
}

export default ArWindow