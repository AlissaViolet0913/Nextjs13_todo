
import React, { ChangeEvent, FormEvent, useState } from 'react'
import styles from "../../styles/Todo.module.css"
import { supabase } from '@/supabase';
import { userId } from '../types/types';


const AddTask: React.FC<userId> = ({userId}) => {

    const [newTaskValue, setNewTaskValue] = useState<string>("");
  
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault(); // デフォルトのフォーム送信を防ぐ

      const sendData = {
        todo: newTaskValue,
        userId: userId
      }

      const {error} = await supabase
      .from("todos")
      .insert(sendData)
      
      if(error){
        console.error("データ送信に失敗しました")
      }
      setNewTaskValue("")

      window.location.reload();
    };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setNewTaskValue(e.target.value)
        }
        value={newTaskValue}
        />
        <button className={styles.button}>Add Task</button>
    </form >
  )
}

export default AddTask
