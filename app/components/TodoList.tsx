"use client"
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/Todo.module.css"
import { supabase } from '@/supabase'
import { Todo } from '../types/types'
import { userId } from '../types/types'

  const TodoList: React.FC<userId> = ({ userId }) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    
    useEffect(()=>{
        const fetchTodos = async()=>{
            const { data, error} = await supabase
            .from("todos")
            .select("*")
            .eq("userId", userId)
        
            if(error){
                console.log("ユーザーデータ取得失敗")
            }else{
                setTodos(data);
            }
        }
    
        fetchTodos();
      },[])

      const deleteHandler = async (id: string) => {
        const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id);
    
        if (error) {
          console.error("データ削除に失敗しました", error);
        } else {
          // 削除成功時にローカルのstateも更新
          setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        }
      };
      


  return (
    <ul>
         {todos.map((todo) => (
        <li key={todo.id} className={styles.li}>
          <span>{todo.todo}</span>
          <div>
            <button 
            className={styles.delete}
            onClick={() => deleteHandler(todo.id)} //大切         
            >
                Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default TodoList
