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
      const result = await axios(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/login")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }
  const startRecognition = () => {
    if (isRecognizingRef.current) return; // ✅ ADD THIS LINE

    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (error) {
      if (!error.message.includes("start")) {
        console.error("Recognition error:", error);
      }
    }
  }
  //   const speak = (text) => {
  //   if (!text) return;

  //   synth.cancel();

  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.lang = "en-IN";

  //   isSpeakingRef.current = true;

  //   utterance.onend = () => {
  //     isSpeakingRef.current = false;
  //     // recognitionRef.current?.start();
  //   };

  //   synth.speak(utterance);
  // };
  const speak = async (text) => {
    if (!text) return;

    synth.cancel(); // keep as-is

    // 🔍 Detect Indian language by Unicode range
    let lang = "en-IN";

    if (/[\u0900-\u097F]/.test(text)) lang = "hi-IN";       // Hindi / Marathi
    else if (/[\u0980-\u09FF]/.test(text)) lang = "bn-IN"; // Bengali
    else if (/[\u0A00-\u0A7F]/.test(text)) lang = "pa-IN"; // Punjabi
    else if (/[\u0A80-\u0AFF]/.test(text)) lang = "gu-IN"; // Gujarati
    else if (/[\u0B00-\u0B7F]/.test(text)) lang = "or-IN"; // Odia
    else if (/[\u0B80-\u0BFF]/.test(text)) lang = "ta-IN"; // Tamil
    else if (/[\u0C00-\u0C7F]/.test(text)) lang = "te-IN"; // Telugu
    else if (/[\u0C80-\u0CFF]/.test(text)) lang = "kn-IN"; // Kannada
    else if (/[\u0D00-\u0D7F]/.test(text)) lang = "ml-IN"; // Malayalam
    else if (/[\u0600-\u06FF]/.test(text)) lang = "ur-IN"; // Urdu

    //  Load voices safely (Chrome async issue)
    const voices = await new Promise((resolve) => {
      const v = synth.getVoices();
      if (v.length) resolve(v);
      else synth.onvoiceschanged = () => resolve(synth.getVoices());
    });

    //  Pick best matching voice
    const voice =
      voices.find(v => v.lang === lang) ||
      voices.find(v => v.lang.startsWith(lang.split("-")[0])) ||
      voices.find(v => v.lang === "en-IN") ||
      voices[0];

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;

    isSpeakingRef.current = true;

    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false;
      // setTimeout(() => {
      //   startRecognition()
      // }, 800)

    };
    synth.cancel()
    synth.speak(utterance);
  };
  // const speak = async (text) => {
  //   if (!text) return;

  //   //  Detect Indian language by Unicode script
  //   let lang = "en-IN";

  //   if (/[\u0900-\u097F]/.test(text)) lang = "hi-IN";       // Hindi / Marathi / Sanskrit
  //   else if (/[\u0980-\u09FF]/.test(text)) lang = "bn-IN"; // Bengali / Assamese
  //   else if (/[\u0A00-\u0A7F]/.test(text)) lang = "pa-IN"; // Punjabi
  //   else if (/[\u0A80-\u0AFF]/.test(text)) lang = "gu-IN"; // Gujarati
  //   else if (/[\u0B00-\u0B7F]/.test(text)) lang = "or-IN"; // Odia
  //   else if (/[\u0B80-\u0BFF]/.test(text)) lang = "ta-IN"; // Tamil
  //   else if (/[\u0C00-\u0C7F]/.test(text)) lang = "te-IN"; // Telugu
  //   else if (/[\u0C80-\u0CFF]/.test(text)) lang = "kn-IN"; // Kannada
  //   else if (/[\u0D00-\u0D7F]/.test(text)) lang = "ml-IN"; // Malayalam
  //   else if (/[\u0600-\u06FF]/.test(text)) lang = "ur-IN"; // Urdu / Sindhi (Arabic script)
  //   else if (/[\u0750-\u077F]/.test(text)) lang = "sd-IN"; // Sindhi
  //   else if (/[\u1CD0-\u1CFF]/.test(text)) lang = "sa-IN"; // Sanskrit (Vedic marks)
  //   else if (/[\u0950]/.test(text)) lang = "sa-IN";        // Sanskrit OM symbol
  //   else if (/[\u0900-\u097F]/.test(text) && text.length < 10) lang = "kok-IN"; // Konkani guess
  //   else if (/[\u0900-\u097F]/.test(text)) lang = "mr-IN"; // Marathi fallback

  //   //  Load available voices (async-safe)
  //   const voices = await new Promise((resolve) => {
  //     let v = synth.getVoices();
  //     if (v.length) resolve(v);
  //     else {
  //       synth.onvoiceschanged = () => {
  //         resolve(synth.getVoices());
  //       };
  //     }
  //   });

  //   //  Pick best matching voice
  //   const voice =
  //     voices.find(v => v.lang === lang) ||
  //     voices.find(v => v.lang.startsWith(lang.split("-")[0])) ||
  //     voices.find(v => v.lang === "en-IN") ||
  //     voices[0];

  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.lang = lang;
  //   utterance.voice = voice;
  //   utterance.rate = 1;
  //   utterance.pitch = 1;

  //   synth.cancel();
  //   synth.speak(utterance);
  // };

  const handleCommand = (data) => {
    if (!data) {
      speak("Sorry, I didn't understand that.");
      return;
    }
    const { type, userInput, response } = data;
    if (!response) {
      speak("Sorry, something went wrong.");
      return;
    }
    speak(response);

    if (type === 'google_search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
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
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank')
    }
  }
  useEffect(() => {
    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new speechRecognition()
    recognition.continuous = true
    recognition.lang = "en-IN"
    recognition.interimResults = false
    recognitionRef.current = recognition

    let isMounted = true

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start()
          console.log("Recognition requested to start");

        } catch (error) {
          if (error.name !== "InvalidState error") {
            console.error(e);
          }
        }
      }
    }, 1000)


    //     const safeRecognition = () => {
    //   if (
    //     recognitionRef.current &&
    //     !isSpeakingRef.current &&
    //     !isRecognizingRef.current
    //   ) {
    //     try {
    //       recognitionRef.current.start();
    //       console.log("Recognition requested to start");
    //     } catch (err) {
    //       if (err.name !== "InvalidStateError") {
    //         console.error("Recognition start error:", err);
    //       }
    //     }
    //   }
    // };
    recognition.onstart = () => {
      console.log("Recognition started");
      isRecognizingRef.current = true;
      setListening(true);
    }
    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognizingRef.current = false;
      setListening(false);

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          try {
            if (!isRecognizingRef.current && !isSpeakingRef.current) {
              recognition.start();
            }
          } catch (error) {
            if (error.name !== "Invalidstate error") console.error(error)
          }
        }, 1000)
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
    //   if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
    //     setTimeout(() => {
    //       if (isMounted && !isRecognizingRef.current &&
    // !isSpeakingRef.current ) {
    //         try {
    //           recognition.start();
    //           console.log("Recognition restarted after error")
    //         } catch (error) {
    //           if (error.name !== "Invalidstate erroe") console.error(error)
    //         }
    //       }
    //     }, 1000)
    //   }
    }
    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard:", transcript);

      const lower = transcript.toLowerCase();
      const assistant = userData.assistantName.toLowerCase();

      if (lower.includes(assistant)) {
        setAiText("")
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        let data;
        try {
          data = await getGeminiResponse(transcript);
        } catch (err) {
          console.error("Gemini error:", err);
          speak("Sorry, I had a server issue.");
          return;
        }

        if (!data || !data.response) {
          speak("Sorry, I didn't understand that.");
          return;
        }

        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
      else if (lower.length > 3) {
        // soft response without wake word
        speak("Say my name to wake me up");
      }
    };
    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, how can I help you with?`)
    greeting.lang = 'hi-IN'

    window.speechSynthesis.speak(greeting);


    return () => {
      isMounted = false
      clearTimeout(startTimeout)
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
    }
  }, [])

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] via-[black] to-[#1c1a16] flex justify-center items-center flex-col gap-[35px] overflow-hidden'>
      <MdMenuOpen className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />
      <div className={`absolute top-0 lg:hidden w-full h-full bg-[#00000049] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform duration-700`}>
        <RxCross2 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
        <button className='min-w-37 h-15 text-black text-xl cursor-pointer bg-white hover:bg-black/20  hover:bg-gradient-to-t from-[blue-200] to-[blue] hover:text-white hover:shadow-xl shadow-blue-200 rounded-full transition-all duration-300 ease-in-out   rounded-full   cursor-pointer' onClick={handleLogout}>Logout</button>
        <button className='min-w-37 h-15 text-black text-xl cursor-pointer bg-white hover:bg-black/20   rounded-full   px-5 py-2.5 hover:bg-gradient-to-t from-[blue-200] to-[blue] hover:text-white hover:shadow-xl shadow-blue-200  rounded-full transition-all duration-300 ease-in-out cursor-pointer' onClick={() => navigate("/customize")}>Customize</button>

        <div className='w-full h-[2px] bg-gray-400'></div>
        <h1 className='text-white font-semibold text-xl'>History</h1>
        <div className='w-full h-[400px] overflow-y-auto flex flex-col gap-[20px]'>
          {userData.history.map((his) => (
            <span className='text-gray-400 text-xl '>{his}</span>
          ))}
        </div>
      </div>
      <button className='min-w-37 h-15 text-black text-xl mt-8 cursor-pointer bg-white hover:bg-black/20  hover:bg-gradient-to-t from-[blue-200] to-[blue] hover:text-white hover:shadow-xl shadow-blue-200 rounded-full transition-all duration-300 ease-in-out   rounded-full absolute top-[20px] right-[20px] hidden lg:block cursor-pointer' onClick={handleLogout}>Logout</button>
      <button className='min-w-37 h-15 text-black text-xl mt-8 cursor-pointer bg-white hover:bg-black/20   rounded-full absolute top-[100px] right-[20px]  px-5 py-2.5 hover:bg-gradient-to-t from-[blue-200] to-[blue] hover:text-white hover:shadow-xl shadow-blue-200 hidden lg:block rounded-full transition-all duration-300 ease-in-out cursor-pointer' onClick={() => navigate("/customize")}>Customize</button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg shadow-blue-400 hover:shadow-xl hover:shadow-blue-200 hover:scale-110 transition-all duration-500 ease-in-out'>
        <img src={userData?.assistantImage} alt='' className='h-full object-cover hover:scale-110 transition-all duration-700 ease-in-out' />
      </div>
      <h1 className='text-white text-xl font-semibold'>I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userImage} alt='' className='w-[200px]' />}
      {aiText && <img src={aiImage} alt='' className='w-[200px]' />}
      <h1 className='text-white text-[18px] font-semi-bold text-wrap'>{userText ? userText : aiText ? aiText : null}</h1>
    </div>
  )
}

export default Home
