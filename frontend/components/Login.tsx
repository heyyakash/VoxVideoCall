import { createUser, loginUser } from '@/api/user'
import Logo from '@/components/Logo'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiFillApple, AiOutlineArrowRight, AiOutlineGoogle, AiOutlineUser } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import { FcPortraitMode } from 'react-icons/fc'
import { MdOutlineAlternateEmail } from 'react-icons/md'
import Link from 'next/link'
import { getGoogleUrl } from '@/helpers/googleOAuth'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [name, setName] = useState("")
  const [image, setImage] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>("login")

  const from = (router.query.from as string) || router.pathname || '/';

  const isValidURL = (url: string) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isValidURL(image)) {
      const result = await createUser(name, image,email, password)
      if (result?.success) {
        localStorage.setItem("vox_user", result.message)
        router.push('/profile')
      }
    }else{
      alert("Invalid Image url")
    }

  }
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await loginUser(email, password)
    if (result?.success) {
      // localStorage.setItem("vox_email", email)
      // localStorage.setItem("vox_user", result.message)
      router.push('/profile')
    }else{
      showToastMessage(result.message)
    }
  }


  const showToastMessage = (msg:string) => {
    console.log(msg)
    toast.error(msg,{
      position:toast.POSITION.TOP_RIGHT
    })
  }

  return (
    <section className='min-h-[100vh] w-full relative bg-[url("/canvas3.jpg")] bg-opacity-10 bg-cover md:bg-contain  bg-no-repeat'>
      <ToastContainer />
      <div className=' absolute inset-0 z-10 flex-center  bg-black/70 flex-col gap-[2rem]'></div>

      <div className='w-full h-full flex flex-col items-center relative  text-center  z-10 py-[4rem]' >
        <Logo />
        <h1 className='text-4xl my-4'>{mode === "login" ? "Login to your account" : "Create Account"}</h1>
        <p className='text-sm md:text-lg' >Create an account to have high quality video calls</p>
        <form onSubmit={mode === "login" ? (e) => handleLogin(e) : (e) => handleSignUp(e)} autoComplete='off' className='flex flex-col md:w-auto gap-6 mt-12 w-full items-center'>
          {mode === "signup" ? (
            <div className="flex flex-col lg:flex-row gap-6 w-full">

              <div className='input-container'>
                <AiOutlineUser className='text-xl' />
                <input value={name}  onChange={(e) => setName(e.target.value)} required type="text" className='input-sec' placeholder=' Name' />
              </div>
              <div className='input-container'>
                <FcPortraitMode className='text-xl' />
                <input value={image}  onChange={(e) => setImage(e.target.value)} required type="text" className='input-sec' placeholder='Image link' />
              </div>


            </div>
          ) : (<></>)}
          <div className="flex flex-col lg:flex-row items-center gap-6 w-full">

            <div className='input-container'>
              <MdOutlineAlternateEmail className='text-xl' />
              <input  value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className='input-sec' placeholder='Email' />
            </div>
            <div className='input-container'>
              <RiLockPasswordLine className='text-xl' />
              <input  value={password} onChange={(e) => setPassword(e.target.value)} required type="password" className='input-sec' placeholder='Password' />
            </div>
            {mode === "login" ? (<button type='submit' className='rounded-full bg-blue-600 text-xl  grid place-items-center h-[65px] w-[65px]'><AiOutlineArrowRight /></button>) : (<></>)}

          </div>
          {mode === "signup" ? (<button type='submit' className='rounded-full bg-blue-600 text-xl  grid place-items-center h-[65px] w-[65px]'><AiOutlineArrowRight /></button>) : (<></>)}
        </form>
        <p className='mt-5 cursor-pointer'>Have an account already ?<span onClick={() => setMode(mode === "login" ? "signup" : "login")} className='text-blue-600'>{mode === "login" ? "Sign up" : "Sign in"}</span></p>
        <div className='flex mt-12 gap-6 itemse-center text-start'>
          <Link href = {getGoogleUrl(from)} className='oauthbox'>
            <AiOutlineGoogle className='text-3xl' />
            <p className='mt-4'>Sign up</p>
            <h5 className='font-[600]'>with Google</h5>
          </Link>
        </div>
      </div>


    </section>
  )
}

export default Login