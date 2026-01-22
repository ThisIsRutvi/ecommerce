import React, { useState } from "react";
import './loginsin.css'
  import axios from 'axios'
import { GoogleLogin } from '@react-oauth/google'

function Loginsighnup(){

    const [state,setState] = useState("Login");
    const [formData,setFormData] = useState({
        username:"",
        password:"",
        email:"",
    })

    const chnghandler =(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const login = async()=>{
         console.log("Login Function Executed",formData);
         let responseData;
        await fetch('http://localhost:4000/login',{
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify(formData), 
        }).then((response)=>response.json()).then((data)=>responseData=data)
    

    if(responseData.success){
        localStorage.setItem('auth-token',responseData.token);
        window.location.replace("/");                             
    }
    else{
        alert(responseData.errors)
    }
    }

    const signup = async()=>{
        
        console.log("Signup Function Executed",formData)
        let responseData;
        await fetch('http://localhost:4000/signup',{
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify(formData), 
        }).then((response)=>response.json()).then((data)=>responseData=data)
    


    if(responseData.success){
        localStorage.setItem('auth-token',responseData.token);
        window.location.replace("/");                            
    }
    else{
        alert(responseData.errors)
    }
    }


const Googlelogin =async(cred)=>{
        const res = await axios.post('http://localhost:4000/google',{
                  token: cred.credential
        })
    
    if(res.data.success){
        localStorage.setItem("auth-token",res.data.token)
        window.location.replace("/");                            
    }
}

    return(
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="fields">
                    {state === "Sign Up"?<input name='username' value={formData.username} onChange={chnghandler} type="text" placeholder="your name" />:<></>}
                    <input name='email' value={formData.email} onChange={chnghandler} type="email" placeholder="email address" />
                    <input name='password' value={formData.password} onChange={chnghandler} type="password" placeholder="password"/>
                    </div>
                    <button onClick={()=>{state === "Login"?login():signup()}}>Continue</button>

         <div           
         className='googlelogin'>
        <GoogleLogin
          onSuccess={Googlelogin}
          onError={() => alert("Google Login Failed")}
          text={state==='Login'?"signin_with":"signup_with"}
            size="large"     
        />
            </div>           
                    {state === "Sign Up" 
                      ?<p className="loginsignuup-login">Already have an acocount?<span onClick={()=>{setState("Login")}}>Login here</span></p>
                      :<p className="loginsignuup-login">Create an account?<span onClick={()=>{setState("Sign Up")}}>Click here</span></p>} 
                    
            </div>
        </div>
    )
}
export default Loginsighnup
