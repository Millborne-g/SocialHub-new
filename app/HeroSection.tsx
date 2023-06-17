"use client"

import React, { createContext, useEffect, useState } from 'react';

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import heroImage from '../assets/hero-image.svg'
import Navbar from './Navbar';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import SideBar from './components/SideBar';
import Links from './components/Links';

export let emailAddValue = '';

export default function HeroSection() {
    useEffect(() => {
        document.title = 'SocialHub';
      }, []);
      useEffect(() => {
        // This useEffect hook ensures that the Bootstrap JavaScript code is executed
        // after the component is mounted
        if (typeof window !== 'undefined') {
          // Check if window is defined to avoid server-side rendering issues
          require('bootstrap/dist/js/bootstrap.bundle.min.js');
        }
      }, []);
    const [emailAdd, setEmailAdd]= useState('')
    emailAddValue = emailAdd;
    console.log(localStorage.getItem('userID'));
    const [userID, setUserID] = useState(localStorage.getItem('userID'))
    return (
        <>
            {!userID ?
                <>
                    <Navbar/>
                    <section className='hero'>
                        <div className="container hero-inner">
                            <div className="row headline-inner-row">
                                <div className="col heroHeadlines">
                                    <div className="heroHeadlinesInner">
                                        <span className='headline'>Your One-Stop Link Storage Solution: <span className='headlineHighlight'>Accessible</span> and <span className='headlineHighlight'>Shareable</span></span>
                                        <span className='subHeadline'>Elevate Your Link Management Experience - Store, Share, and Access Your Links with Our Cutting-Edge Storage Solution!</span>
                                        <div className='buttonContainer'>
                                            <div className="input-group mb-3 buttonContainer-inner">
                                                <input type="text" className="form-control emailInput" placeholder="Enter your email..." aria-label="Recipient's username" aria-describedby="button-addon2" value={emailAdd} onChange={(e) => setEmailAdd(e.target.value)}/>
                                                <Link className="emailInputBtn" href="/signup"><span> Sign up <FontAwesomeIcon className='arrowIcon' icon={faArrowRight} /></span></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col heroImageContainer">
                                    <div className="heroImageContainerInner">
                                    <Image
                                        src={heroImage.src}
                                        width={650}
                                        height={650}
                                        alt="Picture of the author"
                                        priority
                                    />
                                        {/* <img src={heroImage.src} /> */}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className='footer'>
                            <span> © 2023 SocialHub | <a href="https://millborneportfolio.vercel.app/" target="_blank">Millborne Galamiton</a> All rights reserved.</span>
                        </div>
                    </section>
                </> :
                <>  
                    <SideBar/>
                    <section className="home-section">
                        <div className="home-content">
                            <div className="navbarDashboard">
                                <div className='headerDashboard'>
                                    <span>Dashboard</span>
                                </div>

                                <div className='searchBarDashboard'>
                                    <form className='searhbarForm'>
                                        <input type="text" className="form-control searhInput" placeholder="Search" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                                        <button className="btn searhBtn" type="submit"><i className='bx bx-search' ></i></button>
                                        <div className="btnDividerContainer">
                                            <div className="btnDivider"></div>
                                        </div>
                                    </form>
                                    
                                </div>

                                <div className="userAccount">
                                   
                                <div className="userAccount-inner">
                                    <Dropdown className='userDropdown'>
                                        <div className="userImageContainer">
                                        <Dropdown.Toggle variant="btn" id="navbarDropdownMenuLink">
                                            <img className='userImageProfile' src={"https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"} alt="" />
                                        </Dropdown.Toggle>
                                        </div>
                                        <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                                        <Dropdown.Item href="#">Action</Dropdown.Item>
                                        <Dropdown.Item href="#">Another action</Dropdown.Item>
                                        <Dropdown.Item href="#">Something else here</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    </div>
                                </div>
                            </div>


                            <div className="totalCreateContainer">
                                <div className="totalCreateContainer-inner">
                                    <div className="totalContainer">
                                        <span>Total 30 links</span>
                                    </div>
                                    <button type="button" className="btn btn-primary createLinkBtn"> <span><i className='bx bx-plus' ></i>Create Link</span> </button>
                                </div>
                            </div>

                            <div className="userLinksContanerDashboard">
                                <Links />
                                <Links />
                            </div>
                            
                        </div>
                    </section>             
                </>


            
            }
            
        </>
    
  )
}
