"use client"  
import React, { createContext, useEffect, useState } from 'react';
import { Dropdown, Button, Modal  } from 'react-bootstrap';
import {db,storage} from '../../../firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';

interface SocialLinkProps {
  userLinkTitle: string,
  userLinkUrl: string,
  userLinkUuid: string,

} 

export default function socialLink({userLinkTitle, userLinkUrl, userLinkUuid}:SocialLinkProps) {
  const [userID, setUserID] = useState(localStorage.getItem('userID'));
  const [linkID, setLinkID] = useState('');

  const handleDelete = () => {
    

    onValue(ref(db, `/Links/${linkID}/socialLinks`), (snapshot) => {
        // setTodos([]);
        
        const data = snapshot.val();
        if (data !== null) {
          
          Object.values(data).map((linkTimeDate) => {
            if(typeof linkTimeDate === 'object' && linkTimeDate !== null){
                let linkUuid = (linkTimeDate as {uuid?: String}).uuid
                let linkdateID = (linkTimeDate as{dateTimeID?: String}).dateTimeID;
                
                if(userLinkUuid === linkUuid){
                  // console.log('found '+linkdateID);
                  remove(ref(db, `/Links/${linkID}/socialLinks/${linkdateID}`));
                }
            }
            //   console.log(todo.plateNumber)
            // setTodos((oldArray) => [...oldArray, todo]);
          });
        }
    });
  };

  useEffect(() =>{
    var currentURL = window.location.href;
    var urlParts = currentURL.split('/');
    var lastItem = urlParts[urlParts.length - 1];
    console.log(lastItem);
    setLinkID(lastItem);
  },[]);
  //href={userLinkUrl} target='_blank'
  return (
    <>
        <div className="socialLinkItem" >
          <div className="socialLinkItem-inner">
            <div className="socialLinkItemRight">
              <span className='socialLinkItemName'>{userLinkTitle}</span> <br />
              <span className='socialLinkItemLink'>{userLinkUrl}</span>
            </div>

            <div className="socialLinkItemRight">
            {userID && 
              <Dropdown className='userDropdownLinks'>
                  <div className="userDotsContainer">
                      <Dropdown.Toggle variant="btn" id="navbarDropdownMenuLink">
                          <span className='userLinkBtnIcon'>⋮</span>    
                      </Dropdown.Toggle>
                  </div>
                  <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                      <Dropdown.Item href='#'>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
                  </Dropdown.Menu>
              </Dropdown>
              }
            </div>
            
            
          </div>
        </div>
    </>
  )
}
