import React, { FC, ReactNode } from 'react'
import { BsChat, BsFillChatFill } from 'react-icons/bs';
import { TbHandClick } from "react-icons/tb";
import { CiVideoOn } from "react-icons/ci";
import { MdOutlineCleaningServices } from "react-icons/md";



interface BoxProps {
  text: string
  Icon: ReactNode
}


export const Box: FC<BoxProps> = ({ text, Icon }) => {
  return (
    <div className='bg-slate-900/40 h-[300px] w-full rounded-md gap-3 flex-center text-4xl flex-col'>
      {Icon}
      <p className='text-sm w-[120px] text-center'>{text}</p>
    </div>
  )
}


const Features = () => {
  return (
    <section className='my-[5rem] w-full'>
      <div className='max-w-[1200px] w-full p-4 md:p-0 mx-auto'>
        <h3 className='text-4xl font-semibold' >Features</h3>
        <div className='grid grid-cols-1 grid-rows-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-1 gap-5 my-5 md:grid-rows-2 '>
          <Box text='One Click Room Creation' Icon = {<TbHandClick />} />
          <Box text='Seamless Video calls' Icon = {<CiVideoOn />} />
          <Box text='Inbuilt Chat' Icon = {<BsChat />} />
          <Box text='Clean UI' Icon = {<MdOutlineCleaningServices />} />
        </div>
      </div>
    </section>
  )
}



export default Features