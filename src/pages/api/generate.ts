// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
const sqlite3 = require('sqlite3').verbose();
let sql;

const db = new sqlite3.Database('./db/chat-gpt.db', sqlite3.OPEN_READWRITE, (error: Error | null) => {
  if (error) return console.error(error.message);
});

// sql = `INSERT INTO chatgpt_messages(date, question, answer,id_chat) VALUES (?,?,?,?)`;

// db.run('DROP TABLE chatgpt_messages');

// db.run(sql, ['today', 'How are you?', 'I am fine.', 2], (error: Error | null) => {
//   if (error) return console.error(error.message);
// });

// https://www.youtube.com/watch?v=ZRYn6tgnEgM

type ResponseData = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('running...');
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [...req.body.messages],
    max_tokens: 100,
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
    // createChatCompletion
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, requestOptions);

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error });
  }
}
