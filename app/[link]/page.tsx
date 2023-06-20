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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from '../components/Loader';

export default function linkDetails() {
  const [userID, setUserID] = useState(localStorage.getItem('userID'));
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');

  const [linkTitle, setLinkTitle] = useState('');
  const [linkEditTitle, setLinkEditTitle] = useState('');
  const [linkImageURL, setLinkImageURL] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);;
  const [linkEditImageURL, setLinkEditImageURL] = useState('');
  
  const [editSocialTitle, setEditSocialTitle] = useState('');
  const [editSocialLink, setLinkSocialLink] = useState('');
  const [editSocialID, setEditSocialID] = useState('');

  const [linkUserID, setLinkUserID] = useState('');
  const [linkUserImage, setLinkUserImage] = useState('');
  const [linkUserName, setLinkUserName] = useState('');

  const [socialLinkList, setSocialLinkList] = useState<any[]>([]);

  const [linkID, setLinkID] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showEditHeaderModal, setShowEditHeaderModal] = useState(false);
  const [showEditSocialModal, setShowEditSocialModal] = useState(false);

  const [socialTitle, setSocialTitle] = useState('')
  const [socialLink, setSocialLink] = useState('')

  const [showToast, setShowToast] = useState(false);
  const [toastText,setToastText] = useState('');

  const [showLoader, setShowLoader] = useState(false);

  const customToastId = "custom-id-notify";

  useEffect(() => {
    document.title = linkTitle;
  }, [linkTitle]);
  
  const notifySuccess = () => toast.success(toastText, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      toastId: customToastId
  });

  useEffect(() => {
    if (showToast) {
        notifySuccess();
        // setClickSignIn(false);
    }
  }, [toastText]);

  const handleClose = () => {
    setShowCreateModal(false);
    setSocialTitle('');
    setSocialLink('');
  };
  const handleShow = () => setShowCreateModal(true);


  const handleEditHeaderClose = () => {
    setShowEditHeaderModal(false);
  };
  const handleEditHeaderShow = () => {
    setShowEditHeaderModal(true);
    setLinkEditTitle(linkTitle);
  };

  const handleEditSocialClose = () => {
    setShowEditSocialModal(false);
  };
  const handleEditSocialShow = () => {
    setShowEditSocialModal(true);
    // setLinkEditTitle(linkTitle);
  };

  const submit_Social_to_DB = () =>{
    const currentDate = new Date();
    // title date and time
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    // end title date and time

    const formattedTitleDateTime = `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
    if(socialTitle && socialLink){
      const uuid = uid();
      set(ref(db, `/Links/${linkID}/socialLinks/${formattedTitleDateTime}_${uuid}`), {
        socialTitle,
        socialLink,
        uuid,
        dateTimeID: formattedTitleDateTime+'_'+uuid
      });
      setSocialTitle('');
      setSocialLink('');
      setShowCreateModal(false)
      setShowToast(true);
      setToastText('Social successfully created!');
    }
    
  }

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
  },[linkID]);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  useEffect(() =>{
    
    if(linkEditImageURL && linkEditTitle){
      // UserLink
      onValue(ref(db, `/UserLinks/${userID}`), (snapshot) => {
        // setUserLinkList([]);
        const data = snapshot.val();
        if (data !== null) {
          Object.values(data).forEach((dateTimeID) => {
            if(dateTimeID){
              let tempDBDateID = (dateTimeID as {dateID?: string}).dateID;
              let tempDBLinkID = (dateTimeID as {uuid?: string}).uuid;
              // console.log('ssssssssssssssssssssssssssss'+tempdateID);
              if(linkID === tempDBLinkID){
                console.log('founnndddddd');
                update(ref(db, `/UserLinks/${userID}/${tempDBDateID}`), {
                  linkTitle: linkEditTitle,
                  imageLinkURL: linkEditImageURL
                });
                //Links
                update(ref(db, `/Links/${linkID}`), {
                  linkTitle: linkEditTitle,
                  imageLinkURL: linkEditImageURL
                });
              }
              
              }
            
              // console.log(todo.plateNumber)
            // setTodos((oldArray) => [...oldArray, todo]);
          });
          
      }});
    
      setShowLoader(false);
      setShowToast(true);
      setToastText('Link successfully updated!');
      setTimeout(() =>{
        window.location.reload();
      },2000);
      
    } else{
      setShowLoader(false);
      // setShowToast(true);
      // setToastText('Link title must be filled');
    }
  },[linkEditImageURL])

   //update
  const handleEditHeader = () => {
        setShowEditHeaderModal(false);
        setShowLoader(true);
        
        if (selectedFile && linkEditTitle) {
          const test = 'test';
          // const storageRefImage = storageRef(storage);
          
          const fileRef: StorageReference = storageRef(storage, selectedFile.name);

          uploadBytes(fileRef, selectedFile)
              .then((snapshot) => getDownloadURL(snapshot.ref))
              .then((url) => {
                setLinkEditImageURL(url);
              })
              .catch((error) => {
                  console.error('Error uploading image:', error);
              });
      } else{
        setLinkEditImageURL(linkImageURL);
      }
  };

  const handleEditSocial = () => {
    setShowEditSocialModal(false);
    if(editSocialTitle && editSocialLink){
      setShowLoader(true);
      onValue(ref(db, `/Links/${linkID}/socialLinks`), (snapshot) => {
        // setUserLinkList([]);
        const data = snapshot.val();
        if (data !== null) {
          Object.values(data).forEach((dateTimeID) => {
            if(dateTimeID){
              
              let tempDBSocialID = (dateTimeID as {uuid?: string}).uuid;
              let tempDBDateTimeID = (dateTimeID as {dateTimeID?: string}).dateTimeID;

              // console.log('ssssssssssssssssssssssssssss'+tempdateID);
              if(tempDBSocialID === editSocialID){
                // console.log('Found '+tempDBDateTimeID)
                // console.log('founnndddddd');
                update(ref(db, `/Links/${linkID}/socialLinks/${tempDBDateTimeID}`), {
                  socialTitle: editSocialTitle,
                  socialLink: editSocialLink
                });
                // //Links
                // update(ref(db, `/Links/${linkID}`), {
                //   linkTitle: linkEditTitle,
                //   imageLinkURL: linkEditImageURL
                // });
              }
              
              }
            
              // console.log(todo.plateNumber)
            // setTodos((oldArray) => [...oldArray, todo]);
          });
          
      }});
      setShowLoader(false);
      setShowToast(true);
      setToastText('Social successfully updated!');
      setTimeout(() =>{
        window.location.reload();
      },2000);
    }
  }

  // useEffect(() =>{
  //   const itemContainer = document.querySelector('.socialLinkItemContainer');
  //   if(socialLinkList.length===2){
      
  //     itemContainer?.classList.add('twoItems');
  //     console.log('sddddddddddddddddddddddddddddddd');
  //   } else{
  //     itemContainer?.classList.remove('twoItems');
  //   }
  // },[socialLinkList])

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
              {userID && 
                <div className="editHeaderBtnContainer">
                  <button type="button" className="btn editHeaderBtn" onClick={handleEditHeaderShow}><i className='bx bxs-edit editHeaderIcon'></i></button>
                </div>
              }
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
                {socialLinkList.length > 0 ? (
                  socialLinkList.map((linkDetails, index) => (
                    <SocialLink key={index} userLinkTitle={linkDetails[0]} userLinkUrl={linkDetails[1]} userLinkUuid={linkDetails[2]} setToastText={setToastText} setShowEditSocialModal={setShowEditSocialModal} setEditSocialTitle={setEditSocialTitle} setLinkSocialLink={setLinkSocialLink} setEditSocialID={setEditSocialID}/>
                  ))
                  ):(
                    <div className="listEmptyContainer">
                        <span className='listEmptyText'>List Empty</span>
                    </div>
                  )
                }
                
                  
                
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

      <Modal show={showEditHeaderModal} onHide={handleEditHeaderClose} centered>
          <Modal.Header closeButton>
          <Modal.Title>Update Link</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <form>
                  <label htmlFor="createLink" className="form-label userCreateLinkNameLabel">Link name</label>
                  <input type="text" className="form-control userCreateLinkInput" id="createLink" placeholder='Link name' value={linkEditTitle} onChange={(e)=>setLinkEditTitle(e.target.value)} required/>

                  <label htmlFor="createLinkImage" className="form-label userCreateLinkNameLabel">Link image</label>
                  <input type="file" className="form-control" id="createLinkImage" accept="image/png, image/gif, image/jpeg" onChange={(e) => handleFileChange(e)}/>
              </form>
              
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleEditHeaderClose}>
              Close
          </Button>
          <Button variant="primary" type='submit' onClick={handleEditHeader}>Save</Button>
          </Modal.Footer>
      </Modal>

      <Modal show={showEditSocialModal} onHide={handleEditSocialClose} centered>
          <Modal.Header closeButton>
          <Modal.Title>Update Social</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <form>
                  <label htmlFor="addLinkTitle" className="form-label userCreateLinkNameLabel">Link name</label> 
                  <input type="text" className="form-control userCreateLinkInput" id="addLinkTitle" placeholder='Link name' value={editSocialTitle} onChange={(e)=>setEditSocialTitle(e.target.value)} required/>

                  <label htmlFor="addLink" className="form-label userCreateLinkNameLabel">Social link</label> 
                  <input type="text" className="form-control userCreateLinkInput" id="addLink" placeholder='https://www.sociallink.com/' value={editSocialLink} onChange={(e)=>setLinkSocialLink(e.target.value)} required/>
              </form>
                                    
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleEditSocialClose}>
              Close
          </Button>
          <Button variant="primary" type='submit' onClick={handleEditSocial}>Save</Button>
          </Modal.Footer>
      </Modal>

      { showToast &&
        <ToastContainer/>
      }
      {showLoader &&
        <Loader/>
      }
      
    </>
  )
}
