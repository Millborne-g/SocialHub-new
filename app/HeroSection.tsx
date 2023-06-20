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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export let emailAddValue = '';

export default function HeroSection() {
    const [userID, setUserID] = useState('');
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [emailAdd, setEmailAdd]= useState('');
    
    const [linkTitle, setLinkTitle] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null);;
    const [imageLinkURL, setImageLinkURL] = useState('');
    const [showLoader, setShowLoader] = useState(false);

    const [listCount, setListCount]= useState('')

    const [showToast, setShowToast] = useState(false);
    const [toastText,setToastText] = useState('');

    const customToastId = "custom-id-notify";

    useEffect(() => {
        const storedUserID = typeof window !== 'undefined' ? localStorage.getItem('userID') : null;
        if (storedUserID) {
          setUserID(storedUserID);
        }
      }, []);

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
        // emailAddValue = emailAdd;    
        localStorage.setItem('heroPageEmail', emailAdd);
    },[emailAdd])

    useEffect(() => {
        if (showToast && toastText) {
            notifySuccess();
            // setClickSignIn(false);

            setTimeout(() =>{
                setToastText('');
            },5000)
        }
    }, [toastText]);

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
                    if(userImage !== ''){
                        setUserImage(userImage);
                    } else{
                        setUserImage('data:image/png;base64,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');
                    }
                        
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
            
            setToastText('Link successfully created!');
            setShowToast(true);
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
        } else{
            setImageLinkURL('http://drive.google.com/uc?export=view&id=1ByrmsfllxPY095bp3B2XULp1rXvaed27');
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
                                            <form className="input-group mb-3 buttonContainer-inner" onSubmit={(e) => {e.preventDefault(); setEmailAdd(emailAdd); window.location.href = '/signup'; }}>
                                                <input type="text" className="form-control emailInput" placeholder="Enter your email..." aria-label="Recipient's username" aria-describedby="button-addon2" value={emailAdd} onChange={(e) => setEmailAdd(e.target.value)}/>
                                                <Link className="emailInputBtn" href="/signup"><span> Sign up <FontAwesomeIcon className='arrowIcon' icon={faArrowRight} /></span></Link>
                                            </form>
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
                            <span> © 2023 SocialHub | <a className='portfolioLink' href="https://millborneportfolio.vercel.app/" target="_blank">Millborne Galamiton</a> All rights reserved.</span>
                        </div>
                    </section>
                </> :
                <>  
                    {/* <SideBar/>
                    <section className="home-section">
                        <div className="home-content">
                            
                        </div>
                    </section>   */}
                    <Navbar/>
                    <div className="container dashboard">
                        <div className='dashboard-inner'>
                            {/* <div className="userNavbarContainer">
                                <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary navbar-light">
                                    <div className="container">
                                        <div className='searchBarDashboard'>
                                            <form className='searhbarForm'>
                                                <input type="text" className="form-control searhInput" placeholder="Search" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                                                <button className="btn searhBtn" type="submit"><i className='bx bx-search' ></i></button>
                                                <div className="btnDividerContainer">
                                                    <div className="btnDivider"></div>
                                                </div>
                                            </form>
                                            
                                        </div>
                                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                        <span className="navbar-toggler-icon"></span>
                                        </button>
                                        
                                        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                                            <ul className="navbar-nav">
                                           
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
                                               
                                            
                                            </ul>
                                        </div>
                                        
                                    </div>
                                </nav>
                            </div> */}
                            

                            <div className="navbarDashboard">
                                    <div className='headerDashboard'>
                                        <span>Dashboard</span>
                                    </div>

                                    {/* <div className='searchBarDashboard'>
                                        <form className='searhbarForm'>
                                            <input type="text" className="form-control searhInput" placeholder="Search" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                                            <button className="btn searhBtn" type="submit"><i className='bx bx-search' ></i></button>
                                            <div className="btnDividerContainer">
                                                <div className="btnDivider"></div>
                                            </div>
                                        </form>
                                        
                                    </div> */}

                                    {/* <div className="userAccount">
                                    
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
                                    </div> */}
                                </div>

                            {/* <div className="navbarDashboard">
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
                                </div> */}


                                <div className="totalCreateContainer">
                                    <div className="totalCreateContainer-inner">
                                        <div className="totalContainer">
                                            <span>Total {listCount} links</span>
                                        </div>
                                        <button type="button" className="btn btn-primary createLinkBtn" onClick={handleShow}> <span>+ Create link storage</span> </button>
                                    </div>
                                </div>
                                <div className='userDashboardDivider'></div>

                                <div className="userLinksContanerDashboard">
                                    <LinkList setListCount={setListCount} setToastText={setToastText} setShowToast={setShowToast}/>
                                </div>

                                <Modal show={showCreateModal} onHide={handleClose} centered>
                                    <Modal.Header closeButton>
                                    <Modal.Title>Create Link Storage</Modal.Title>
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
                    </div>
                    
                    {showLoader && 
                        <Loader/>  
                    }

                    { showToast &&
                        <ToastContainer/>
                    }
                             
                </>


            
            }
            
        </>
    
  )
}
