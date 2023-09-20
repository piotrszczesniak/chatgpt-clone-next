// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/utilis/db';

let sql = `SELECT * FROM chatgpt_chats`;

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
  try {
    // call to database

    db.run(sql); //
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error });
  }
}