import React, { useContext, useEffect } from 'react'
import { userDataContext } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import { useRef } from 'react'
import aiImage from '../assets/ai.gif'
import userImage from '../assets/user.gif'
import { MdMenuOpen } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const [ham, setHam] = useState(false)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis

  const handleLogout = async () => {
    try {
      await axios(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/login")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () => {
    if (isRecognizingRef.current) return
    try {
      recognitionRef.current.start()
      setListening(true)
    } catch (error) {
      if (!error.message.includes("start")) {
        console.error("Recognition error:", error)
      }
    }
  }

  const speak = async (text) => {
    if (!text) return

    synth.cancel()

    let lang = "en-IN"
    if (/[\u0900-\u097F]/.test(text)) lang = "hi-IN"
    else if (/[\u0980-\u09FF]/.test(text)) lang = "bn-IN"
    else if (/[\u0A00-\u0A7F]/.test(text)) lang = "pa-IN"
    else if (/[\u0A80-\u0AFF]/.test(text)) lang = "gu-IN"
    else if (/[\u0B00-\u0B7F]/.test(text)) lang = "or-IN"
    else if (/[\u0B80-\u0BFF]/.test(text)) lang = "ta-IN"
    else if (/[\u0C00-\u0C7F]/.test(text)) lang = "te-IN"
    else if (/[\u0C80-\u0CFF]/.test(text)) lang = "kn-IN"
    else if (/[\u0D00-\u0D7F]/.test(text)) lang = "ml-IN"
    else if (/[\u0600-\u06FF]/.test(text)) lang = "ur-IN"

    const voices = await new Promise((resolve) => {
      const v = synth.getVoices()
      if (v.length) resolve(v)
      else synth.onvoiceschanged = () => resolve(synth.getVoices())
    })

    const voice =
      voices.find(v => v.lang === lang) ||
      voices.find(v => v.lang.startsWith(lang.split("-")[0])) ||
      voices.find(v => v.lang === "en-IN") ||
      voices[0]

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.voice = voice
    utterance.rate = 1
    utterance.pitch = 1

    isSpeakingRef.current = true

    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
    }

    synth.speak(utterance)
  }

  const handleCommand = (data) => {
    if (!data || !data.response) {
      speak("Sorry, I didn't understand that.")
      return
    }

    const { type, userInput, response } = data
    speak(response)

    if (type === 'google_search') {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank')
    }
    if (type === 'calculator_open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank')
    }
    if (type === 'instagram_open') {
      window.open(`https://www.instagram.com/`, '_blank')
    }
    if (type === 'facebook_open') {
      window.open(`https://www.facebook.com/`, '_blank')
    }
    if (type === 'weather_show') {
      window.open(`https://www.google.com/search?q=weather`, '_blank')
    }
    if (type === 'youtube_search' || type === 'youtube_play') {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank')
    }
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = "en-IN"
    recognition.interimResults = false
    recognitionRef.current = recognition

    let isMounted = true

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start()
        } catch {}
      }
    }, 1000)

    recognition.onstart = () => {
      isRecognizingRef.current = true
      setListening(true)
    }

    recognition.onend = () => {
      isRecognizingRef.current = false
      setListening(false)

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (!isRecognizingRef.current && !isSpeakingRef.current) {
            try {
              recognition.start()
            } catch {}
          }
        }, 1000)
      }
    }

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error)
      isRecognizingRef.current = false
      setListening(false)
    }

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      const lower = transcript.toLowerCase()
      const assistant = userData.assistantName.toLowerCase()

      if (lower.includes(assistant)) {
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)

        setUserText(transcript)

        try {
          const data = await getGeminiResponse(transcript)
          handleCommand(data)
          setAiText(data?.response || "")
        } catch {
          speak("Sorry, I had a server issue.")
        }

        setUserText("")
      } else if (lower.length > 3) {
        speak("Say my name to wake me up")
      }
    }

    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, how can I help you with?`)
    greeting.lang = "hi-IN"
    synth.speak(greeting)

    return () => {
      isMounted = false
      clearTimeout(startTimeout)
      recognition.stop()
      isRecognizingRef.current = false
      setListening(false)
    }
  }, [])

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] via-[black] to-[#1c1a16] flex justify-center items-center flex-col gap-[35px] overflow-hidden'>
      <MdMenuOpen className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />

      <div className={`absolute top-0 lg:hidden w-full h-full bg-[#00000049] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform duration-700`}>
        <RxCross2 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => navigate("/customize")}>Customize</button>
      </div>

      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg shadow-blue-400'>
        <img src={userData?.assistantImage} alt='' className='h-full object-cover' />
      </div>

      <h1 className='text-white text-xl font-semibold'>I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userImage} className='w-[200px]' />}
      {aiText && <img src={aiImage} className='w-[200px]' />}
      <h1 className='text-white text-[18px]'>{userText || aiText}</h1>
    </div>
  )
}

export default Home