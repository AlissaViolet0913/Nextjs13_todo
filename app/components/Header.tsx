"use client";

import React, { useEffect, useState } from 'react'
import styles from "../../styles/Header.module.css"
import GetCookieId from './cookie/GetCookieId';
import { supabase } from '../../supabase';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Header({ isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const[name, setName] = useState("");
  const id = GetCookieId();
  const router = useRouter();


  useEffect(()=>{
    const fetchUserName = async()=>{
      if(id){
        const{data, error} = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

        if(error){
          console.log("ログインユーザー情報取得失敗", error.message)
        }else{
          setName(data.name);
        }
      }

      if(!id){
        return null;
      }
    }

    fetchUserName();
  },[])

   // メニューボタンのクリックを処理する関数
   const menuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // ログアウト処理
  const logoutHandler = () =>{
    if(document.cookie !== ""){
      // id情報等を削除して、有効期限を切らす
      let expirationDate = new Date("1999-12-31T23:59:59Z");
      document.cookie = `id=; expires=${expirationDate.toUTCString()}; path=/;`;
      document.cookie = `loginSt=; expires=${expirationDate.toUTCString()}; path=/;`;
      alert("ログアウトしました");
      window.location.reload();
      return; // ここで関数を終了させる
    }else{
      alert("ログインしていません")
      return;
    }
  }

  // 「ゲストさん」のときだけログインページに遷移させる
  const handleNameClick = () => {
    if (id) {
     return;
    } else {
      alert("ログインしてください");
      router.push("/user/login");
    }
  };


  // ログインしてたら、それぞれの該当ページに遷移させる
  const handleNavigation = (path: string) => {
    if (id) {
      router.push(path); 
    } else {
      alert("ログインしてください");
      router.push("/user/login");
    }
  };
    
  return (
    <div>
     <div className={styles.Header}>
      <div className={styles.loginIcon}>
     <div className={styles.link} onClick={handleNameClick}>  
      <img src="./login.png" className={styles.login}/>
      <div>{name ? `${name}さん` : 'ゲストさん'}</div>
     </div>
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
            <div className={styles.link} onClick={() => handleNavigation('/todo')}><li>TODOリスト</li></div>
            <div className={styles.link} onClick={() => handleNavigation('/user')}><li>マイページ</li></div>
            <a href='/contact' className={styles.link}><li>お問い合わせ</li></a>
            <div className={styles.link} onClick={logoutHandler}><li>ログアウト</li></div>
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
