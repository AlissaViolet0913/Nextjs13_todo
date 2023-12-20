"use client";

import React, { ReactNode, useEffect, useState } from 'react'
import styles from '../../styles/Registry.module.css';
import { supabase } from '@/supabase'; 
import { useForm } from "react-hook-form";
import GetCookieId from '../components/cookie/GetCookieId';
import Header from '../components/Header'


function User() {
  const [displayPassword, setDisplayPassword] = useState(false);
  const [usersMail, setUsersMail] = useState<string[]>([]);
  const [loginEmail, setLoginEmail] = useState("");
  const [userData, setUserData] = useState<any>();
  const [radio, setRadio] = useState();
  const loginId = GetCookieId();
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // ログインユーザーのEmailを取得
    const getEmail = async () => {
      const { data: userEmail } = await supabase
        .from("users")
        .select("email")
        .eq("id", loginId);
  
      if (userEmail && userEmail.length > 0) {
        const firstUser = userEmail[0];
        const email = firstUser.email;
        setLoginEmail(email);
      }
    };
  
    getEmail();

    const emailCheck = async () => {
      try {
        const { data: users, error } = await supabase.from("users").select('email');
        if (error) {
          console.log(error, "データ取得に失敗しました");
        } else {
          const mail: any[] = users.map((user) => user.email);
          setUsersMail(mail);

           // Email一覧情報からログインしているユーザーのものを削除
          const filteredMail = mail.filter((email) => email !== loginEmail);
          setUsersMail(filteredMail);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("データ取得エラー:", error.message);
        }
      }
    }
    emailCheck();
  }, [loginId, loginEmail]);

  //ReactHookFormで使用
  const {
    register,
    setValue, //手動設定
    getValues, //現在の値を取得
    handleSubmit,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
      // 変更が行われた時点でバリデーションを行う
      mode: "onChange",
  });

  // パスワードが変更されたら、passwordConfirmation のバリデーションを再評価
useEffect(() => {
  trigger("passwordConfirmation"); // 特定のフィールドのバリデーションをトリガー
}, [getValues("password"), trigger]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: user } = await supabase
          .from("users")
          .select('*')
          .eq('id', loginId)
          .single();
          
          if (user) {
          setUserData(user);
          setValue("name", user.name);
          setValue("email", user.email);
          setRadio(user.gender);
          setValue("password", user.password);
          setValue("passwordConfirmation", user.password);
          setValue("height", user.height || "");
          setValue("weight", user.weight || "");
          setValue("birthday", user.birthday);
        } else {
          console.error("User data not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", (error as any).message);
      }
    };

    fetchUserData();
  }, [loginId]);
    
  // passwordの表示・非表示
  const displayPass = () => {
    setDisplayPassword(!displayPassword);
  };
  
  // 新規会員登録
  const onSubmit = async (sendData: any) => {

        //送信するデータを成形
        delete sendData.passwordConfirmation; 
    
        // 性別選択項目
        delete sendData.passwordConfirmation;        
        if(sendData.gender === "male"){
          sendData.gender = "男性"
        } else if(sendData.gender === "female"){
          sendData.gender = "女性"
        }       

        // 身長・体重項目：未入力時
        if(sendData.height === ""){
          sendData.height = null;
        }
        if(sendData.weight === ""){
          sendData.weight = null;
        }

    // usersテーブルの情報を更新
        const { error: usersError } = await supabase
        .from('users')
        .update(sendData)
        .eq("id", loginId);

        if (usersError) {
          console.log(usersError, "insertUsersエラー");
        } else {
          window.location.reload();
        }

    };
  
  return (
    <div className={isMenuOpen ? `${styles.container}`: ""}>
          <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>

    <div className={styles.bg}>
    <form className={styles.main} onSubmit={handleSubmit(onSubmit)}>
        <h1>アカウント情報</h1>
          <h2 ><span>ユーザー情報</span>
            </h2>
          <table className={styles.table}>
            <tbody className={styles.userInfo}>
              <tr className={styles.tr}>
                <th className={styles.th}>
                  ユーザーネーム<span className={styles.span}>※</span>
                </th>
                <td className={styles.td}>
                  <input 
                  type="text"
                  id="name"
                  placeholder="健康管理"
                  className={styles.inputT}
                  onSubmit={onSubmit}
                  {...register("name", { 
                    required: "ユーザーネームは必須項目です",
                    validate: {
                    noSpace: (value) => !/\s/.test(value) || "スペース文字は使用できません",
                    noSpecialCharacters: (value) => /^[ぁ-んァ-ン一-龯a-zA-Z0-9]+$/.test(value) || "特殊文字・全角数字は使用できません",
                    },              
                    })} />
                    <p className={styles.error}>
                      {errors.name?.message as ReactNode}
                    </p>     
                </td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>
                  Email<span className={styles.span}>※</span>
                </th>
                <td className={styles.td}>
                  <input type="email"  id="email" placeholder='XXX@nurtrition.com' maxLength={256} className={styles.inputT} onSubmit={onSubmit} {...register("email", {
                          validate: {
                            mailCheck: (value) => {
                              const mailCheck = usersMail.filter(
                                (mail) => mail === value,
                              );
                              return (
                                mailCheck.length === 0 ||
                                "このメールアドレスは登録済です"
                              );
                            },
                          },
                          required: "メールアドレスは必須項目です",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                            message: "正しいメールアドレスを入力してください",
                          },
                        })}/>
                 
                    <p className={styles.error}>
                        {errors.email?.message as ReactNode}
                      </p>                  
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
                  id="password"
                  placeholder="********"
                  maxLength={16}
                  minLength={8}
                  className={styles.inputT}
                  onSubmit={onSubmit}
                  {...register("password", {
                    required: "パスワードは必須項目です",
                    minLength: {
                      value: 8,
                      message: "8文字以上で入力してください",
                    },
                    pattern: {
                      value:
                        /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]+$/,
                      message:
                        "半角英大文字、半角英小文字、数字をそれぞれ1種類以上含んでください",
                    },
                  })}
                />
              ) : (
                <input
                  type="password"
                  id="password"
                  placeholder="********"
                  maxLength={16}
                  minLength={8}
                  className={styles.inputT}
                  onSubmit={onSubmit}
                  {...register("password", {
                    required: "パスワードは必須項目です",
                    minLength: {
                      value: 8,
                      message: "8文字以上で入力してください",
                    },
                    pattern: {
                      value:
                        /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]+$/,
                      message:
                        "半角英大文字、半角英小文字、数字をそれぞれ1文字以上含んでください",
                    },
                  })}
                />
              )}
               {displayPassword ? (
                <img src="../invisible.png" alt="非表示" className={styles.passwordVisible} onClick={displayPass}/>
              ) : (
                <img src="../visible.png" alt="表示" className={styles.passwordVisible} onClick={displayPass}/>
              )}                  
                  <p>半角英大文字・小文字、数字をそれぞれ1文字以上含めて8文字以上16字以内で設定してください</p>
                  <p className={styles.error}>
                        {errors.password?.message as ReactNode}
                      </p>
                </td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>
                確認パスワード<span className={styles.span}>※</span>
                </th>
                <td className={styles.td}>
                  <input type="password" id="passwordConfirmation" placeholder='********' maxLength={16} minLength={8} className={styles.inputT}  {...register("passwordConfirmation", {
                    required: "確認パスワードは必須項目です",
                    validate: {
                      matchesPreviousPassword: (value) =>
                      value === getValues("password") || "パスワードと一致しません",
                    },
                    })}/>
                  <p>入力したパスワードと同じものを入力してください
                  </p>
                  <p className={styles.error}>
                        {errors.passwordConfirmation?.message as ReactNode}
                  </p>
                </td>
              </tr>
            </tbody>
            </table>

            <h2 className={styles.h2B}><span>身体情報</span>
            </h2>
            <p className={styles.PhyP}>基礎代謝を計算するために必要となる情報です。</p>
            <table className={styles.table}>
            <tbody className={styles.PhysicalInfo}>
            <tr className={styles.tr}>
                <th className={styles.th}>
                  身長
                </th>
                <td className={styles.td}>
                  <input
                  type="text"
                  id="height"
                  placeholder='158'
                  maxLength={3}
                  minLength={2}
                  className={styles.inputN}
                  {...register("height", { 
                    pattern: {
                      value: /^[0-9]*$/, 
                      message: "半角数字で入力してください"},
                  })}
                  />cm
                  <p>半角数字で入力してください</p>
                  <p className={styles.error}>
                        {errors.height?.message as ReactNode}
                  </p>
                </td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>
                  体重
                </th>
                <td className={styles.td}>
                  <input
                  type="text"
                  id="weight"
                  placeholder='48'
                  maxLength={3}
                  minLength={2}
                  className={styles.inputN}
                  {...register("weight", { 
                    pattern: {
                      value: /^[0-9]*$/, 
                      message: "半角数字で入力してください"}  
                  })}
                  />kg
                  <p>半角数字で入力してください</p>
                  <p className={styles.error}>
                        {errors.weight?.message as ReactNode}
                  </p>
                </td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>
                  生年月日<span className={styles.span}>※</span>
                </th>
                <td className={styles.td}>
                  <input 
                  type="text"  
                  disabled
                  id="birthday" 
                  placeholder='19990625'
                  maxLength={8} 
                  minLength={8} 
                  className={styles.inputT} 
                  onSubmit={onSubmit}
                  {...register("birthday", {})}/>
                  <p>⚠️変更できません</p>
                  <p className={styles.error}>
                  {errors.birthday?.message as ReactNode}

                  </p>
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
                      <input
                      type="radio"
                      disabled 
                      id="male"
                      value="male"
                      {...register("gender", {})} 
                      checked={radio === '男性'}                      />男性
                    </label>
                    <label htmlFor="female">
                      <input 
                      type="radio" 
                      disabled 
                      id="female" 
                      value="female" {...register("gender", {})}
                      checked={radio === '女性'}                      />女性
                    </label>
                  </div>
                  <p>⚠️変更できません</p>
                </td>
              </tr>
            </tbody>
            </table>
            <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`${styles.btn} ${(!isValid || isSubmitting) ? styles.disableBtn : ""}`}>
              編集完了
            </button>
      </form>
    </div>
    </div>
  )
}

export default User
