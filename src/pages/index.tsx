import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.scss';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, TextField, styled } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Message from '@/components/Message';
import { ChatType, HistoryType, MessageType } from '@/utilis/types';

const inter = Inter({ subsets: ['latin'] });

// https://www.youtube.com/watch?v=uRQH2CFvedY

// PRAGMA foreign_keys = ON;

// TODO:
//  * sqlite3 // npm
//  * mysql: insert, select (where from), delete
//  * front <---> backend <---> baza
//  * https://sqlitebrowser.org/
//  * sqlite3 orm node

export default function Home() {
  const [value, setValue] = useState<string>('');

  const [messages, setMessages] = useState<MessageType[] | []>([]);

  const [chat, setChat] = useState<ChatType | null>(null);

  const [history, setHistory] = useState<HistoryType | null>(null);

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleMessagesSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chat) {
      setMessages([...messages, { role: 'user', content: value }]);
      setChat({ id: chat.id, conversation: [...messages, { role: 'user', content: value }] });
      fetchData();
    } else {
    }
  };

  const handleNewChat = () => {
    if (chat) {
      //
    }

    setChat({ id: Math.floor(Math.random() * 1000), conversation: [] });
    setMessages([]);
  };

  const fetchData = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [...messages, { role: 'user', content: value }],
      }),
    };

    try {
      const response = await fetch(`http://localhost:3000/api/generate`, requestOptions);
      const data = await response.json();
      // console.log(data);
      setMessages((currentMessages) => [...currentMessages, data.choices[0].message]);

      setValue('');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // ! what if i change setChat after messages change?
    if (chat?.id) {
      setChat({ id: chat?.id, conversation: [...messages] });
    }
  }, [messages, chat?.id]);

  console.log(`chats:`, chat);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Box sx={{ flexGrow: 1, height: '100vh' }}>
        <Grid container sx={{ height: '100%' }}>
          <Grid
            className='sidebar'
            item
            xs={3}
            sx={{
              padding: '1rem',
              backgroundColor: '#444c56',
            }}
          >
            <Button onClick={handleNewChat} className={styles.button} color='info' fullWidth variant='outlined' startIcon={<AddIcon />}>
              new chat
            </Button>

            <nav>chat history</nav>
          </Grid>
          <Grid
            className='content'
            item
            xs={9}
            sx={{
              padding: '1rem',
              backgroundColor: '#2d333b',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '2rem',
              height: '100vh',
            }}
          >
            <Container
              maxWidth='md'
              sx={{
                height: '90%',
                overflowY: 'scroll',

                scrollbarWidth: 'thin', // For Firefox
                '&::-webkit-scrollbar': {
                  width: '0.5rem',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'lightgray',
                  borderRadius: '6px',
                },
              }}
              style={{}}
            >
              <Box className='messages' sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((message, index) => (
                  <Message message={message} key={index} />
                ))}
              </Box>
            </Container>
            <Container
              maxWidth='md'
              sx={{
                height: '10%',
              }}
            >
              <Box>
                <form
                  onSubmit={handleMessagesSend}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    position: 'relative',
                  }}
                >
                  <TextField
                    value={value}
                    placeholder='Type a new message'
                    onChange={handleValueChange}
                    fullWidth
                    variant='outlined'
                    sx={{
                      input: {
                        color: 'white',
                      },
                      boxShadow: '0 0 20px 20px #444c56',
                    }}
                  />
                  <Button
                    variant='outlined'
                    size='large'
                    type='submit'
                    endIcon={<SendIcon sx={{ padding: '0', margin: '0' }} />}
                    sx={{
                      height: '100%',
                      position: 'absolute',
                      border: 'none',
                      background: 'transparent',
                      '&:hover': {
                        border: 'none',
                        background: 'transparent',
                      },
                      right: 0,
                    }}
                  />
                </form>
              </Box>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
