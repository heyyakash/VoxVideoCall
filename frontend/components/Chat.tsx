import { getUser } from '@/api/user'
import { useRouter } from 'next/router'
import { FC, FormEvent, MouseEvent, useEffect, useState } from 'react'
import { BiSend } from 'react-icons/bi'
import Message from './Message'
import { message } from '@/types/message'
import { BsChatFill, BsChatLeftFill } from 'react-icons/bs'
import { userDetails } from '@/types/userDetails'
import Loading from './Loading'

interface props {
  connection: WebSocket | undefined
  chats: message[]
  setChats:React.Dispatch<React.SetStateAction<message[]>>
}

const Chat: FC<props> = ({ connection, chats, setChats }) => {
  const [user, setUser] = useState<userDetails | null>(null)
  const [msg, setMsg] = useState("")
  const [loading,setLoading] = useState(true)

  const router = useRouter()
  useEffect(() => {
    getUserDetails()
  }, [])

  const getUserDetails = async () => {
    const data = await getUser()
    if (!data.success) {
      router.push('/login')
    }
    setUser(data.message)
    setLoading(false)
  }

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(msg.length===0) return
    const {test:room} = router.query

    if(connection && user){
      
      const Event :message = {
        message:msg,
        email: user?.email,
        event:"send-message",
        roomid:room as string,
        name:user?.name,
        image: user?.image
      }
      try{
        connection.send(JSON.stringify(Event))
        setMsg("")
      }catch(err){
        console.log(err)
      }
      
    }
  }


  if(loading){
    return <Loading  />
  }
  return (
    <div className=" h-full w-full flex flex-col bg-white/5 rounded-lg">
      <div className='w-full p-5 h-[70px] lg:h-[82.4px] border-b border-b-black flex items-center'>
        <BsChatFill className='text-2xl mx-3 text-sec' />
        <div className='ml-auto rounded-full w-[50px] h-[50px] overflow-hidden'>
          <img className='object-cover h-full w-full' src={user?.image} alt="avatar" />
        </div>
      </div>
      <div className="w-full h-[80vh] overflow-auto p-3">
       {
        chats.map((chat,i)=>{
          if(chat?.event==="send-message")
          return(
            <Message key = {i} direction={user?.email===chat?.email?'right':'left'} message={chat} />
          )
        })
       }
      </div>
      <form onSubmit={(e)=>sendMessage(e)} className=" w-full mt-auto flex border-t border-t-black">
        <input value = {msg} onChange={(e)=>setMsg(e.target.value)} type="text" placeholder='Enter Your Message' className="w-full h-[50px] p-2 bg-transparent font-semibold text-white outline-none" />
        <button type="submit" className="w-[55px] grid place-items-center text-xl"><BiSend className='text-sec' /></button>
        {/* <button type = "submit" ><BiSend className='text-sec' /></button> */}
      </form>
    </div>
  )
}

export default Chat   