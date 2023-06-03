"use client"

import React from 'react';
import logo from '../../assets/logo_signUp.svg';
import googleIcon from '../../assets/google-icon.png';
import Link from 'next/link';
import styles from './page.module.css'
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import './signup.css'
import { emailAddValue } from '../HeroSection';


export default function page() {
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
            <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" value={emailAddValue} required/>
           
          </div>
          <div className="form-group textFields">
            <label htmlFor="inputPassword" className='signUpLabel'>Password</label>
            <input type="password" className="form-control" id="inputPassword" placeholder="Password" required/>
          </div>

          <div className="form-group textFields">
            <label htmlFor="inputConfirmPassword" className='signUpLabel'>Confirm Password</label>
            <input type="password" className="form-control" id="inputConfirmPassword" placeholder="Password" required/>
          </div>
          
          <button type="submit" className="btn btn-primary signUpPageBtn">Sign up</button>
          <button type="button" className="btn btn-outline-secondary signUpPageBtn googleSignUpPageBtn"> <img className='googleIcon' src={googleIcon.src}/> <span className='google'>Continue with Google</span></button>
        </form>

        <div className='alreadyHaveAnAccount-container'>
          <span className='alreadyHaveAnAccount-text'>Already have an account ?</span>
          <Link className='alreadyHaveAnAccount-logIntext' href='./login'>Login</Link>
        </div>
      </div>
    </div>
  )
}
