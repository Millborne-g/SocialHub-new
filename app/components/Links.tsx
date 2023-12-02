"use client"

import React, { createContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Dropdown } from 'react-bootstrap'; 
import {db,storage} from '../../firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { connectStorageEmulator } from 'firebase/storage';
import { useRouter } from 'next/navigation'
interface LinksProps {
  userLinkTitle: string;
  userFormattedDate: string;
  userImageLinkURL: string;
  userLinkUuid: string;
  setToastText: Function;
  setShowToast: Function;
}

export default function Links({ userLinkTitle, userFormattedDate, userImageLinkURL , userLinkUuid, setToastText, setShowToast}: LinksProps) {
    const router = useRouter();
    const [userID, setUserID] = useState(localStorage.getItem('userID'));
    const [copyClicked, setCopyClicked] = useState(false);
    const handleDelete = () => {
        remove(ref(db, `/Links/${userLinkUuid}`));

        onValue(ref(db, `/UserLinks/${userID}`), (snapshot) => {
            // setTodos([]);
            
            const data = snapshot.val();
            if (data !== null) {
              Object.values(data).map((linkTimeDate) => {
                if(typeof linkTimeDate === 'object' && linkTimeDate !== null){
                    let linkUuid = (linkTimeDate as {uuid?: String}).uuid
                    let linkdateID = (linkTimeDate as{dateID?: String}).dateID;
                    
                    if(userLinkUuid === linkUuid){
                        console.log('found '+ linkdateID);
                        remove(ref(db, `/UserLinks/${userID}/${linkdateID}`));
                        setToastText('Link successfully deleted!');
                        setShowToast(true);
                    }
                }
                //   console.log(todo.plateNumber)
                // setTodos((oldArray) => [...oldArray, todo]);
              });
            }
        });
    };

    const handleCopyBtn =() =>{
        try {
            navigator.clipboard.writeText(`https://social-hub-new.vercel.app/${userLinkUuid}`);
            console.log('Content copied successfully!');
            setCopyClicked(true);
            setToastText('Link copied!');
            setShowToast(true);
            setTimeout(() =>{
                setCopyClicked(false);
            },5000)
          } catch (error) {
            console.error('Failed to copy content:', error);
          }
    }
  return (
    <>
        <div className="userLinksContaner">
            <div className="userLinksContaner-inner">
                <div className="userLinksContanerLeft">
                    <div className="linkImageContainer">
                        <img src={userImageLinkURL} alt="" />
                    </div>
                    
                    <div className="userLinkTitle">
                        <span className='userLinkTitleText'>{userLinkTitle}</span>
                        <span className='userLinkTitleTextDate'><i className='bx bxs-calendar' ></i><span>{userFormattedDate}</span></span>
                    </div>
                </div>

                <div className="userLinksContanerRight">
                    <div className="userLinkBtnContainer">
                        <div className="userLinkBtnContainer-inner">
                            <button type="button" className="btn userCopyBtn" onClick={()=>handleCopyBtn()}> 
                                <span className='userLinkBtnIcon'>
                                    {copyClicked ?
                                        <i className='bx bxs-checkbox-checked'></i> :
                                        <i className='bx bx-copy-alt'></i>
                                    }
                                </span> 
                            </button>
                           
                            <Dropdown className='userDropdownLinks'>
                                <div className="userDotsContainer">
                                    <Dropdown.Toggle variant="btn" id="navbarDropdownMenuLink">
                                        <span className='userLinkBtnIcon'>⋮</span>    
                                    </Dropdown.Toggle>
                                </div>
                                <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                                    <Dropdown.Item 
                                    onClick={() => router.push(`/${userLinkUuid}`)} //href={`/${userLinkUuid}`}
                                    >Edit</Dropdown.Item>
                                    <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        
                        </div>
                    </div>
                </div>


                
            </div>
        </div>
    </>
  )
}
