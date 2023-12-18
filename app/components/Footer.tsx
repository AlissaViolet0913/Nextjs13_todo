import React from 'react'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'

function Footer() {
  return (
    <div>
       <footer className={styles.footer}>
           WOIRK OUT管理{' '}
          <span className={styles.logo}>
            <Image src="/logo.png" alt="Logo" width={50} height={50} />
          </span>
      </footer>
    </div>
  )
}

export default Footer
