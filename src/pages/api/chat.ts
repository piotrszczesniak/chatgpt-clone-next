import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/utilis/db';

type ResponseData = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sql = `SELECT * FROM chatgpt_messages WHERE id_chat = ?`;
  const chatId = req.body.chatId;

  try {
    db.all(sql, [chatId], (error: Error | null, rows: unknown) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const data = rows;
        console.log('data from the database ----', data);
        res.status(200).json(data);
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}
