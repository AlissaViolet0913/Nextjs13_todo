"use client";

import React, { ReactNode, useEffect, useState } from 'react'
import styles from '../../../styles/Registry.module.css';
import { supabase } from "../../api/supabase.js"
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'; //import元が変わった


function Registry() {
  const [displayPassword, setDisplayPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [usersMail, setUsersMail] = useState<string[]>([]);
  const router = useRouter();

  

  useEffect(() => {
    const emailCheck = async () => {
      try {
        const { data: users, error } = await supabase.from("users").select('email');
        if (error) {
          console.log(error, "データ取得に失敗しました");
        } else {
          const mail: any[] = users.map((user) => user.email);
          setUsersMail(mail);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("データ取得エラー:", error.message);
        }
      }
    }
    emailCheck();
  }, []); 
  
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    // 変更が行われた時点でバリデーションを行う
    mode: "onChange",
  });

  // passwordの表示・非表示
  const displayPass = () => {
    setDisplayPassword(!displayPassword);
  };
  
  // 新規会員登録
  const onSubmit = async (sendData: any) => { 

        //送信するデータを成形
        delete sendData.passwordConfirmation;        
        if(sendData.gender === "male"){
          sendData.gender = "男性"
        } else if(sendData.gender === "female"){
          sendData.gender = "女性"
        }

        const { data: users, error } = await supabase.from("users").select('email');
        if (error) {
          console.log(error, "データ取得に失敗しました");
        } else {
           const mail: any[] = users.map((user) => user.email);
           if(mail.includes(sendData.email)){
             // 入力時にはメアド重複なく送信時に重複した場合、エラー画面へ遷移させる
            router.push('./error');
          } else {
            // usersテーブルに追加
            const { error: registrationError } = await supabase.from("users").insert(sendData);
            if (registrationError) {
              console.log(registrationError, "insertエラー");
            } else {
              console.log("データ登録完了")
            }
           }
        }
  };
  

  return (
    <>
    <div className={styles.bg}>
    <form className={styles.main} onSubmit={handleSubmit(onSubmit)}>
        <h1>会員登録</h1>
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
                  <input type="text" id="name" placeholder="健康管理" className={styles.inputT} onSubmit={onSubmit}
                  {...register("name", { 
                    required: "ユーザーネームは必須項目です",
                    validate: {
                    noSpace: (value) => !/\s/.test(value) || "スペース文字は使用できません",
                    noSpecialCharacters: (value) => /^[ぁ-んァ-ン一-龯a-zA-Z0-9]+$/.test(value) || "特殊文字は使用できません",
                    }, })} />
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
              {/* <button id="btn_passview" onClick={displayPass}>表示</button> */}
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
                  <input type="text"  id="birthday" placeholder='19990625' maxLength={8} minLength={8} className={styles.inputT} onSubmit={onSubmit}
                  {...register("birthday", {
                    required: "生年月日は必須項目です",
                    minLength: {
                      value: 8,
                      message: "8桁以上で入力してください",
                    },
                    pattern: {
                      value: /^[0-9]{8}$/,
                      message:
                        "半角数字で入力してください",
                    },
                  })}/>
                  <p>半角数字8桁で入力してください</p>
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
                      <input type="radio" id="male" value="male" {...register("gender", {})} />男性
                    </label>
                    <label htmlFor="female">
                      <input type="radio" id="female" value="female" {...register("gender", {})}/>女性
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
            </table>
            <button
            type="submit"
            // isSubmitting: フォーム送信が完了するまでの間trueになる
            // 送信中の状態でボタンを無効化 
            // registerが設定されているところに検証エラーがなければ！isValidがfalseになり表示される。
            disabled={!isValid || isSubmitting}
            className={`${styles.btn} ${(!isValid || isSubmitting) ? styles.disableBtn : ""}`}>
              登録する
            </button>
            {
              (!isValid || isSubmitting) ?
              <p className={styles.error}>
                未入力項目があります、全て入力してください。
              </p>
              :""
            }
      </form>
    </div>
    </>
  )
}

export default Registry
