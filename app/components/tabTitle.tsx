
import { Head } from 'next/document'
import React from 'react'

function TabTitle({ title }: { title: string }) {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  )
}

export default TabTitle
