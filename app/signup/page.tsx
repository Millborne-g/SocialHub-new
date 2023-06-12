"use client"

import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo_signUp.svg';
import googleIcon from '../../assets/google-icon.png';
import Link from 'next/link';
import styles from './page.module.css'
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import './signup.css'
import {useSession, signIn, signOut} from 'next-auth/react'
import { emailAddValue } from '../HeroSection';
import {db} from '../../firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { uid } from 'uid';
import { useId } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ResponseType = {
  credential?: string;
};

export default function page() {
  const [email, setEmail] = useState(emailAddValue);
  const [name, setName] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  // const [continueWithGoogle, setContinueWithGoogle] = useState(false)
  const [signOutGoogle, setSignOutGoogle] = useState(false)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const confirmPasswordElement = document.querySelector('.confirm-password');
  const [toastConfirmPassword, setToastConfirmPassword] = useState(false)


  const { data } = useSession();
  const notify = () => toast.error('Password do not match', {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });

  useEffect(() => {
      // Check if the 'signedOut' key exists in sessionStorage
      if (!sessionStorage.getItem('signedOut')) {
        // Execute the signOut() function
        signOut();
        // Set the 'signedOut' key in sessionStorage
        sessionStorage.setItem('signedOut', 'true');
      }
    
  }, []);

  useEffect(() =>{
    setName(fName+' '+lName);
  },[fName, lName])

  // const emailT = data?.user?.email ?? "No email available";
  // console.log(emailT);


  //write
    const submit_to_DB = () =>{
      const test = 'test';
      const uuid = uid();
      // if(fName !== '' && lName !== ''){
      //   setName(fName+' '+lName);
      // }
      // setName(fName+' '+lName);
      console.log('fullname '+ name);
      let nameSplit = name.split(' ')[0]
      set(ref(db, `/users/${uuid+nameSplit}`), {
          test,
          email,
          name,
          password
      });
      sessionStorage.setItem('signedOut', 'false');
      alert('Saved to Database');
  }

  useEffect(() =>{
    if (data && data?.user?.name && data?.user?.email){
      
      console.log(data?.user?.email);
      console.log(data?.user?.name);
      setName(data.user.name);
      setEmail(data.user.email);
      setPassword('google')
      if(email != ''){
        submit_to_DB()
      }
      
    }
    // else {
    //   signOut()
    // }
  },[data]);

  const signUp = (e: any) => {
    e.preventDefault();
    if (password == confirmPassword){
      setToastConfirmPassword(false);
      submit_to_DB();
    }
    else{
      setToastConfirmPassword(true);
      confirmPasswordElement?.classList.add('is-invalid');
      // alert('Password Don`t Match');
      setConfirmPassword('');
    }
  }



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

  // const submitHandler = async (e:any) => {
  //   e.preventDefault();

  //   try {
  //     const datas = await signIn("credentials", {
  //       redirect: false,
  //       email,
  //       password,
  //     });

  //     console.log(datas);
  //   } catch (error) {
  //     console.log('');
  //   }
  // };
  
  return (
    <div className='signUpContainer'>
      <div className="signUpContainer-inner">
      

        <div className='logoSignup-container'>
          <img className='logo-signup' src={logo.src} />
        </div>
        
        <div className="createAnAccount-container">
          <span className='createAnAccount'>Create an account for free</span>
        </div>

        <form onSubmit={(e) => {signUp(e)}}>
          <div className="row">
            <div className="col-6 textFields">
              <label htmlFor="firstName" className='signUpLabel'>First name</label>
              <input type="text" className="form-control" id="firstName" placeholder="First name" value={fName} onChange={(e) => setFName(e.target.value)} required />
            </div>
            <div className="col-6 textFields">
              <label htmlFor="lastName" className='signUpLabel'>Last name</label>
              <input type="text" className="form-control" id="lastName" placeholder="Last name" value={lName} onChange={(e) => setLName(e.target.value)} required />
            </div>
          </div>
          <div className="form-group textFields">
            <label htmlFor="inputEmail" className='signUpLabel'>Email address</label>
            <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
           
          </div>
          <div className="form-group textFields">
            <label htmlFor="inputPassword" className='signUpLabel'>Password</label>
            <input type="password" className="form-control" id="inputPassword" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}} required/>
          </div>

          <div className="form-group textFields">
            <label htmlFor="inputConfirmPassword" className='signUpLabel'>Confirm Password</label>
            <input type="password" className="form-control confirm-password" id="inputConfirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value); confirmPasswordElement?.classList.remove('is-invalid');}} required/>
            {/* <div className="invalid-confirm-password">
              Password do not match
            </div> */}
          </div>
          
          <button type="submit" className="btn btn-primary signUpPageBtn" onClick={notify}>Sign up</button>
          <button type="button" className="btn btn-outline-secondary signUpPageBtn googleSignUpPageBtn" onClick={() => {signIn('google');}}> <img className='googleIcon' src={googleIcon.src}/> <span className='google'>Continue with Google</span></button>
          { toastConfirmPassword &&
              <ToastContainer />
          }
          
        </form>

        <div className='alreadyHaveAnAccount-container'>
          <span className='alreadyHaveAnAccount-text'>Already have an account ?</span>
          <Link className='alreadyHaveAnAccount-logIntext' href='./login'>Login</Link>
        </div>
        {/* <div>
          <button onClick={notify}>Notify!</button>
          <ToastContainer />
        </div> */}
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
