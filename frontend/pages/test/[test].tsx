import { getUser } from '@/api/user'
import Loading from '@/components/Loading'
import NOSSRWrapper from '@/components/NOSSRWrapper'
import Room from '@/components/Room'
import { message } from '@/types/message'
import { userDetails } from '@/types/userDetails'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Test = () => {
  const [loading,setLoading] = useState(true)
  const router = useRouter()
  const [data,setData] = useState<userDetails| null>(null)
  const getUserDetails = async () => {
    const d = await getUser()
    if (!d.success) router.push('/login')
    else{
      setData(d.message)
      console.log(d.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [])

  if (loading) {
    return <Loading />
  }
  return data && <NOSSRWrapper><Room user = {data} /></NOSSRWrapper>
}

export default Test