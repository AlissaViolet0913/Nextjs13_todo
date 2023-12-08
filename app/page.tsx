// setCountはクライエントサイドで行うからuse clientの記述が必要になった。
"use client";

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Footer from './components/Footer'
import Header from './components/Header'
import { useState } from 'react'
import TabTitle from './components/tabTitle';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className={isMenuOpen ? `${styles.container}`: ""}>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>

    
      <main className={styles.main}>
        <h1 className={styles.title}>
          毎日の<a href="https://nextjs.org">WORK OUT管理</a>
        </h1>

        <p className={styles.description}>
          運動TODOリストを作りましょう
        </p>
      </main>

      <Footer />
    </div>
  )
}
