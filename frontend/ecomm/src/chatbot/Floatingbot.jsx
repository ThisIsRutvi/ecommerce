// import { useState } from "react"
// import './Floatingbot.css'  
// import axios from 'axios'  
// import Chatbot from "./Chatbot"

// function Floatingbot(){
//     const[isOpen,setIsopen] = useState(false)
//   const [messages, setMessages] = useState([{
//   from: 'bot', text: 'Hi, how can I help you?'
// }])
//     const[input,setInput] =useState('')
//     const[loading,setLoading] = useState(false)

//     const sendMessage = async ()=>{
//         if(!input.trim()) return

//         const userMessage = {from:'user',text:input}
//         setMessages (prev=>[...prev,userMessage])
//         setInput('')
//         setLoading(true)

//         try{
// const res = await axios.post('http://localhost:5000/api/chat', { message: input })

//          setMessages(prev => [...prev, { from: 'bot', text: res.data.reply }])
//         } catch (err) {
//          setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, something went wrong.' }])
//         }
//         setLoading(false)
//     }

//     const handleKeyDown = (e) => {
//     if (e.key === 'Enter') sendMessage()
//   }

//   return (
//     <div className="chatbot-wrapper">
//       {isOpen && (
//         <div className="chatbot-window">
//           <div className="chatbot-header">
//             UrbanSole Support
//           </div>

//           <div className="chatbot-messages">
//             {messages.map((msg, i) => (
//               <div key={i} className={`chatbot-message ${msg.from}`}>
//                 {msg.text}
//               </div>
//             ))}
//             {loading && (
//               <div className="chatbot-message bot typing">
//                 Typing...
//               </div>
//             )}
//           </div>

//           <div className="chatbot-input-area">
//             <input
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Ask me anything..."
//               className="chatbot-input"
//             />
//             <button onClick={sendMessage} className="chatbot-send-btn">
//               Send
//             </button>
//           </div>
//         </div>
//       )}

//       <button className="chatbot-toggle-btn" onClick={() => setIsopen(prev => !prev)}>
//         {isOpen ? '✕' : '💬'}
//       </button>
//     </div>
//   )
// }



// export default Floatingbot

import { useState } from "react";
import Chatbot from "./Chatbot";
import "./Floatingbot.css";

function Floatingbot() {
 
  const[isOpen,setIsOpen] = useState(false)

  return(
    <div className="chatbot-wrapper">
      {
        isOpen && (
          <div className="chatbot-window">
            <Chatbot></Chatbot>
          </div>
        )
      }

     <button
             className="chatbot-toggle-btn"
     onClick={()=>setIsOpen((prev)=>!prev)}>
               {isOpen ? "✕" : "💬"}
     </button>
    </div>
  )
}

export default Floatingbot;