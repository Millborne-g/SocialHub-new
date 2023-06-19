"use client"  
import React, { createContext, useEffect, useState } from 'react';
import { Dropdown, Button, Modal  } from 'react-bootstrap';

interface SocialLinkProps {
  userLinkTitle: string,
  userLinkUrl: string,
  userLinkUuid: string,

} 

export default function socialLink({userLinkTitle, userLinkUrl, userLinkUuid}:SocialLinkProps) {
  const [userID, setUserID] = useState(localStorage.getItem('userID'));
  return (
    <>
        <a className="socialLinkItem" href={userLinkUrl} target='_blank'>
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
                      <Dropdown.Item href="#">Delete</Dropdown.Item>
                  </Dropdown.Menu>
              </Dropdown>
              }
            </div>
            
            
          </div>
        </a>
    </>
  )
}
