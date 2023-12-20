// setCountはクライエントサイドで行うからuse clientの記述が必要になった。
"use client";
import React, { useEffect } from 'react';
import styles from '../styles/Home.module.css'
import Footer from './components/Footer'
import Header from './components/Header'
import { useState } from 'react'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  useEffect(() => {
    let imagesItems = [...document.querySelectorAll(".img-wrap")];
    let titles = [...document.querySelectorAll("h2")];
    let titleMessage = document.querySelector("title");

    let options = {
      rootMargin: "0px",
      threshold: 0.5,
    };

    let setItemActive = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('Adding active class:', entry.target);
          
          entry.target.classList.add("active");
        } else {
          entry.target.classList.remove("active");
        }
      });
    };

    let observer = new IntersectionObserver(setItemActive, options);

    if (titleMessage) {
      observer.observe(titleMessage);
    }

    // 偶数か奇数かで表示する位置を変える
    imagesItems.forEach((item, index) => {
      const divItem = item as HTMLDivElement;
      const childElement = divItem.children[0] as HTMLDivElement;
    
      childElement.style.backgroundImage = `url(./images/${index + 1}.png)`;
      index % 2 === 0 ? (divItem.style.left = "55%") : (divItem.style.left = "5%");
      observer.observe(divItem);
    });
    

    titles.forEach((title, index) => {
      index % 2 === 0 ? (title.style.left = "45%") : (title.style.left = "35%");
      observer.observe(title);
    });
    
    if (titleMessage) {
      observer.observe(titleMessage);
    }

    // Cleanup function
    return () => {
      observer.disconnect();
    };
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <div className={isMenuOpen ? `${styles.container}`: ""}>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
      
      <div className={styles.body}>
      <div className={styles.title}>
      <h1>毎日の<span className={styles.span}>WORK OUT</span>管理</h1>
      <p className={styles.description}>
          運動TODOリストを作りましょう
        </p>
    </div>

    <section className={styles.section}>
      <h2 className={styles.h2}>自分の基礎代謝を知る</h2>
      <div className={styles.img_wrap}>
        <div className={styles.img}></div>
      </div>
    </section>
    <section className={styles.section}>
    <h2 className={styles.h2}>毎日のトレーニングメニュー作成</h2>
    <div className={styles.img_wrap}>
      <div className={styles.img}></div>
      </div>
    </section>
    <section className={styles.section}>
    <h2 className={styles.h2}>新しい自分を見つけよう</h2>
    <div className={styles.img_wrap}>
      <div className={styles.img}></div>
      </div>
    </section>
    </div>


      <Footer />
    </div>
  )
}
