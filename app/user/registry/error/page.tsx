"use client";

import Link from 'next/link'
import styles from "../../../../styles/Registry.module.css"

function FailureCreateUser() {

    return (
      <>
      <div className={styles.errorMain}>
        <div> データ送信に失敗しました。再度会員登録を行ってください。</div>
        <div>
          <Link href="/user/registry">新規会員登録ページに戻る</Link>
        </div>
      </div>
      </>
    )
   
}

export default FailureCreateUser
