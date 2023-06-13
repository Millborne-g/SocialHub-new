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
import ModalSuccessful from '../components/ModalSuccessful';
import { LineWave } from  'react-loader-spinner'
import check from '../../assets/check.svg';
import head from './head';

type ResponseType = {
  credential?: string;
};

export default function page() {
  const [email, setEmail] = useState(emailAddValue); 
  const inputUserEmailElement = document.querySelector('.inputUserEmail');
  const [name, setName] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  // const [continueWithGoogle, setContinueWithGoogle] = useState(false)
  const [signOutGoogle, setSignOutGoogle] = useState(false)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const confirmPasswordElement = document.querySelector('.confirm-password');
  const [passwordDontMatch, setPasswordDontMatch] = useState(false);
  const [toastConfirmPassword, setToastConfirmPassword] = useState(false);
  const [toastAlreadyExist, setToastAlreadyExist] = useState('')
  const [toastText,setToastText] = useState("Email already exist!");
  const [signUpLoader, setSignUpLoader] = useState(false);
  const [signUpSuccessfulModal, setSignUpSuccessfulModal] = useState(false);
  const [clickSignIn, setClickSignIn] = useState(false);

  const { data } = useSession();
  
  const customIdPassword = "custom-id-password";
  const customIdAlreadyExist = "custom-id-AlreadyExist";
  const notify = () => toast.error(toastText, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    toastId: customIdPassword
  });

  // const notifyAlreadyExist = () => toast.error('EmailAlreadyExist', {
  //     position: "top-center",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "light",
  //     });

  useEffect(() => {
      // Check if the 'signedOut' key exists in sessionStorage
      if (!sessionStorage.getItem('signedOut')) {
        // Execute the signOut() function
        sessionStorage.setItem('signedOut', 'true');
        
        signOut();
      }
      else if (sessionStorage.getItem('emailAddValue')!== null) {
        const storedEmail = sessionStorage.getItem('emailAddValue');
        if (storedEmail !== null) {
          setEmail(storedEmail);
        }
      }
      if(emailAddValue !== ''){
        sessionStorage.setItem('emailAddValue', email);
      } else{
        sessionStorage.setItem('emailAddValue', '');
      }
    
  }, []);

  useEffect(() =>{
    setName(fName+' '+lName);
  },[fName, lName]);

  useEffect(() => {
    if (toastConfirmPassword) {
      notify();
      setClickSignIn(false);
    }
  }, [clickSignIn, toastText]);

  // const emailT = data?.user?.email ?? "No email available";
  // console.log(emailT);


  //write
    const submit_to_DB = () =>{
      const test = 'test';
      const uuid = uid();
      let emailExist: boolean = false;
      // if(fName !== '' && lName !== ''){
      //   setName(fName+' '+lName);
      // }
      // setName(fName+' '+lName);
      console.log('fullname '+ name);
      let nameSplit = name.split(' ')[0];
      if (email !== ''){
        // loadDB
        onValue(ref(db, `/users`), (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            
            Object.values(data).map((user) => {
              setSignUpLoader(true);
              if (typeof user === 'object' && user !== null) {
                let userEmail = (user as { email?: string }).email;
                if (userEmail === email){
                  emailExist=true;
                  setToastText("Email already exist!")
                  console.log(emailExist)
                  
                }
              }
            });
          }
          if(emailExist === false){
            setSignUpLoader(true);
            setTimeout(() => {
              console.log('saving '+emailExist)
              set(ref(db, `/users/${uuid+nameSplit}`), {
                test,
                email,
                name,
                password
              });
              sessionStorage.setItem('signedOut', 'false');
              setSignUpLoader(false);
              // alert('Saved to Database');
              setSignUpSuccessfulModal(true);
              setToastConfirmPassword(false);
            }, 3000);
            
          } else{
            inputUserEmailElement?.classList.add('is-invalid');
            
            setSignUpLoader(false);
            setToastConfirmPassword(true) 
          }
        });  
      }
      
  }

  useEffect(() =>{
    if (data && data?.user?.name && data?.user?.email){
      setSignUpLoader(true);
      console.log(data?.user?.email);
      console.log(data?.user?.name);
      setName(data.user.name);
      setEmail(data.user.email);
      
      if(email != ''){
        submit_to_DB()
      }
      
    }
    // else {
    //   if (!data){
    //     signOut()
    //   }
      
    // }
  },[data]);

  const signUp = (e: any) => {
    e.preventDefault();
    setClickSignIn(true);
    if( fName !=='' && lName !=='' && password !=='' && confirmPassword !==''){
      if (password === confirmPassword){
        setToastConfirmPassword(false);
        setSignUpLoader(true);
        submit_to_DB();
      }
      else{
        // setToastText('Passwords do not match');
        confirmPasswordElement?.classList.add('is-invalid');
        // alert('Password Don`t Match');
        setToastText("Passwords don't match.")
        setConfirmPassword('');
        // setPasswordDontMatch(true)
        setToastConfirmPassword(true)
      }
    } else {
      setPasswordDontMatch(false)
      // setToastConfirmPassword(false)
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
    <>
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
              <div className="col-6 textFieldsSignUp">
                <label htmlFor="firstName" className='signUpLabel'>First name</label>
                <input type="text" className="form-control" id="firstName" placeholder="First name" value={fName} onChange={(e) => setFName(e.target.value)} required />
              </div>
              <div className="col-6 textFieldsSignUp">
                <label htmlFor="lastName" className='signUpLabel'>Last name</label>
                <input type="text" className="form-control" id="lastName" placeholder="Last name" value={lName} onChange={(e) => setLName(e.target.value)} required />
              </div>
            </div>
            <div className="form-group textFieldsSignUp">
              <label htmlFor="inputEmail" className='signUpLabel'>Email address</label>
              <input type="email" className="form-control  inputUserEmail" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={(e) => {setEmail(e.target.value); inputUserEmailElement?.classList.remove('is-invalid'); setToastConfirmPassword(false) }} required/>
            
            </div>
            <div className="form-group textFieldsSignUp">
              <label htmlFor="inputPassword" className='signUpLabel'>Password</label>
              <input type="password" className="form-control" id="inputPassword" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}} required/>
            </div>

            <div className="form-group textFieldsSignUp">
              <label htmlFor="inputConfirmPassword" className='signUpLabel'>Confirm Password</label>
              <input type="password" className="form-control confirm-password" id="inputConfirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value); confirmPasswordElement?.classList.remove('is-invalid'); setToastConfirmPassword(false);setPasswordDontMatch(false); }} required/>
            </div>
            
            <button type="submit" className="btn btn-primary signUpPageBtn">Sign up</button>
            <button type="button" className="btn btn-outline-secondary signUpPageBtn googleSignUpPageBtn" onClick={() => {signIn('google');}}> <img className='googleIcon' src={googleIcon.src}/> <span className='google'>Continue with Google</span></button>
            { toastConfirmPassword &&
                // <ToastContainer containerId={customIdPassword} />
                <ToastContainer/>
            }

            {/* {toastAlreadyExist &&
            
              <ToastContainer containerId={customIdAlreadyExist} />
            } */}
            
            
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
      {signUpLoader &&
        <div className='popup'>
          <div className="popup-inner">
            <div className="popup-bg">
            </div>
            <div className="loader">
              <LineWave
                  height="100"
                  width="100"
                  color="#000000"
                  wrapperStyle={{ position: "relative", top: "50%", left: "50%", transform: "translate(-32%, -10%)"}}
                />
            </div>
          </div>
        </div>
      }

      { signUpSuccessfulModal &&
        <div className='popup'>
          <div className="popup-inner">
            <div className="popup-bg">
            </div>
            <div className="success">
              <img className='successIcon' src={check.src} />
              <div className="congratulationsText">
                <span>Welcome</span>
              </div>
              <div>
                <span className="thankYouText">Thank you for signing up on <span className='socialHubText'>SocialHub</span></span>
              </div>
            </div>
          </div>
        </div>

      }

      

      
      
    </>
  )
};
