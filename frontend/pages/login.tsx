import { getUser } from '@/api/user'
import Loading from '@/components/Loading'
import Login from '@/components/Login'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const App = () => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const getUserDetails = async () => {
    const data = await getUser()
    if (data.success) router.push('/profile')
    else{
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [])

  if (loading) {
    return <Loading />
  }
  return <Login />
}


export default App