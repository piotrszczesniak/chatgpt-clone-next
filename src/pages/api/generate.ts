// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
const sqlite3 = require('sqlite3').verbose();
let sql;

const db = new sqlite3.Database('./chat-gpt.db', sqlite3.OPEN_READWRITE, (error: any) => {
  if (error) return console.log(error.message);
});

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
