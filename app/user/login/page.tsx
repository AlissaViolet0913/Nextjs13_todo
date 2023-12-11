"use client";

import { useRouter } from 'next/navigation';
import styles from "../../../styles/Login.module.css"
import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/supabase'; 
// import { supabase } from '@/app/api/supabase';
import { useForm } from 'react-hook-form';


function Login() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    // 変更が行われた時点でバリデーションを行う
    mode: "onChange",
  });
  

  const LoginHandler = async (sendData: any) => {    
    const email = sendData.email;
    const password = sendData.password;

    try {
      const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password);
      
      if(error){
        console.log("情報取得エラー", error.message);
        return null;
      }
         
      if(data && data.length > 0){
        const userId = data[0].id;

        // Cookieの有効期限1日
        // 現在の日時を表す新しいDateオブジェクトを作成
        const expirationDate = new Date();
        // 現在の日時から1日進める
        expirationDate.setDate(expirationDate.getDate() + 1);

        // Cookie設定
        document.cookie = `id=${userId};  expires=${expirationDate.toUTCString()}; path=/`;
        document.cookie = `loginSt=true;  expires=${expirationDate.toUTCString()}; path=/`;

        router.push("/")

      }else{
        // ユーザーが見つからなかった場合
        setVisible(true);
        document.cookie =
          "loginSt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    } catch (error) {
    console.log("エラー:", error);
    }
}

  return (
    <div className={styles.main}>
      <div className={styles.centeredContent}>
        <img src="../logo.png" alt="img" className={styles.logo}/>
        </div>
        <form className={styles.flex} onSubmit={handleSubmit(LoginHandler)}>
          <div className={styles.flex2}>
            <span className={styles.span}>USERNAME</span>
            <div className={styles.coverdInput}>
              <input
              type="email"
              className={styles.input}
              placeholder="ログインID（登録メールアドレス）"
              maxLength={250}
              {...register("email", { 
                required: "入力して下さい",
                pattern: {
                  value:
                    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                  message: "正しいメールアドレスを入力してください",
                },
              })}
              />
            </div>
              <p className={styles.error}>
                 {errors.email?.message as ReactNode}
              </p>
          </div>
          <div className={styles.flex2}>
            <span className={styles.span}>PASSWORD</span>
            <div className={styles.coverdInput}>
              <input
              type="password"
              className={styles.input}
              placeholder="パスワード"
              maxLength={16}
              {...register("password",{
                required: "入力して下さい",
                pattern: { 
                  value: /.{8,16}/,
                  message: "8文字以上16文字以下で入力してください"
                }

              })}
              />
            </div>
              <p className={styles.error}>
                 {errors.password?.message as ReactNode}
              </p>
          </div>
          <div className={styles.centeredButton}>
            <button
            disabled={!isValid || isSubmitting}
            className={styles.btn}
            type="submit"
            >SIGN IN</button>
          </div>
            <p
            className={styles.error}
            style={{ display: visible ? "block" : "none" }}
            >ユーザーが見つかりませんもう一度入力してください
            </p>
            {
              (!isValid || isSubmitting) ?
              <p className={styles.error}>
                未入力項目があります、全て入力してください
              </p>
              :""
            }
          <div className={styles.linkBox}>
          <Link href="/user/registry" className={styles.link}>
            ＞新規ユーザー登録
          </Link>
        </div>
      </form>
 
  </div>  
  )
}

export default Login
