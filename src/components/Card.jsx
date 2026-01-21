import React,{useContext} from 'react'
import { userDataContext } from '../context/UserContext.jsx'

const Card = ({image}) => {
    const {serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage} = useContext(userDataContext)
  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#cb9831] border-2 border-[#6c4e12] rounded-2xl overflow-hidden hover:shadow-xl shadow-blue-400 hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer hover:border-4 hover:border-yellow-500 ${selectedImage==image?"border-4 border-[#e9a620] shadow-xl shadow-blue-400 scale-110":null}`} onClick={()=>{
      setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)
      }}>
      <img src={image} className='h-full object-cover hover:scale-110 transition-all duration-300 ease-in-out'/>
    </div>
  )
}

export default Card
