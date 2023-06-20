"use client"

import React, { createContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Dropdown } from 'react-bootstrap'; 
import {db,storage} from '../../firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { connectStorageEmulator } from 'firebase/storage';
interface LinksProps {
  userLinkTitle: string;
  userFormattedDate: string;
  userImageLinkURL: string;
  userLinkUuid: string;
  setToastText: Function
}

export default function Links({ userLinkTitle, userFormattedDate, userImageLinkURL , userLinkUuid, setToastText}: LinksProps) {
    const [userID, setUserID] = useState(localStorage.getItem('userID'));
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
                    }
                }
                //   console.log(todo.plateNumber)
                // setTodos((oldArray) => [...oldArray, todo]);
              });
            }
        });
    };
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
                            <button type="button" className="btn userCopyBtn"> <span className='userLinkBtnIcon'><i className='bx bx-copy-alt' ></i></span> </button>
                           
                            <Dropdown className='userDropdownLinks'>
                                <div className="userDotsContainer">
                                    <Dropdown.Toggle variant="btn" id="navbarDropdownMenuLink">
                                        <span className='userLinkBtnIcon'>⋮</span>    
                                    </Dropdown.Toggle>
                                </div>
                                <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                                    <Dropdown.Item href={`/${userLinkUuid}`}>Edit</Dropdown.Item>
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
