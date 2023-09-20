import db from '@/utilis/db';

const sql = `INSERT INTO chatgpt_chats(date) VALUES (?)`;

db.run(sql, [new Date()], (error: Error | null) => {
  if (error) return console.error(error.message);
});
