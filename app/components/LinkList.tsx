import React, { createContext, useEffect, useState } from 'react'
import Links from './Links';
import {db} from '../../firebase';

import { onValue, ref, remove, set, update } from 'firebase/database';

interface props {
  setListCount: Function
  setToastText: Function
  setShowToast: Function
}

export default function LinkList({setListCount, setToastText, setShowToast}:props) {
  const [userID, setUserID] = useState(localStorage.getItem('userID'));
  const [userLinkList, setUserLinkList] = useState<any[]>([]);

  useEffect(() =>{
    if(userID){
        onValue(ref(db, `/UserLinks/${userID}`), (snapshot) => {
            setUserLinkList([]);
            const data = snapshot.val();
            if (data !== null) {
                const reversedData = Object.values(data).reverse();
                reversedData.map((linkDetails, index) => {
                    if (typeof linkDetails === 'object' && linkDetails !== null) {
                    let userLinkTitle = (linkDetails as { linkTitle?: string }).linkTitle;
                    let userFormattedDate = (linkDetails as { formattedDate?: string }).formattedDate;
                    let userImageLinkURL = (linkDetails as { imageLinkURL?: string }).imageLinkURL;
                    let userLinkUuid = (linkDetails as { uuid?: string }).uuid;
                    setUserLinkList((oldArray:any) => [...oldArray, [userLinkTitle, userFormattedDate, userImageLinkURL, userLinkUuid]]);  
                    if(index>=0){
                      setListCount(''+(index+1));
                    } else{
                      setListCount(''+0);
                    }
                    
                    }
                    
                });
          } else{
            setListCount(''+0);
          }

          
        });
    }
  },[userID]);

  return (

    <>
    {userLinkList.length > 0 ? (
      userLinkList.map((linkDetails, index) => (
        <Links
          key={index}
          userLinkTitle={linkDetails[0]}
          userFormattedDate={linkDetails[1]}
          userImageLinkURL={linkDetails[2]}
          userLinkUuid={linkDetails[3]}
          setToastText={setToastText}
          setShowToast={setShowToast}
        />
      ))
    ) : (
      <div className="listEmptyContainer">
          <span className='listEmptyText'>List Empty</span>
      </div>
      
    )}
    
    </>
  )
}
