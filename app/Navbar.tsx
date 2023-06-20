"use client"
import React, { useEffect, Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';
import logo from '../assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, Button, Modal  } from 'react-bootstrap';
import {db,storage} from '../firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, StorageReference } from "firebase/storage";
import {useSession, signIn, signOut} from 'next-auth/react';


// export default function Navbar({ setShowNavbar }: { setShowNavbar: React.Dispatch<React.SetStateAction<boolean>> }) {
export default function Navbar() {
  const [userID, setUserID] = useState('');
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  useEffect(() => {
    // This useEffect hook ensures that the Bootstrap JavaScript code is executed
    // after the component is mounted
    if (typeof window !== 'undefined') {
      // Check if window is defined to avoid server-side rendering issues
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  useEffect(() => {
    const storedUserID = typeof window !== 'undefined' ? localStorage.getItem('userID') : null;
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);

  useEffect(() =>{
    if(userID){
        if(userID){
            onValue(ref(db, `/users/${userID}`), (snapshot) => {
                // setUserLinkList([]);
                const data = snapshot.val();
                if (data !== null) {
                    const reversedData = Object.values(data).reverse();
                    reversedData.map((linkDetails) => {
                        if (typeof linkDetails === 'object' && linkDetails !== null) {
                        let userLinkTitle = (linkDetails as { linkTitle?: string }).linkTitle;
                        let userFormattedDate = (linkDetails as { formattedDate?: string }).formattedDate;
                        let userImageLinkURL = (linkDetails as { imageLinkURL?: string }).imageLinkURL;
                        // setUserLinkList((oldArray:any) => [...oldArray, [userLinkTitle, userFormattedDate, userImageLinkURL]]);  
                        }
                    });

                    let userFullName = data.name;
                    let userImage = data.imageLink;

                    setUserName(userFullName);
                    setUserImage(userImage);
              }
            });
        }
    }
  },[userID])
  
  return (
    <header>
        <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <a className="navbar-brand" href="http://localhost:3000/">
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
                      {userID ? 
                        <li className="nav-item">
                          <div className="userAccount">
                                    
                            <div className="userAccount-inner">
                                <Dropdown className='userDropdownNavbar'>
                                    <div className="userImageContainerNavbar">
                                      <Dropdown.Toggle variant="btn" id="navbarDropdownMenuLink">
                                          <img className='userImageProfileNavbar' src={userImage} alt="" />
                                          <span className='userNameDashboardNavbar'>{userName}</span>
                                      </Dropdown.Toggle>
                                      </div>
                                      <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                                      <Dropdown.Item onClick={() => {localStorage.setItem('userID', ''); signOut()}}>Logout</Dropdown.Item>
                                      </Dropdown.Menu>
                                  </Dropdown>
                              </div>
                            </div> 
                          </li>
                        :
                        <>
                          <li className="nav-item">
                            <span className="nav-link"><Link className='navlogin' href="/login">Log in</Link></span>
                          </li>
                          <li className="nav-item">
                            <Link type="button" className="btn btn-primary" href="/signup"><span className='navSignUp'>Sign up</span></Link>
                            {/* onClick={() => {setShowNavbar(false)}} */}
                          </li>
                        </>
                        

                      }
                      
                    </ul>
                </div>
                
            </div>
        </nav>
    </header>
  )
}
