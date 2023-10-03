import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/utilis/db';
import { RunResult } from 'sqlite3';

db.run('PRAGMA foreign_keys = ON;');

const sql = `INSERT INTO chatgpt_chats(date) VALUES (?)`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('new chat endpoint gets hit');
  try {
    const timestamp = new Date();

    db.run(sql, [timestamp.toString()], function (this: RunResult, error: Error | null) {
      if (error) {
        res.status(500).json({ error });
      } else {
        const data = this;
        res.status(200).json(data);
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}
