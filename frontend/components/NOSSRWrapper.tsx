import dynamic from 'next/dynamic'
import React, { FC, ReactNode } from 'react'

interface props {
    children : ReactNode
}

const NOSSRWrapper : FC<props> = props => {
  return <>{props.children}</>
}

export default dynamic(()=>Promise.resolve(NOSSRWrapper),{
    ssr:false
})