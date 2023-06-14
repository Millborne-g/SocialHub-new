"use client"

import React, { createContext, useEffect, useState } from 'react';

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import heroImage from '../assets/hero-image.svg'
import Navbar from './Navbar';
import Link from 'next/link';

export let emailAddValue = '';

export default function HeroSection() {
    useEffect(() => {
        document.title = 'SocialHub';
      }, []);
    const [emailAdd, setEmailAdd]= useState('')
    emailAddValue = emailAdd;
    return (
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
        </>
    
  )
}
