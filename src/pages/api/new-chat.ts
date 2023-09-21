import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/utilis/db';
import { RunResult } from 'sqlite3';

const sql = `INSERT INTO chatgpt_chats(date) VALUES (?)`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    db.run(sql, [new Date()], function (this: RunResult, error: Error | null) {
      if (error) {
        res.status(500).json({ error });
      } else {
        res.status(200).json(this.lastID);
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}
