import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/utilis/db';

db.run('PRAGMA foreign_keys = ON;');

type ResponseData = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sql = `DELETE FROM chatgpt_chats WHERE id = ?`;
  const chatId = req.body.chatId;

  try {
    db.all(sql, [chatId], (error: Error | null, rows: unknown) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const data = rows;
        res.status(200).json(data);
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}
