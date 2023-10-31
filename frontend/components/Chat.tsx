import { getUser } from '@/api/user'
import { useRouter } from 'next/router'
import { FC, use, useEffect, useState } from 'react'
import { BiSend } from 'react-icons/bi'
import Message from './Message'
import { message } from '@/types/message'
import { BsChatLeftFill } from 'react-icons/bs'

interface props {
  connection: WebSocket | undefined
  chats: message[]
  setChats:React.Dispatch<React.SetStateAction<message[]>>
}

const Chat: FC<props> = ({ connection, chats, setChats }) => {
  const [user, setUser] = useState<string | null>(null)
  const [msg, setMsg] = useState("")

  const router = useRouter()
  useEffect(() => {
    getUserDetails()
  }, [])

  const getUserDetails = async () => {
    const data = await getUser()
    if (!data.success) {
      router.push('/login')
    }
    // console.log(data)
    setUser(data.message)
  }

  const sendMessage = async () => {
    const {room} = router.query
    if(msg.length===0) return
    if(connection && user){
      // console.log("fired")
      const Event :message = {
        message:msg,
        email: user,
        event:"send-message",
        roomid:room as string
      }
      try{
        connection.send(JSON.stringify(Event))
        // setChats((chats)=>[...chats, Event])
      }catch(err){
        console.log(err)
      }
    }
  }



  return (
    <div className="h-full w-full flex flex-col bg-black/20 rounded-lg">
      <div className='w-full p-5 h-[93.3px] border-b border-b-black flex items-center'>
        <h3 className='text-xl font-semibold'>Chat</h3>
        <BsChatLeftFill className='text-2xl mx-3' />
      </div>
      <div className="w-full h-[80vh] overflow-auto p-3">
       {
        chats.map((chat,i)=>{
          if(chat?.event==="send-message")
          return(
            <Message key = {i} direction={user===chat?.email?'right':'left'} message={chat?.message} />
          )
        })
       }
      </div>
      <div className=" w-full mt-auto flex border-t">
        <input value = {msg} onChange={(e)=>setMsg(e.target.value)} type="text" placeholder='Enter Your Message' className="w-full h-[50px] p-2 bg-transparent font-semibold text-white outline-none" />
        <button onClick={()=>sendMessage()} className="w-[55px] grid place-items-center text-xl"><BiSend /></button>
      </div>
    </div>
  )
}

export default Chat   