"use client";

import React, { useEffect, useState } from 'react'
import styles from '../../../styles/Registry.module.css';
import { supabase } from "../../api/supabase.js"
import { useRouter } from 'next/router';

function Registry() {
  const [displayPassword, setDisplayPassword] = useState(false);
  const [error, setError] = useState('');
  const [usersMail, setUsersMail] = useState([]);



  // useEffect(() => {
  //   const emailCheck = async () => {
  //     try {
  //       const { data: users, error } = await supabase.from("users").select('email');
  //       if (error) {
  //         console.log(error, "データ取得に失敗しました");
  //       } else {
  //         console.log(users);
  //       }
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         console.error("データ取得エラー:", error.message);
  //       }
  //     }
  //   }
  //   emailCheck();
  // }, []);  
  

  // passwordの表示・非表示
  const displayPass = () => {
    setDisplayPassword(!displayPassword);
  };
  
  // 新規会員登録
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // フォームのデフォルトの送信を防ぐ
    const router = useRouter();

    try {
      const formData = new FormData(e.currentTarget);
      const sendData = {
        email: formData.get('email'), // フォームの各要素に対応するname属性を指定して取得
        // 他のフォームデータの取得も同様に行う
      };
      
      // Check if the email is already in use
      const { data: users, error: usersError } = await supabase.from("users").select('email');
      if (usersError) {
        console.log(usersError, "データ取得に失敗しました");
        return; // Exit the function early if there's an error
      }

      const existingEmails = users.map((user) => user.email);
      if (existingEmails.includes(sendData.email)) {
        setError('このメールアドレスは既に使用されています。別のメールアドレスを入力してください。');
        return; // Exit the function early if email is already in use
      }

      // Perform the registration if email is not in use
      const { error: registrationError } = await supabase.from("users").insert(sendData);
      if (registrationError) {
        console.log(registrationError, "insertエラー");
        setError('登録に失敗しました。もう一度お試しください。');
      } else {
        // router.push('/user/login');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }

  return (
    <>
    <div className={styles.bg}>
      <form className={styles.main} onSubmit={onSubmit}>
        <h1>会員登録</h1>
        <div className={styles.tableCovered}>
          <h2 ><span>ユーザー情報</span>
            </h2>
          <table className={styles.table}>
            <tbody className={styles.userInfo}>
              {/* tr: table row */}
              {/* th: table header */}
              {/* td: tabel data */}
              <tr className={styles.tr}>
                <th className={styles.th}>
                  ユーザーネーム<span className={styles.span}>※</span>
                </th>
                <td className={styles.td}>
                  <input type="text" id="name" placeholder="健康管理" className={styles.inputT}/>                </td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>
                  Email<span className={styles.span}>※</span>
                </th>
                <td className={styles.td}>
                  <input type="email" name="email" id="email" placeholder='XXX@nurtrition.com' maxLength={256} className={styles.inputT}/>
                </td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>
                パスワード<span className={styles.span}>※</span>
                </th>
                <td className={styles.td}>
                {displayPassword ? (
                <input
                  type="text"
                  name="password"
                  id="password"
                  placeholder="********"
                  maxLength={16}
                  minLength={8}
                  className={styles.inputT}
                />
              ) : (
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="********"
                  maxLength={16}
                  minLength={8}
                  className={styles.inputT}
                />
              )}
               {displayPassword ? (
                <img src="../invisible.png" alt="非表示" className={styles.passwordVisible} onClick={displayPass}/>
              ) : (
                <img src="../visible.png" alt="表示" className={styles.passwordVisible} onClick={displayPass}/>
              )}                  
              {/* <button id="btn_passview" onClick={displayPass}>表示</button> */}
                  <p>半角英字、数字を含めて8文字以上16字以内で設定してください</p>
                </td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>
                確認パスワード<span className={styles.span}>※</span>
                </th>
                <td className={styles.td}>
                  <input type="password" name="passwordConfirmation" id="passwordConfirmation" placeholder='********' maxLength={16} minLength={8} className={styles.inputT}/>
                  <p>入力したパスワードと同じものを入力してください
                  </p>
                </td>
              </tr>
            </tbody>
            </table>

            <h2 className={styles.h2B}><span>身体情報</span>
            </h2>
            <p className={styles.PhyP}>基礎代謝を計算するために必要となる情報です。　身長・体重は会員登録後にマイページから登録・編集も可能です。</p>
            <table className={styles.table}>
            <tbody className={styles.PhysicalInfo}>
            <tr className={styles.tr}>
                <th className={styles.th}>
                  身長
                </th>
                <td className={styles.td}>
                  <input type="text" name="height" id="height" placeholder='158' maxLength={3} minLength={2} className={styles.inputN}/>cm
                  <p>半角数字で入力してください</p>
                </td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>
                  体重
                </th>
                <td className={styles.td}>
                  <input type="text" name="weight" id="weight" placeholder='48' maxLength={3} minLength={2} className={styles.inputN}/>kg
                  <p>半角数字で入力してください</p>
                </td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>
                  生年月日<span className={styles.span}>※</span>
                </th>
                <td className={styles.td}>
                  <input type="text" name="birthday" id="birthday" placeholder='19990625' maxLength={8} minLength={8} className={styles.inputT}/>
                  <p>半角数字8桁で入力してください</p>
                </td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>
                  性別<span className={styles.span}>※</span>
                </th>
                <td className={styles.td}>
                  <div className={styles.vertical}>
                    {/* name="gender"を設定することでどちらかしか選択できないようにする */}
                    <label htmlFor="male">
                      <input type="radio" name="gender" id="male" />男性
                    </label>
                    <label htmlFor="female">
                      <input type="radio" name="gender" id="female" />女性
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
            </table>
            <button type="submit" className={styles.btn} >登録する</button>
        </div>
      </form>
    </div>
    </>
  )
}

export default Registry
