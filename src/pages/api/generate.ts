// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/utilis/db';
import { RunResult } from 'sqlite3';

db.run('PRAGMA foreign_keys = ON;');

// sql = `INSERT INTO chatgpt_messages(date, question, answer,id_chat) VALUES (?,?,?,?)`;

// db.run('DROP TABLE chatgpt_messages');
// db.run('TRUNCATE TABLE chatgpt_messages');

// const foo = db.run
// sgl injection

// db.run(sql, ['today', 'How are you?', 'I am fine.', 2], (error: Error | null) => {
//   if (error) return console.error(error.message);
// });

// https://www.youtube.com/watch?v=ZRYn6tgnEgM

//! Flow diagram https://jamboard.google.com/d/1AId5pe99cJ6OjPzvyLe56pHQkcRxW_y6F6tXQoYmNlU/edit?usp=sharing

type ResponseData = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const chatId = req.body.id;
  const question = req.body.lastMessage.question;
  let answer;

  const body = {
    model: 'gpt-3.5-turbo',
    messages: [...req.body.messages],
    max_tokens: 50,
    format: 'markdown',
  };

  const chatRequestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  };

  try {
    const chatResponse = await fetch(`https://api.openai.com/v1/chat/completions`, chatRequestOptions);
    const chatData = await chatResponse.json();
    answer = chatData.choices[0].message.content;

    const chatMessageValues = {
      id_chat: chatId,
      question,
      answer,
    };

    const sql = `INSERT INTO chatgpt_messages(id_chat, question, answer) VALUES (?,?,?)`;

    db.run(
      sql,
      [chatMessageValues.id_chat, chatMessageValues.question, chatMessageValues.answer],
      function (this: RunResult, error: Error | null) {
        if (error) {
          res.status(500).json({ error });
        } else {
          const dbData = this;
          res.status(200).json({ dbData, chatData });
        }
      }
    );
  } catch (error) {
    res.status(400).json({ error });
  }
}
