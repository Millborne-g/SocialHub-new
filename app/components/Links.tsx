import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Dropdown } from 'react-bootstrap'; 
interface LinksProps {
  userLinkTitle: string;
  userFormattedDate: string;
  userImageLinkURL: string;
}

export default function Links({ userLinkTitle, userFormattedDate, userImageLinkURL }: LinksProps) {
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
                           
                            <Dropdown className='userDropdown'>
                                <div className="userDotsContainer">
                                    <Dropdown.Toggle variant="btn" id="navbarDropdownMenuLink">
                                        <span className='userLinkBtnIcon'>⋮</span>    
                                    </Dropdown.Toggle>
                                </div>
                                <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                                    <Dropdown.Item href="#">Edit</Dropdown.Item>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
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
