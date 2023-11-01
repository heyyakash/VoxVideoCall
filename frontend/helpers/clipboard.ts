import { Dispatch, SetStateAction } from "react"

export const copyRoomId = (text: string, setCopied: Dispatch<SetStateAction<boolean>>) => {
    try {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 3000)
    } catch (Err) {
        console.log(Err)
    }
}