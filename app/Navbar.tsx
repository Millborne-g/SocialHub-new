"use client"
import React, { useEffect, Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import logo from '../assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';


// export default function Navbar({ setShowNavbar }: { setShowNavbar: React.Dispatch<React.SetStateAction<boolean>> }) {
export default function Navbar() {
  useEffect(() => {
    // This useEffect hook ensures that the Bootstrap JavaScript code is executed
    // after the component is mounted
    if (typeof window !== 'undefined') {
      // Check if window is defined to avoid server-side rendering issues
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);
  return (
    <header>
        <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <a className="navbar-brand" href="#">
                    <img className='logoImg' src={logo.src} alt="" />
                    <span className='logoName'>SocialHub</span> 
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                {/* <button classNameName="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    
                </button> */}
                <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <span className="nav-link"><Link className='navlogin' href="/login">Log in</Link></span>
                      </li>
                      <li className="nav-item">
                        <Link type="button" className="btn btn-primary" href="/signup"><span className='navSignUp'>Sign up</span></Link>
                        {/* onClick={() => {setShowNavbar(false)}} */}
                      </li>
                    </ul>
                </div>
                
            </div>
        </nav>
    </header>
  )
}
