import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Dropdown } from 'react-bootstrap'; 

export default function Links() {
  return (
    <>
        <div className="userLinksContaner">
            <div className="userLinksContaner-inner">
                <div className="userLinksContanerLeft">
                    <div className="linkImageContainer">
                        <img src={"https://www.socialmediabutterflyblog.com/wp-content/uploads/sites/567/2020/06/45AADA8F-D4A6-4FFB-9009-966337D5CC1B.png"} alt="" />
                    </div>
                    
                    <div className="userLinkTitle">
                        <span className='userLinkTitleText'>Title link</span>
                        <span className='userLinkTitleTextDate'><i className='bx bxs-calendar' ></i> <span>May 22, 2023 2:35 PM GMT</span></span>
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
