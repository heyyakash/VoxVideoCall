import { getUser } from '@/api/user'
import { useRouter } from 'next/router'
import { FC, FormEvent, MouseEvent, useEffect, useState } from 'react'
import { BiSend } from 'react-icons/bi'
import Message from './Message'
import { message } from '@/types/message'
import { BsChatFill, BsChatLeftFill } from 'react-icons/bs'
import { userDetails } from '@/types/userDetails'
import Loading from './Loading'
import {IoIosArrowRoundBack} from 'react-icons/io'

interface props {
  connection: WebSocket | undefined
  chats: message[]
  setChats:React.Dispatch<React.SetStateAction<message[]>>
  setToggleChat:React.Dispatch<React.SetStateAction<boolean>>
}

const Chat: FC<props> = ({ connection, chats, setChats ,setToggleChat}) => {
  const [user, setUser] = useState<userDetails | null>(null)
  const [msg, setMsg] = useState("")
  const [loading,setLoading] = useState(true)
  const [show,setShow] = useState(true)

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
    <div className = {` h-full  flex border-r ${!show?"":"w-full"} border-white/20 flex-col bg-black/20 rounded-lg`}>
      <div className='w-full px-5 h-[65.2px] border-b border-white/20 flex items-center'>
        <IoIosArrowRoundBack onClick={()=>setToggleChat(false)} className='text-4xl cursor-pointer trans text-sec' />
        <div className='ml-auto rounded-full w-[40px] h-[40px] overflow-hidden'>
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
      <form onSubmit={(e)=>sendMessage(e)} className=" w-full mt-auto flex border-t border-white/20">
        <input value = {msg} onChange={(e)=>setMsg(e.target.value)} type="text" placeholder='Enter Your Message' className="w-full h-[50px] p-2 bg-transparent font-semibold text-white outline-none" />
        <button type="submit" className={`w-[55px] grid place-items-center text-xl `}><BiSend className='text-sec' /></button>
        {/* <button type = "submit" ><BiSend className='text-sec' /></button> */}
      </form>
    </div>
  )
}

export default Chat   