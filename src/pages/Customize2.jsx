import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext.jsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { MdArrowBack } from "react-icons/md";

const Customize2 = () => {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext)
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();


  const handleUpdateAssistant = async () => {
    setLoading(true)
    try {
      let formData = new FormData()
      formData.append("assistantName", assistantName)
      if (selectedImage === "input") {
        formData.append("assistantImage", backendImage)
      } else {
        formData.append("imageUrl", selectedImage)
      }
      const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })

      console.log(result.data)
      setUserData(result.data)
      navigate("/")
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[#0c0c0c] via-[#141414] to-[#1c1a16] flex justify-center items-center flex-col relative'>
      <MdArrowBack className='absolute top-[30px] left-[30px] text-white w-[25px] rounded-2xl hover:text-blue-400 hover:shadow-xl shadow-blue-200 h-[25px] cursor-pointer' onClick={()=>navigate("/customize")}/>
      <h1 className='text-white text-3xl font-semibold mb-10 text-center'>Enter your <span className='text-blue-400'>Assistant Name</span></h1>
      <input type='text' placeholder='eg: Jarvis' className='w-full max-w-[500px] h-[60px] outline-none border-2 border-white hover:shadow-xl shadow-black bg-transparent text-white placeholder:gray-300 px-[20px] py-[10px] rounded-full text-lg transition-all duration-300 ease-in-out' required onChange={(e) => setAssistantName(e.target.value)} value={assistantName} />
      {assistantName && <button className='min-w-[300px] h-15 text-black text-xl mt-8 cursor-pointer bg-white hover:bg-gradient-to-t from-[blue-200] to-[blue] hover:text-white hover:shadow-xl shadow-blue-200 rounded-full transition-all duration-300 ease-in-out' disabled={loading} onClick={() => {
        handleUpdateAssistant()
      }}>
        {!loading?"Create your assistant":"Loading..."}
      </button>}
    </div>
  )
}
export default Customize2