// ファイル名の先頭に「＿」をつけることで、ルートを生成しない。

import Link from 'next/link'
import { useRouter } from 'next/router'
 
const CustomErrorPage = () => {
 const router = useRouter()
 
 return (
   <>
     <div>{router.asPath} ページは存在しません</div>
     <Link href="/">ホームに戻る</Link>
   </>
 )
}
 
export default CustomErrorPage
