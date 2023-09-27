// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/utilis/db';

let sql;

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
  // if (req.body.id !== null) {
  // logic to call db, create new chat id and return it
  console.log('---- id ', req.body.id);
  // const data = { id: 1 };
  // res.status(200).json(data);
  // make db call to get chat IT
  // } else {
  // make API call to /chat/completions

  const body = {
    model: 'gpt-3.5-turbo',
    messages: [...req.body.messages],
    max_tokens: 50,
    format: 'markdown',
  };

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },

    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, requestOptions);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error });
  }
}
// }
