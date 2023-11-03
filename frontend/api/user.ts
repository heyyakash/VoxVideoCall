const host: string = process.env.NEXT_PUBLIC_BACKEND_URL as string

export const createUser = async (name:string, image:string, email: string, password: string) => {
    const result = await fetch(`${host}/user/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({name,image,email,password})
    })
    const res = await result.json()
    return res
} 

export const loginUser = async (email: string, password: string) => {
    const result = await fetch(`${host}/user/login`, {
        method: "POST",
        credentials:"include",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({email,password})
    })
    const res = await result.json()
    return res
} 

export const getUser = async () => {
    const jwt = localStorage.getItem("vox_user") as string
    const result = await fetch(`${host}/user/details`,{
        method:"GET",
        headers:{
            "auth-token":jwt
        },
        credentials:"include"
    })
    const res = await result.json()
    return res
}

export const LogOut = async () => {
    await fetch(`${host}/logout`,{
        method:"POST",
        credentials:"include"
    })
}