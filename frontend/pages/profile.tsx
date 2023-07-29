import React, { useEffect } from 'react'

const App = () => {
    const createRoom = async () => {
        try {
            const data = await fetch("http://localhost:8080/create")
            const res = await data.json()
            console.log(res)
        } catch (error) {
            console.log("Error")
        }
    }

    useEffect(() => {
      getUser()
    
    }, [])
    

    const getUser = async()=>{
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/details`)
        const res = await result.json()
        console.log(res)
    }

    return (
        <section className='min-h-[100vh] relative bg-[url("/bg5.svg")] bg-cover'>
            <div className=' absolute inset-0 z-10 flex-center flex-col gap-[2rem]'>
                <div className='flex-center flex-col'>
                    <h1>Start a Video Call</h1>
                    <p className='w-[60%] text-center font-semibold text-gray-300'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam reiciendis adipisci sit quam deserunt. Adipisci?</p>
                </div>
                <div className='max-w-[900px] w-full flex-center gap-5'>


                    <div className=' w-full p-4'>
                        <button onClick={() => createRoom()} className='w-full p-4 text-lg font-bold mt-3 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 rounded-lg'>Create</button>
                    </div>
                    <h2>/</h2>
                    <div className=' w-full p-4'>
                        <input type="text" placeholder='Room Id' className='input-primary' />
                        <button className='w-full p-4 text-lg font-bold mt-3 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 rounded-lg'>Join</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default App