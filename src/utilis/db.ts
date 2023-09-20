const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/chat-gpt.db', sqlite3.OPEN_READWRITE, (error: Error | null) => {
  if (error) return console.error(error.message);
});

export default db;
