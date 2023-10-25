import React from "react"

interface props {
    direction: string
    message: string
}

const Message: React.FC<props> = ({direction,  message}) => {
  return (
    <div style={{float:direction as any, background:direction==="right"?"white":"rgb(255 255 255 / 0.2)", color:direction==="right"?"black":"white"}} className={`p-2 bg-white text-black rounded-md text-sm font-semibold clear-both my-2`}>
        {message}
    </div>
  )
}

export default Message