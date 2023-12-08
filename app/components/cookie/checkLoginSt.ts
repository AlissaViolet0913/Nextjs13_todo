
function checkLoginSt({loginStatus, router}:{loginStatus: any, router:any}) {
  const st = loginStatus.loginSt;

    if (!st) {
      router.push("/user/login");
    }  
    return null;
}

export default checkLoginSt
