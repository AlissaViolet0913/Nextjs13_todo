import React, { useState } from 'react'
import styles from "../../styles/Header.module.css"
import Link from 'next/link';


interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Header({ isMenuOpen, setIsMenuOpen }: HeaderProps) {
  // メニューボタンのクリックを処理する関数
  const menuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const Login = ()=>{
  }
    
  return (
    <div>
     <div className={styles.Header}>
      <div className={styles.loginIcon}>
     <Link href="/user/login" className={styles.link}>  
     <img src="./login.png" className={styles.login}/>
     <div>ゲストさん</div>
     </Link>
      </div>
    {/* Hamburgerメニュー */}
      <div className={isMenuOpen ? `${styles.hamburgerMenu} ${styles.menuOpen}` : styles.hamburgerMenu}>
        <div className={styles.hamburgerMenu} onClick={menuOpen}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nav className={isMenuOpen? `${styles.nav} ${styles.open}` : styles.nav}>
          <ul>
          <a href='' className={styles.link}><li>TODOリスト</li></a>
            <a href='' className={styles.link}><li>マイページ</li></a>
            <a href='' className={styles.link}><li>お問い合わせ</li></a>
            <a href='/user/login' className={styles.link}><li>ログアウト</li></a>
          </ul>
        </nav>
      </div>

     </div>

    </div>
  )
}

export default Header
function useNavigate(): any {
  throw new Error('Function not implemented.');
}
