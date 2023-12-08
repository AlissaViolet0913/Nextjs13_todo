// 「e」イベントハンドラはクライアントコンポーネントに変換する必要あり
"use client"
import React, { useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

function Contact() {

  const nameRef = useRef<HTMLInputElement>(null); //<>:ジェネリクス型（型の変数）HTMLInputElement:タグの属性
  const emailRef = useRef<HTMLInputElement>(null); 
  const messageRef = useRef<HTMLTextAreaElement>(null); 

  // 型は大体hoverすれば分かる
  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    // ?: null回避
    // 初期値nullに設定しているが、nullだとエラーになってしまうため、値が入ってきたときだけ読み込む設定にする
    // console.log(nameRef.current?.value);

    let data = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      message: messageRef.current?.value,
    }

    await fetch("/api", {
      method: "POST",
      headers:{
        Accept: "application/json, text/plain",
        "Content-Type" : "application/json"
      },
      // 何を送るのか
      // JSON化して渡す、ただの文字列だから軽量化できる

      body: JSON.stringify(data),
    }).then((res)=>{
      if(res.status === 200) console.log("メール送信完了")
    })
  }

  return (
    <>
    <div className="container mt-5">
      <h2 className="mb-3">WORK OUT管理アプリ 【お問い合わせフォーム】</h2>
      <form 
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
      >
        <div className="mb-3">
          <label htmlFor="name" className='form-label'>
            お名前
          </label>
          <input
          type="text"
          id="name"
          className='form-control'
          required
          ref={nameRef}/>
        </div>
        <div className="mb-3">
          <label htmlFor="name" className='form-label'>
            Email
          </label>
          <input
          type="email"
          id="email" className='form-control'
          required
          ref={emailRef}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className='form-label'>
            お問い合わせ内容
          </label>
          <textarea 
          name='message'
          id="message"
          className='form-control'
          required
          ref={messageRef}
          />
        </div>
        <button type='submit' className='btn btn-danger'>メールを送信</button>
      </form>
    </div>
    </>
  )
}

export default Contact
