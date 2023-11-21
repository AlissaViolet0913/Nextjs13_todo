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
      <TabTitle title='食事管理アプリ' />

      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>

    
      <main className={styles.main}>
        <h1 className={styles.title}>
          毎日の<a href="https://nextjs.org">食事健康管理</a>
        </h1>

        <p className={styles.description}>
          食事の記録を始めましょう
        </p>
      </main>

      <Footer />
    </div>
  )
}
