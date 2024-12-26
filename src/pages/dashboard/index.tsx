import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import MainMode from '~/components/admin/Main';
import { api } from '~/utils/api';

const Dashboard = () => {
  const [mode, setMode] = useState<'login' | 'main'>('login');
  const [authenticated, setAuthenticated] = useState<boolean>(false)

  const LoginMode = () => {
    const { mutate } = api.admin.login.useMutation();

    const [usernameInput, setUsernameInput] = useState<string>()
    const [passwordInput, setPasswordInput] = useState<string>();

    const [loading, setLoading] = useState<boolean>(false)

    const login = (e: React.FormEvent) => {
      e.preventDefault();

      if (!usernameInput || !passwordInput) return toast.error('Please enter both username and password.');

      setLoading(true);

      mutate({
        username: usernameInput,
        password: passwordInput
      }, {
        onSuccess(d) {
          if (d == true) {
            setAuthenticated(true);
            setMode('main')
          } else {
            return toast.error('Bad Credentials')
          }
        },
        onError(e) {
          setLoading(false);
          return toast.error('You are not permitted to login')
        }
      })
    }

    return (
      <>
        <section className="text-gray-600 body-font relative">
          <div className="container px-5 py-12 mx-auto">
            <div className="flex flex-col text-center w-full mb-12">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Login - Admin Dashboard</h1>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Enter username and password below.</p>
            </div>
            <div className="lg:w-1/2 md:w-2/3 mx-auto">
              <form onSubmit={login} className="flex flex-wrap -m-2">
                <div className="p-2 w-1/2">
                  <div className="relative">
                    <label htmlFor="name" className="leading-7 text-sm text-gray-600">Username</label>
                    <input onChange={(e) => setUsernameInput(e.currentTarget.value)} required type="text" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                  </div>
                </div>
                <div className="p-2 w-1/2">
                  <div className="relative">
                    <label htmlFor="email" className="leading-7 text-sm text-gray-600">Password</label>
                    <input onChange={(e) => setPasswordInput(e.currentTarget.value)} required type="password" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                  </div>
                </div>

                <button type='submit' className='hover:opacity-75 transition-all font-bold px-4 py-2 rounded-md bg-gray-200 flex mx-auto mt-4'>
                  LOGIN
                </button>
              </form>
            </div>
          </div>
        </section>
      </>
    )
  };

  return (
    <>
      {mode == 'login' ? <LoginMode /> : <MainMode />}
      <Toaster />
    </>
  )
}

export default Dashboard