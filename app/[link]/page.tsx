"use client"

import './link.css';
import Navbar from '../Navbar';
import React, { createContext, useEffect, useState } from 'react';
import {db,storage} from '../../firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, StorageReference } from "firebase/storage";
import socialFeed from '../../assets/socialsFeed.svg'

export default function linkDetails() {
  const [userID, setUserID] = useState(localStorage.getItem('userID'));
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');

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
    <>
      <Navbar />
      <div className="socialLinkContainer container">
          <div className="socialLinkContainer-inner">
              <div className="socialLinkHeader">
                <div className='socialLinkImageContainer'>
                  <img className='socialLinkImage' src={'https://static.vecteezy.com/system/resources/previews/003/763/788/original/social-media-facebook-instagram-logos-social-media-icons-black-and-white-set-free-vector.jpg'} alt="" />
                </div>
                <div>
                  <span className='socialLinkName'>Title Link</span> 
                  <div className='socialLinkByUser'><img className='socialLinkByUserImage' src={'https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg'} alt="" /> <span>by: user</span></div>
                </div>
                
              </div>

              <div className='socialLinkDivider'></div>
              <div className="socialLinkVideosLabel">
                <div className="socialLinkVideosLabel-inner">
                  <img className='socialLinkVideosLabelImage' src={socialFeed.src} alt="" /> 
                  <span className='socialLinkVideosLabelText'>Socials</span> 
                </div>
                
              </div>

              <div className="socialLinkVideosContainer">
                <div className="socialLinkItem">
                  <iframe src="http://www.google.com/">Google</iframe>
                </div>
                <div className="socialLinkItem">
                  
                </div>
                <div className="socialLinkItem">
                  
                </div>
                
              </div>
          </div>
      </div>
    </>
  )
}
