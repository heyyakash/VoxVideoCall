import { getUser } from '@/api/user'
import { useRouter } from 'next/router'
import { FC, FormEvent, MouseEvent, useEffect, useState } from 'react'
import { BiSend } from 'react-icons/bi'
import Message from './Message'
import { message } from '@/types/message'
import { BsChatFill, BsChatLeftFill } from 'react-icons/bs'

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

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(msg.length===0) return
    console.log("clicked")
    const {test:room} = router.query

    if(connection && user){
      
      const Event :message = {
        message:msg,
        email: user,
        event:"send-message",
        roomid:room as string
      }
      console.log(Event)
      try{
        connection.send(JSON.stringify(Event))
        console.log("sent") 
        setMsg("")
      }catch(err){
        console.log(err)
      }
      
    }
  }



  return (
    <div className="h-full w-full flex flex-col bg-black/20 rounded-lg">
      <div className='w-full p-5 h-[100px] border-b border-b-black flex items-center'>
        <BsChatFill className='text-2xl mx-3 text-sec' />
        <div className='ml-auto rounded-full w-[50px] h-[50px] overflow-hidden'>
          <img className='object-cover h-full w-full' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTlZhqdo9H286H_3WJjc0s1UfcFwPtZhiMYw&usqp=CAU" alt="avatar" />
        </div>
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
      <form onSubmit={(e)=>sendMessage(e)} className=" w-full mt-auto flex border-t border-t-black">
        <input value = {msg} onChange={(e)=>setMsg(e.target.value)} type="text" placeholder='Enter Your Message' className="w-full h-[50px] p-2 bg-transparent font-semibold text-white outline-none" />
        <button type="submit" className="w-[55px] grid place-items-center text-xl"><BiSend className='text-sec' /></button>
        {/* <button type = "submit" ><BiSend className='text-sec' /></button> */}
      </form>
    </div>
  )
}

export default Chat   