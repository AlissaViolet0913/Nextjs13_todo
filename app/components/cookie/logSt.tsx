import { useEffect } from "react";
import { useCookies } from "react-cookie";
import CheckLoginSt from "./checkLoginSt";
import { useRouter } from "next/router";

export default function LogSt() {
  const [loginStatus] = useCookies(["loginSt"]);
  const router = useRouter();

  // 未ログイン時、ログイン画面にリダイレクト
  useEffect(() => {
    CheckLoginSt({ loginStatus, router });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
