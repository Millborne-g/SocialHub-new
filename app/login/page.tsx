"use client"
import React, { useEffect, Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';
import logo from '../../assets/logo_signUp.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import googleIcon from '../../assets/google-icon.png';
import {useSession, signIn, signOut} from 'next-auth/react';
import {db} from '../../firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { LineWave } from  'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Router } from 'next/router';

export default function page() {
    useEffect(() => {
        document.title = 'SocialHub | Log in';
      }, []);
    // const router = useRouter();
    

    const [userID, setUserID] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const inputEmailElement = document.querySelector('.inputUserEmail');
    const inputPasswordElement = document.querySelector('.inputUserPassword');
    const [clickSignIn, setClickSignIn] = useState(false);
    const [signInLoader, setSignInLoader] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastText,setToastText] = useState('');

    const { data } = useSession();

    useEffect(() => {
        const storedUserID = localStorage.getItem('userID');
        if (storedUserID) {
          setUserID(storedUserID);
        }
      }, []);

    useEffect(()=>{
        if(userID){
          window.open('http://localhost:3000/', '_self');
        }
    },[userID])

    const customIdPassword = "custom-id-notify";

    const notifyDoesntExist = () => toast.error(toastText, {
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

    useEffect(() => {
        if (showToast) {
          notifyDoesntExist();
          setClickSignIn(false);
        }
      }, [clickSignIn, toastText]);

    
    const proceedNextPage = () =>{
        console.log('Next Page!!');
        // e.preventDefault();
        setSignInLoader(true);
        setClickSignIn(true);
        let idTemp: string = '';
        if(email !== ''){
            onValue(ref(db, `/users`), (snapshot) => {
                const data = snapshot.val();
                let foundEmail = false;
                let foundPassword = false;
                if (data !== null) {
                  Object.values(data).map((user) => {
                    if (typeof user === 'object' && user !== null) {
                      let userEmail = (user as { email?: string }).email;
                      let userPassword = (user as { password?: string }).password;
                      let userIDDB = (user as { ID?: string }).ID;
                      
                      if (userEmail === email){
                        foundEmail = true;
                        idTemp = userIDDB ?? "";
                      }
                      if(userPassword === password){
                        foundPassword = true;
                      }
                    }
                  });
                }

                if(foundEmail === false){
                    setSignInLoader(false);
                    idTemp = '';
                    inputEmailElement?.classList.add('is-invalid');
                    setShowToast(true);
                    setToastText("Email don't exist.")
                    // history.replaceState(null, document.title, window.location.href);
                    setTimeout(() =>{
                        signOut();
                    },3000)
                    
                } 
                else if(foundPassword === false){
                    idTemp = '';
                    setSignInLoader(false);
                    inputPasswordElement?.classList.add('is-invalid');
                    setShowToast(true);
                    setToastText("Incorrect Password.");
                    setTimeout(() =>{
                        signOut();
                    },3000)
                }
                else if(foundEmail && foundPassword){
                    setSignInLoader(true);
                    setTimeout(() => {
                        console.log('yeeey sulod naka');
                        localStorage.setItem('userID', idTemp);
                        console.log('mao ning id '+ idTemp);
                        
                        
                        console.log(localStorage.getItem('userID'));
                        // window.location.href = 'http://localhost:3000/';
                        window.open('http://localhost:3000/', '_self');
                        // setSignInLoader(false);
                        
                    },3000);
                } 
                else{
                    setSignInLoader(false);
                }
            });  
        } 
        else{
            setSignInLoader(false);
        }
    }

    const handleSubmit = (e: any) =>{
        e.preventDefault();
        setSignInLoader(true);
        setClickSignIn(true);
        let idTemp: string = '';
        if(email !== '' && password !== ''){
            onValue(ref(db, `/users`), (snapshot) => {
                const data = snapshot.val();
                let foundEmail = false;
                let foundPassword = false;
                if (data !== null) {
                  Object.values(data).map((user) => {
                    if (typeof user === 'object' && user !== null) {
                      let userEmail = (user as { email?: string }).email;
                      let userPassword = (user as { password?: string }).password;
                      let userIDDB = (user as { ID?: string }).ID;
                      
                      if (userEmail === email){
                        foundEmail = true;
                        idTemp = userIDDB ?? "";
                      }
                      if(userPassword === password){
                        foundPassword = true;
                      }
                    }
                  });
                }

                if(foundEmail === false){
                    setSignInLoader(false);
                    idTemp = '';
                    inputEmailElement?.classList.add('is-invalid');
                    setShowToast(true);
                    setToastText("Email don't exist.")
                } 
                else if(foundPassword === false){
                    idTemp = '';
                    setSignInLoader(false);
                    inputPasswordElement?.classList.add('is-invalid');
                    setShowToast(true);
                    setToastText("Incorrect Password.");
                }
                else if(foundEmail && foundPassword){
                    setSignInLoader(true);
                    setTimeout(() => {
                        console.log('yeeey sulod naka');
                        localStorage.setItem('userID', idTemp);
                        console.log('mao ning id '+ idTemp);
                        
                        setSignInLoader(false);
                        console.log(localStorage.getItem('userID'));
                        // window.location.href = 'http://localhost:3000/';
                        window.open('http://localhost:3000/', '_self');
                        
                    },3000);
                } 
                else{
                    setSignInLoader(false);
                }
            });  
        } 
        else{
            setSignInLoader(false);
        }
    }

    useEffect(() =>{
        if (data && data?.user?.name && data?.user?.email){
          setSignInLoader(true);
          console.log(data?.user?.email);
          console.log(data?.user?.name);
          setEmail(data.user.email);
          
          if(email !== ''){
            setTimeout(() => {
            console.log('yeeey sulod naka');
                proceedNextPage()
                setSignInLoader(false);
            },3000);
            
          }
          
        }
        // else {
        //   if (!data){
        //     signOut()
        //   }
          
        // }
      },[data]);



  return (
    <>
        <header>
            <div className="container navbarLogin">
                <a className="navbar-brand justify-content-start" href="#">
                    <img className='logoImg' src={logo.src} alt="" />
                </a>
            </div>
        </header>

        <div className='loginCointainer container'>
            <div className="card logInCard">
                <div className="card-body">
                    <div className="login-container">
                        <span className='loginContainerText'>Welcome to SocialHub</span>
                    </div>
                    <form onSubmit={(e)=>{handleSubmit(e)}}>
                        <div className="form-group textFields">
                            <label htmlFor="inputEmail" className='logInLabel'>Email address</label>
                            <input type="email" className="form-control inputUserEmail" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={(e)=>{setEmail(e.target.value); inputEmailElement?.classList.remove('is-invalid'); setShowToast(false);}} required/>
                            
                        </div>
                        <div className="form-group textFields">
                            <label htmlFor="inputPassword" className='logInLabel'>Password</label>
                            <input type="password" className="form-control inputUserPassword" id="inputPassword" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value); inputPasswordElement?.classList.remove('is-invalid'); setShowToast(false);}} required/>
                        </div>
                        <button type="submit" className="btn btn-primary logInPageBtn">Log in</button>
                        <button type="button" className="btn btn-outline-secondary logInPageBtn googleLogInPageBtn" onClick={() => {signIn('google');}}> <img className='googleIcon' src={googleIcon.src} /> <span className='google'>Continue with Google</span></button>
                        

                        <div className='dontHaveAnAccount-container'>
                            <span className='dontHaveAnAccount-text'>Don't have an account ?</span>
                            <Link className='dontHaveAnAccount-logIntext' href='./signup'>Sign up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        { showToast &&
            <ToastContainer/>
        }
        



        {signInLoader &&
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
    </>
  )
}
