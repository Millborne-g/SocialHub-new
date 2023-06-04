"use client"

import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo_signUp.svg';
import googleIcon from '../../assets/google-icon.png';
import Link from 'next/link';
import styles from './page.module.css'
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import './signup.css'
import {useSession, signIn} from 'next-auth/react'
import { emailAddValue } from '../HeroSection';


type ResponseType = {
  credential?: string;
};



export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data } = useSession();

  console.log(data);

  // const {data: session} = useSession()
  // const [signGoogle, setSignGoogle] = useState(false);
  // const handleCallbackResponse = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
  //   if ('profileObj' in response) {
  //     console.log('User profile:', response.profileObj);
  //     console.log('Access token:', response.accessToken);
  //   }
  // };


  // useEffect(() =>{
  //   console.log('gagana?')
  //   google.accounts.id.initialize({
  //     client_id: "1093311205763-3j0qmhukmao1acf6o4ho2q6nqls104oo.apps.googleusercontent.com",
  //     callback: handleCallbackResponse
  //   })
  // },[signGoogle])

  const submitHandler = async (e:any) => {
    e.preventDefault();

    try {
      const data = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className='signUpContainer'>
      <div className="signUpContainer-inner">

        <div className='logoSignup-container'>
          <img className='logo-signup' src={logo.src} />
        </div>
        
        <div className="createAnAccount-container">
          <span className='createAnAccount'>Create an account for free</span>
        </div>

        <form>
          <div className="row">
            <div className="col-6 textFields">
              <label htmlFor="firstName" className='signUpLabel'>First name</label>
              <input type="text" className="form-control" id="firstName" placeholder="First name" required />
            </div>
            <div className="col-6 textFields">
              <label htmlFor="lastName" className='signUpLabel'>Last name</label>
              <input type="text" className="form-control" id="lastName" placeholder="Last name" required />
            </div>
          </div>
          <div className="form-group textFields">
            <label htmlFor="inputEmail" className='signUpLabel'>Email address</label>
            <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" required/>
           
          </div>
          <div className="form-group textFields">
            <label htmlFor="inputPassword" className='signUpLabel'>Password</label>
            <input type="password" className="form-control" id="inputPassword" placeholder="Password" required/>
          </div>

          <div className="form-group textFields">
            <label htmlFor="inputConfirmPassword" className='signUpLabel'>Confirm Password</label>
            <input type="password" className="form-control" id="inputConfirmPassword" placeholder="Confirm Password" required/>
          </div>
          
          <button type="submit" className="btn btn-primary signUpPageBtn">Sign up</button>
          <button type="button" className="btn btn-outline-secondary signUpPageBtn googleSignUpPageBtn" onClick={() => {signIn('google');}}> <img className='googleIcon' src={googleIcon.src}/> <span className='google'>Continue with Google</span></button>
          
        </form>

        <div className='alreadyHaveAnAccount-container'>
          <span className='alreadyHaveAnAccount-text'>Already have an account ?</span>
          <Link className='alreadyHaveAnAccount-logIntext' href='./login'>Login</Link>
        </div>
      </div>
        {/* <GoogleLogin
              clientId="1093311205763-3j0qmhukmao1acf6o4ho2q6nqls104oo.apps.googleusercontent.com"
              buttonText="Continue with Google"
              onSuccess={handleCallbackResponse}
              onFailure={handleCallbackResponse}
            /> */}
    </div>
  )
};
