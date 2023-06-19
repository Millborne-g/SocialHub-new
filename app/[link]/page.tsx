"use client"

import './link.css';
import Navbar from '../Navbar';
import React, { createContext, useEffect, useState } from 'react';
import {db,storage} from '../../firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, StorageReference } from "firebase/storage";
import socialFeed from '../../assets/socialsFeed.svg'
import SocialLink from './components/socialLink';
import { uid } from 'uid';

import { Dropdown, Button, Modal  } from 'react-bootstrap';

export default function linkDetails() {
  const [userID, setUserID] = useState(localStorage.getItem('userID'));
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');

  const [linkTitle, setLinkTitle] = useState('');
  const [linkImageURL, setLinkImageURL] = useState('');
  const [linkUserID, setLinkUserID] = useState('');
  const [linkUserImage, setLinkUserImage] = useState('');
  const [linkUserName, setLinkUserName] = useState('');

  const [socialLinkList, setSocialLinkList] = useState<any[]>([]);

  const [linkID, setLinkID] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [socialTitle, setSocialTitle] = useState('')
  const [socialLink, setSocialLink] = useState('')

  const handleClose = () => {
    setShowCreateModal(false);
    setSocialTitle('');
    setSocialLink('');
  };
  const handleShow = () => setShowCreateModal(true);

  const submit_Social_to_DB = () =>{
    if(socialTitle && socialLink){
      const uuid = uid();
      set(ref(db, `/Links/${linkID}/socialLinks/${uuid}`), {
        socialTitle,
        socialLink,
        uuid
      });
      setSocialTitle('');
      setSocialLink('');
      setShowCreateModal(false)
    }
    
  }

  // useEffect(() =>{
  //   if(userID){
  //       if(userID){
  //           onValue(ref(db, `/users/${userID}`), (snapshot) => {
  //               // setUserLinkList([]);
  //               const data = snapshot.val();
  //               if (data !== null) {
  //                   const reversedData = Object.values(data).reverse();
  //                   reversedData.map((linkDetails) => {
  //                       if (typeof linkDetails === 'object' && linkDetails !== null) {
  //                       let userLinkTitle = (linkDetails as { linkTitle?: string }).linkTitle;
  //                       let userFormattedDate = (linkDetails as { formattedDate?: string }).formattedDate;
  //                       let userImageLinkURL = (linkDetails as { imageLinkURL?: string }).imageLinkURL;
  //                       // setUserLinkList((oldArray:any) => [...oldArray, [userLinkTitle, userFormattedDate, userImageLinkURL]]);  
  //                       }
  //                   });

  //                   let userFullName = data.name;
  //                   let userImage = data.imageLink;

  //                   // setUserName(userFullName);
  //                   // setUserImage(userImage);
  //             }
  //           });
  //       }
  //   }
  // },[userID]);

  useEffect(() =>{
    var currentURL = window.location.href;
    var urlParts = currentURL.split('/');
    var lastItem = urlParts[urlParts.length - 1];
    console.log(lastItem);
    setLinkID(lastItem);


    

  },[]);

  useEffect(() =>{
    if(linkID){
      
      onValue(ref(db, `/Links/${linkID}`), (snapshot) => {
        // setUserLinkList([]);
        const data = snapshot.val();
        if (data !== null) {
            // const reversedData = Object.values(data).reverse();
            // reversedData.map((linkDetails) => {
            //     if (typeof linkDetails === 'object' && linkDetails !== null) {
            //     let userLinkTitle = (linkDetails as { linkTitle?: string }).linkTitle;
            //     let userFormattedDate = (linkDetails as { formattedDate?: string }).formattedDate;
            //     let userImageLinkURL = (linkDetails as { imageLinkURL?: string }).imageLinkURL;
            //     let userLinkUuid = (linkDetails as { uuid?: string }).uuid;
            //     // setUserLinkList((oldArray:any) => [...oldArray, [userLinkTitle, userFormattedDate, userImageLinkURL, userLinkUuid]]);  
            //     }
            // });
            setLinkTitle(data.linkTitle);
            setLinkImageURL(data.imageLinkURL);
            setLinkUserID(data.userID);
            console.log('test '+data.userID);
            onValue(ref(db, `/users/${data.userID}`), (snapshot) => {
              // setUserLinkList([]);
              const data = snapshot.val();
              if (data !== null) {
                setLinkUserImage(data.imageLink);
                setLinkUserName(data.name)
            }});

            onValue(ref(db, `/Links/${linkID}/socialLinks`), (snapshot) => {
              setSocialLinkList([])
              const data = snapshot.val();
              if (data !== null) {
                Object.values(data).map((socialLinkDetails) => {
                  if (typeof socialLinkDetails === 'object' && socialLinkDetails !== null) {
                    let userLinkTitle = (socialLinkDetails as { socialTitle?: string }).socialTitle;
                    let userLinkUrl = (socialLinkDetails as { socialLink?: string }).socialLink;
                    let userLinkUuid = (socialLinkDetails as { uuid?: string }).uuid;
                    setSocialLinkList((oldArray:any) => [...oldArray, [userLinkTitle, userLinkUrl, userLinkUuid]]);
                    // setUserLinkList((oldArray:any) => [...oldArray, [userLinkTitle, userFormattedDate, userImageLinkURL, userLinkUuid]]); 
                    console.log('link!!!!!!!!')
                  } 
                })
              }
            })

        }
      });
    }
  },[linkID])

  

  return (
    <>
      <Navbar />
      <div className="socialLinkContainer container">
          <div className="socialLinkContainer-inner">
              <div className="socialLinkHeader">
                <div className='socialLinkImageContainer'>
                  <img className='socialLinkImage' src={linkImageURL} alt="" />
                </div>
                <div>
                  <span className='socialLinkName'>{linkTitle}</span> 
                  <div className='socialLinkByUser'>
                    <img className='socialLinkByUserImage' src={linkUserImage} alt="" /> 
                    <span className='socialLinkByUserName'>{linkUserName}</span>
                  </div>
                </div>
                
              </div>

              {userID && 
                <div className="addSocialsContainer">
                  <div className="addSocialsContainer-inner">
                    <button type="button" className="btn btn-primary addSocialsBtn" onClick={handleShow}> <span>+ Add Socials</span> </button>
                  </div>
                </div>
              }
              

              <div className='socialLinkDivider'></div>
              <div className="socialLinkLabel">
                <div className="socialLinkLabel-inner">
                  <img className='socialLinkLabelImage' src={socialFeed.src} alt="" /> 
                  <span className='socialLinkLabelText'>Socials</span> 
                </div>
                
              </div>

              <div className="socialLinkItemContainer">
                {socialLinkList.map((linkDetails, index) => (
                  <SocialLink key={index} userLinkTitle={linkDetails[0]} userLinkUrl={linkDetails[1]} userLinkUuid={linkDetails[2]}/>
                ))}
                  
                
              </div>
          </div>
      </div>

      <Modal show={showCreateModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
          <Modal.Title>Add Social</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <form>
                  <label htmlFor="addLinkTitle" className="form-label userCreateLinkNameLabel">Link name</label> 
                  <input type="text" className="form-control userCreateLinkInput" id="addLinkTitle" placeholder='Link name' value={socialTitle} onChange={(e)=>setSocialTitle(e.target.value)} required/>

                  <label htmlFor="addLink" className="form-label userCreateLinkNameLabel">Social link</label> 
                  <input type="text" className="form-control userCreateLinkInput" id="addLink" placeholder='https://www.sociallink.com/' value={socialLink} onChange={(e)=>setSocialLink(e.target.value)} required/>

                  
              </form>
                                    
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
              Close
          </Button>
          <Button variant="primary" type='submit' onClick={()=>submit_Social_to_DB()}>Save</Button>
          </Modal.Footer>
      </Modal>
    </>
  )
}
