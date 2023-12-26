// import { supabase } from '@/supabase';
// import { Task } from '@/app/types/tasks'; 
// import React from 'react'
// import GetCookieId from '../cookie/GetCookieId';

// const CookieId = GetCookieId();

// async function getAllTodos(): Promise<Task[]> {
//     const { data, error} = await supabase
//     .from("todos")
//     .select("*")
//     .eq("id", CookieId)

//     if(error){
//         console.log("ユーザーデータ取得失敗")
//     }
//     if(data){
//         return data;
//     }
// }

// export default getAllTodos
