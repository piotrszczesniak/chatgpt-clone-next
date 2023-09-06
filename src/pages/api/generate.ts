// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: req.body.message,
      },
    ],
    max_tokens: 20,
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
