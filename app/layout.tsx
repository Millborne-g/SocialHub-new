"use client"

import React, { createContext, useEffect, useState } from 'react';
import './globals.css'
import { Inter } from 'next/font/google'
import { SessionProvider } from "next-auth/react"
const inter = Inter({ subsets: ['latin'] })
import Navbar from './Navbar';
import Provider from './components/Provider'
// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({children,}: {children: React.ReactNode}) {
  const [showNavBar, setShowNavbar] = useState(true)

  // useEffect(() => {
  //   setShowNavbar(true)
  // },[showNavBar])

  return (
    
    <html lang="en">
      <head>
        <script src='https://accounts.google.com/gsi/client' async defer></script>
      
        {/* <link rel="stylesheet" href=
            "https://purecss.io/css/pure/pure-min.css"/>
        <link rel="stylesheet" href=
        "https://purecss.io/layouts/side-menu/styles.css"/>
        <script src="https://purecss.io/js/ui.js"></script> */}

        {/* <link href="https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css" rel="stylesheet" /> */}
        <link rel='stylesheet' href='https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css'></link>
      </head>
      
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
