import { cn } from '@nextui-org/react'
import React from 'react'
import { Manrope } from './_app'
import { CheckCheck } from 'lucide-react'
import Typewriter from 'typewriter-effect'

const Success = () => {


  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center p-4">
          <div className='font-bold text-2xl flex flex-row items-center mb-4 gap-2'>
            {/* <CheckCheck size={48} /> */}
            <img className='w-8 bg-black rounded-full p-1' src="https://register.thequantumx.xyz/icon2.png" alt="" />
            <Typewriter options={{
              strings: 'QUANTUMX',
              autoStart: true,
              loop: true, 
              delay: 100
            }}  />
          </div>
          <h1 className={cn('text-2xl font-bold', Manrope.className)}>
            Thank you for your submission!
          </h1>
          <span className='mt-2'>You can safely leave this page now.</span>
        </div>
      </div>
    </>
  )
}

export default Success