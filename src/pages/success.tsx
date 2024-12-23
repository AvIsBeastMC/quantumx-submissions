import { cn } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { Manrope } from './_app'
import { CheckCheck } from 'lucide-react'
import Typewriter from 'typewriter-effect'
import { useRouter } from 'next/router'

const Success = () => {
  const router = useRouter();
  const [seconds, setSeconds] = useState<number>(5)

  useEffect(() => {
    setInterval(() => {
      setSeconds((s) => s > 0 ? s - 1 : 0);
    }, 1000)
    setTimeout(() => {
      void router.push('/')
    }, 5000)
  }, [])

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
            }} />
          </div>
          <h1 className={cn('text-center text-4xl md:text-5xl font-bold', Manrope.className)}>
            Thank you for your submission!
          </h1>

          <div className='mt-4 w-3/4 md:w-full flex flex-col items-center'>
            <span>You can safely leave this page now</span>
            <span className='font-medium'>
              This page is now being redirected to the initial login page in {seconds} seconds
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Success