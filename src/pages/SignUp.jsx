import React, { useContext, useState } from 'react'
import bg from "../assets/authBg.png"
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext.jsx';
import axios from 'axios';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const {serverUrl,userData,setUserData} = useContext(userDataContext)
    const navigate = useNavigate()
    const [name,setName] = useState("")
    const [email,setEmail]= useState("")
    const [loading,setLoading] = useState(false)
    const [password,setPassword] = useState("")
    const [err,setErr] = useState("")

    const handleSignUp=async (e)=>{
        e.preventDefault()
        setErr("")
        setLoading(true)
        try {
            let result = await axios.post(`${serverUrl}/api/auth/signup`,{
                name,email,password
            },{withCredentials:true})
            setUserData(result.data)
            setLoading(false)
            navigate('/customize')
        } catch (error) {
            console.log(error)
            setUserData(null)
            setErr(error.response.data.message)
            setLoading(false)
        }
    }
    return (
        <div className='w-full h-[100vh] bg-center bg-no-repeat bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
            <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000000] backdrop-blur hover:shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px] rounded-xl transition-all duration-300 ease-in-out'onSubmit={handleSignUp}>
                <h1 className='text-white text-3xl font-semibold mb-3'>Register to <span className='text-blue-400'>Virtual assistant</span></h1>
                <input type='text' placeholder='Enter Your Name' className='w-full h-[60px] outline-none border-2 border-white hover:shadow-xl shadow-black bg-transparent text-white placeholder:gray-300 px-[20px] py-[10px] rounded-full text-lg transition-all duration-300 ease-in-out' required onChange={(e)=>setName(e.target.value)} value={name}/>
                <input type='email' placeholder=' Email' className='w-full h-[60px] outline-none border-2 border-white hover:shadow-xl shadow-black bg-transparent text-white placeholder:gray-300 px-[20px] py-[10px] rounded-full text-lg transition-all duration-300 ease-in-out' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
                <div className='w-full h-[60px]  border-2 border-white hover:shadow-xl shadow-black bg-transparent text-white rounded-full text-lg relative transition-all duration-300 ease-in-out'>
                    <input type={showPassword ? "text" : "password"} placeholder='Password' className='w-full h-full rounded-full outline-none bg-transparent placeholder:gray-300 px-[20px] py-[10px]' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
                    {!showPassword && <IoEye className='absolute top-[18px] right-5 cursor-pointer text-white w-6 h-6' onClick={() => setShowPassword(true)} />}
                    {showPassword && <IoEyeOff className='absolute top-[18px] right-5 cursor-pointer text-white w-6 h-6' onClick={() => setShowPassword(false)} />}
                </div>
                {err.length>0 && <p className='text-red-900 text-lg'>*{err}</p>}
                <button className='min-w-37 h-15 text-black text-xl mt-8 cursor-pointer bg-white hover:bg-black/20 hover:text-white hover:shadow-xl shadow-black  rounded-full transition-all duration-300 ease-in-out' disabled={loading}>{loading?"Loading...":"Sign Up"}</button>
                <p className='text-white text-xl'>Already hava an account ? <span className='text-blue-400 underline cursor-pointer' onClick={()=>navigate("/login")}>Sign In</span></p>
            </form>
        </div>
    )
}
export default SignUp
