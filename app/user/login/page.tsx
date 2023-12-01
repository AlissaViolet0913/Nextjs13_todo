"use client";

import React from 'react'
import { useRouter } from 'next/navigation';
import styles from "../../../styles/Login.module.css"


function Login() {
  const router = useRouter();


  return (
    <div className={styles.main}>
      <div className={styles.centeredContent}>
        <img src="../logo.png" alt="img" className={styles.logo}/>
        </div>
        <form className={styles.flex}>
          <div className={styles.flex2}>
            <span className={styles.span}>USERNAME</span>
            <div className={styles.coverdInput}>
              <input type="email" className={styles.input} placeholder="ログインID（登録メールアドレス）" maxLength={250}/>
            </div>
          </div>
          <div className={styles.flex2}>
            <span className={styles.span}>PASSWORD</span>
            <div className={styles.coverdInput}>
              <input type="password" className={styles.input} maxLength={16} placeholder="パスワード"/>
            </div>
          </div>
          <div className={styles.centeredButton}>
            <button className={styles.btn}>SIGN IN</button>
          </div>
      </form>
 
  </div>  
  )
}

export default Login
