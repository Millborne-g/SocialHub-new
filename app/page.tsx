'use client';
import Image from 'next/image'
import styles from './page.module.css'
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import { useEffect } from 'react';

import HeroSection from './HeroSection';
import { Roboto} from 'next/font/google';
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  return (
    <main className={roboto.className}>
      {/* <Navbar /> */}
      <HeroSection />
    </main>
  )
}
