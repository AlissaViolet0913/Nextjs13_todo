"use client"

import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import styles from "../../styles/Todo.module.css"
import AddTask from '../components/AddTask'
import TodoList from '../components/TodoList'
import GetCookieId from '../components/cookie/GetCookieId'
import { supabase } from '@/supabase'
import LogSt from '../components/cookie/logSt'

function Todo() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const cookieID = GetCookieId();
  const [calorie, setCalorie] = useState<number | null>(null);
  const [yearsPassed, setYearsPassed] = useState<number | undefined>(undefined);
  const [userData, setUserData] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', cookieID);

        if (error) {
          console.error('ユーザーデータの取得に失敗しました', error);
        } else {
          const userData = data[0];

          // userData.birthdayが正しい値であることを確認
          if (userData && userData.birthday) {
            // 以下の日付処理部分は変更せずにそのまま利用
            const birthday = userData.birthday.toString();
            const birthYear = parseInt(birthday.substring(0, 4));
            const birthMonth = parseInt(birthday.substring(4, 6)) - 1; //月が0から始まるため
            const birthDay = parseInt(birthday.substring(6, 8));

            const birthDate = new Date(birthYear, birthMonth, birthDay);
            const today = new Date();
            let yearsPassed = today.getFullYear() - birthDate.getFullYear();

            if (
              today.getMonth() < birthDate.getMonth() ||
              (today.getMonth() === birthDate.getMonth() &&
                today.getDate() < birthDate.getDate())
            ) {
              yearsPassed;
              setYearsPassed(yearsPassed => yearsPassed ?? 0);            }
          } else {
            console.error('userData.birthdayが不正な値です');
          }


          // Math.round:小数点以下四捨五入、整数表示
          if(data[0].gender === "女性" && data[0].weight && data[0].height){
            const kcalValue = Math.round(447.593 + (9.247 * data[0].weight) + (3.098 * data[0].height) - (4.330 * (yearsPassed || 0)));
            setCalorie(kcalValue);
          }
          if(data[0].gender === "男性" && data[0].weight && data[0].height){
            const kcalValue = Math.round(88.362 + (13.397 * data[0].weight) + (4.799 * data[0].height) - (5.677 * (yearsPassed || 0)));
            setCalorie(kcalValue)
          }


          if(!data[0].weight || data[0].height){
            setUserData(true)
          }
          
        }
      
    };

    fetchData();
  }, []);


  

  return (
    <div className={isMenuOpen ? `${styles.container}`: ""}>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
      <main className={styles.main}>
        <h1><span>WORK OUT</span> Todo List</h1>
        <div className={styles.contents}>
          <div className={styles.content}>
          
          {calorie !== null ? `あなたの基礎代謝：${calorie}kcal` : (userData ? "身長もしくは体重未登録のため基礎代謝を表示できません。マイページから登録してください" : null)}
            <AddTask userId={cookieID}/>
            <TodoList userId={cookieID}/>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Todo
