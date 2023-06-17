import React from 'react';

export default function SideBar() {
  let arrow = document.querySelectorAll(".arrow");
  for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e)=>{
   let arrowParent = (e.target as HTMLElement)?.parentElement?.parentElement; // Explicitly type as HTMLElement
   arrowParent?.classList.toggle("showMenu");
   
    });
  }
  // let sidebar = document.querySelector(".sidebar");
  // let sidebarBtn = document.querySelector(".bx-menu");
  // console.log(sidebarBtn);
  // sidebarBtn?.addEventListener("click", ()=>{
  //   sidebar?.classList.toggle("close");
  //   // console.log('yow')
  // });

  const menuClicked = () =>{
    let sidebar = document.querySelector(".sidebar");
    sidebar?.classList.toggle("close");
  }
  return (
    <>
        <div className="sidebar">
          <div className="logo-details">
            <i className='bx bxl-c-plus-plus'></i>
            <button onClick={() => menuClicked()}><i className='bx bx-menu' ></i></button>
            <span className="logo_name"></span>
          </div>
          <ul className="nav-links">
            <li className="active">
              <a href="#">
                <i className='bx bx-grid-alt' ></i>
                <span className="link_name">Dashboard</span>
              </a>
              <ul className="sub-menu blank">
                <li><a className="link_name" href="#">Category</a></li>
              </ul>
            </li>
            <li>
              <a href="#">
                <i className='bx bx-info-circle'></i>
                <span className="link_name">About</span>
              </a>
              <ul className="sub-menu blank">
                <li><a className="link_name" href="#">About</a></li>
              </ul>
            </li>
            <li>
          
        </li>
      </ul>
      </div>
      
    </>
  )
}
