"use client"

import React, { createContext, useEffect, useState } from 'react';

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import heroImage from '../assets/hero-image.svg'
import Navbar from './Navbar';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, Button, Modal  } from 'react-bootstrap';
import SideBar from './components/SideBar';
import Loader from './components/Loader';
import LinkList from './components/LinkList';
import Links from './components/Links';
import {db,storage} from '../firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, StorageReference } from "firebase/storage";
import {useSession, signIn, signOut} from 'next-auth/react';
import { uid } from 'uid';

export let emailAddValue = '';

export default function HeroSection() {
    const [userID, setUserID] = useState(localStorage.getItem('userID'));
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [emailAdd, setEmailAdd]= useState('');
    emailAddValue = emailAdd;
    console.log(localStorage.getItem('userID'));
    
    const [linkTitle, setLinkTitle] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null);;
    const [imageLinkURL, setImageLinkURL] = useState('');
    const [showLoader, setShowLoader] = useState(false);

    const [listCount, setListCount]= useState('')

    const handleClose = () => {
        setShowCreateModal(false);
        setLinkTitle('');
    };
    const handleShow = () => setShowCreateModal(true);
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

    useEffect(() =>{
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
    },[userID])

    useEffect(()=>{
        const uuid = uid();
        const currentDate = new Date();
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        };

        // title date and time
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        // end title date and time
      
        const formattedTitleDateTime = `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);
        
        if(imageLinkURL){
            set(ref(db, `/UserLinks/${userID}/${formattedTitleDateTime}_${uuid}`), {
                linkTitle,
                imageLinkURL,
                formattedDate,
                uuid,
                dateID:formattedTitleDateTime+'_'+uuid
            });
            
            set(ref(db, `/Links/${uuid}`), {
                linkTitle,
                imageLinkURL,
                formattedDate,
                userID,
                socialLinks: '',
                uuid
            });

            setShowLoader(false)
            setLinkTitle('')
            setImageLinkURL('')
        }
        
    },[imageLinkURL])

    
    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        setSelectedFile(file);
      };
    
      //write
    const submit_Link_to_DB = () =>{
       setShowLoader(true);
       setShowCreateModal(false)
        if (selectedFile) {
            const test = 'test';
            // const storageRefImage = storageRef(storage);
            
            const fileRef: StorageReference = storageRef(storage, selectedFile.name);

            uploadBytes(fileRef, selectedFile)
                .then((snapshot) => getDownloadURL(snapshot.ref))
                .then((url) => {
                    setImageLinkURL(url);
                })
                .catch((error) => {
                    console.error('Error uploading image:', error);
                });

                
        }

        // alert('Saved to Database');
    }

    

    
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
                                                <img className='userImageProfile' src={userImage} alt="" />
                                                <span className='userNameDashboard'>{userName}</span>
                                            </Dropdown.Toggle>
                                            </div>
                                            <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                                            <Dropdown.Item onClick={() => {localStorage.setItem('userID', ''); signOut()}}>Logout</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>


                            <div className="totalCreateContainer">
                                <div className="totalCreateContainer-inner">
                                    <div className="totalContainer">
                                        <span>Total {listCount} links</span>
                                    </div>
                                    <button type="button" className="btn btn-primary createLinkBtn" onClick={handleShow}> <span>+ Create Link</span> </button>
                                </div>
                            </div>

                            <div className="userLinksContanerDashboard">
                                <LinkList setListCount={setListCount}/>
                            </div>

                            <Modal show={showCreateModal} onHide={handleClose} centered>
                                <Modal.Header closeButton>
                                <Modal.Title>Create a Link</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form>
                                        <label htmlFor="createLink" className="form-label userCreateLinkNameLabel">Link name</label>
                                        <input type="text" className="form-control userCreateLinkInput" id="createLink" placeholder='Link name' value={linkTitle} onChange={(e)=>setLinkTitle(e.target.value)} required/>

                                        <label htmlFor="createLinkImage" className="form-label userCreateLinkNameLabel">Link image</label>
                                        <input type="file" className="form-control" id="createLinkImage" accept="image/png, image/gif, image/jpeg" onChange={(e) => handleFileChange(e)}/>
                                    </form>
                                    
                                </Modal.Body>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" type='submit' onClick={()=>submit_Link_to_DB()}>Save</Button>
                                </Modal.Footer>
                            </Modal>
                            
                        </div>
                      
                            
                      
                    </section>  
                    {showLoader && 
                        <Loader/>  
                    }
                             
                </>


            
            }
            
        </>
    
  )
}
