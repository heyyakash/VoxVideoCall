const host: string = process.env.NEXT_PUBLIC_BACKEND_URL as string

export const createUser = async (email: string, password: string) => {
    const result = await fetch(`${host}/user/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({email,password})
    })
    const res = await result.json()
    return res
} 

export const loginUser = async (email: string, password: string) => {
    const result = await fetch(`${host}/user/login`, {
        method: "POST",
        credentials:"same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({email,password})
    })
    const res = await result.json()
    return res
} 