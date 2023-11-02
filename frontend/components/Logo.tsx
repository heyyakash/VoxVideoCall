import React, { FC } from 'react'

interface props{
    version? : 'standard' | 'lite'
}

const Logo : FC<props> = ({version}) => {
    
    return (
        <h1 className='font-logo text-[2rem] text-red-400 '>{
        !version || version ==="standard"?"VOX":"V"
        }</h1>
    )
}

export default Logo