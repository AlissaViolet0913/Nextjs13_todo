// APIの設定、バックエンド側になる
import { NextRequest, NextResponse } from "next/server";
// const nodemailer = require('nodemailer');
import nodemailer from "nodemailer";
import getStream from 'get-stream';

export async function POST (req: NextRequest, res: NextResponse){

    // req.bodyが存在するかどうかを確認する
    if (!req.body) {
        return NextResponse.json({ message: "Success: email was sent" }, {status: 400})
    }

// 画面で JSON.stringify(data) を使って送信されるデータは、
// クライアント側で JSON 形式の文字列に変換しても、
// そのデータがサーバーサイドに送信されると、
// サーバーサイドで受け取ったデータは ReadableStream オブジェクトとして扱われる。
// ⇒サーバーサイドでこのデータを扱うには、
// 1, get-stream を用いて ReadableStream を文字列に変換
// 2, JSON.parse を使って JavaScript オブジェクトに変換

   // ReadableStreamを文字列に変換
   const requestBody = await getStream(req.body);
   // 文字列からJSONをパース
   const requestData = JSON.parse(requestBody);


    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth:{
            user: process.env.GMAILUSER,
            pass: process.env.GMAILPASSWORD,
        },
    })

try{
    // 管理人が受け取るメール
    const toHostMailData = {
        from: requestData.email,
            to: "youlifengcun@gmail.com",
            subject: `[お問い合わせ] ${requestData.name}様より`,
            text: `${requestData.message} Send from ${requestData.email}`,
            html: `
            <p>【名前】</p>
            <p>${requestData.name}</p>
            <p>【お問い合わせ内容】</p>
            <p>${requestData.message}</p>
            <p>【Email】</p>
            <p>${requestData.email}</p>
            `,
    };

    transporter.sendMail(toHostMailData, function(err: any, info: any){
        if(err)console.log(err);
        else console.log(info)
    });

    return NextResponse.json({ message: "Success: email was sent" })
} catch (error) {
    console.log(error)
        return NextResponse.json({ message: "COULD NOT SENT MAIL" }, {status: 500})
    
}
}
