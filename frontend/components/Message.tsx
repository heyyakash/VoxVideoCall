import { message } from "@/types/message"
import React from "react"

interface props {
  direction: string
  message: message
}

const Message: React.FC<props> = ({ direction, message }) => {
  return (
    <div style={{ float: direction as any, flexDirection : direction === "left"?"row-reverse":"row"}} className={`flex clear-both my-2 items-start gap-2`}>
      <div style={{ alignItems: direction === "right" ? "flex-end" : "flex-start" }} className={`flex flex-col gap-1 clear-both`}>
        <p className="text-sm font-semibold">{direction === "right" ? "You" : message.name}</p>
        <div style={{ background: direction === "right" ? "white" : "rgb(255 255 255 / 0.2)", color: direction === "right" ? "black" : "white" }} className="p-2 bg-white text-black rounded-lg text-sm font-semibold">
          {message.message}
        </div>
      </div>
      <div className="rounded-full w-6 h-6 bg-white overflow-hidden">
        <img src = {message.image} className="w-full h-full object-cover" alt="" />
      </div>
    </div>
  )
}

export default Message