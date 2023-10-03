import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/utilis/db';

db.run('PRAGMA foreign_keys = ON;');

// db.run('DROP TABLE chatgpt_messages');
// db.run('TRUNCATE TABLE chatgpt_messages');

// const foo = db.run
// sgl injection

// https://www.youtube.com/watch?v=ZRYn6tgnEgM

//! Flow diagram https://jamboard.google.com/d/1AId5pe99cJ6OjPzvyLe56pHQkcRxW_y6F6tXQoYmNlU/edit?usp=sharing

type ResponseData = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sql = `SELECT * FROM chatgpt_chats`;

  try {
    db.all(sql, [], (error: Error | null, rows: unknown) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        const data = rows;
        res.status(200).json(data);
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}
