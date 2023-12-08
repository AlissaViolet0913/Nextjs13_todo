import { useCookies } from "react-cookie";

export default function GetCookieId() {
  // useCookies: Cookieの読み取りや設定、削除などの操作を簡潔に記述
  const cookies = useCookies(["id"]);
  const id = cookies[0].id;

  return id;
}
