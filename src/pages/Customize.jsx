import React, { useContext, useRef } from 'react'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/image3.png'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import image7 from '../assets/image7.jpeg'
import Card from '../components/Card.jsx'
import { LuImagePlus } from "react-icons/lu";
import { userDataContext } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import { MdArrowBack } from "react-icons/md";

const Customize = () => {
  const {
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage
  } = useContext(userDataContext)
  const navigate = useNavigate()
  const inputImage = useRef()

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
    setSelectedImage("input")
  }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[#0c0c0c] via-[#141414] to-[#1c1a16] flex justify-center items-center flex-col relative'>
      <MdArrowBack className='absolute top-[30px] left-[30px] text-white w-[25px] rounded-2xl hover:text-blue-400 hover:shadow-xl shadow-blue-200 h-[25px] cursor-pointer' onClick={()=>navigate("/")}/>
      <h1 className='text-white text-3xl font-semibold mb-10 text-center'>
        Select your <span className='text-blue-400'>Assistant Image</span>
      </h1>

      <div className='w-[90%] max-w-[900px] flex justify-center items-center flex-wrap gap-5'>
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image7} />

        {/* Upload Card */}
        <div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px]
          bg-[#3181cb] border-2 border-[#6c4e12] rounded-2xl
          overflow-hidden flex items-center justify-center
          cursor-pointer transition-all duration-300
          hover:shadow-xl shadow-blue-400 hover:border-4 hover:border-[#e9a620] hover:scale-110
          ${
            selectedImage === "input"
              ? "border-4 border-[#e9a620] shadow-xl shadow-blue-400 scale-110"
              : ""
          }`}
          onClick={() => inputImage.current.click()}
        >
          {!frontendImage && (
            <LuImagePlus className='text-white w-[25px] h-[25px]' />
          )}
          {frontendImage && (
            <img src={frontendImage} className='h-full object-cover' />
          )}
        </div>

        <input
          type='file'
          accept='image/*'
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>
      {selectedImage && <button className='min-w-37 h-15 text-black text-xl mt-8 cursor-pointer bg-white hover:bg-gradient-to-t from-[blue-200] to-[blue] hover:text-white hover:shadow-xl shadow-blue-200 rounded-full transition-all duration-300 ease-in-out' onClick={()=>navigate("/customize2")}>
        Next
      </button>}
      
    </div>
  )
}

export default Customize