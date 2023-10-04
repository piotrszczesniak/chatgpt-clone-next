import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.scss';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Box, Container, Grid, Paper, TextField, styled } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Message from '@/components/Message';
import { SingleChatType, HistoryType, SingleMessageType, LastMessageType } from '@/utilis/types';

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
  const [inputValue, setInputValue] = useState<string>('');
  const [messages, setMessages] = useState<SingleMessageType[] | []>([]);
  const [chatHistory, setChatHistory] = useState<[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lastMessage, setLastMessage] = useState<LastMessageType | null>({
    question: '',
    answer: '',
  });

  /**
   * @task -> save last question and answer to db
   * //- save last question in state in FE
   * //- send it to BE
   * //- send it to chatgpt
   * //- get answer from chatgpt
   * //- get chat_id from database //! how to wait for it before making a call to db?
   * //- send question and answer to db
   * //- send question and answer to BE
   * //- send question and answer to FR
   */

  // input changes
  function handleValueChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  // request to /api/generate/
  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let id = currentChatId;
    if (messages.length === 0 && !currentChatId) {
      id = await startNewChat();
    }

    setLastMessage({ question: inputValue, answer: '' });
    setMessages([...messages, { role: 'user', content: inputValue }]);

    if (id) {
      sendMessagesForChat(id);
    }
  }

  async function sendMessagesForChat(id: number) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        lastMessage: { question: inputValue, answer: '' },
        messages: [...messages, { role: 'user', content: inputValue }],
      }),
    };

    try {
      const response = await fetch(`http://localhost:3000/api/generate`, requestOptions);
      const data = await response.json();

      setMessages((currentMessages) => [...currentMessages, data?.chatData?.choices[0]?.message]);
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  }

  function handleNewChat() {
    if (messages.length === 0 && currentChatId !== null) {
      alert('Please add content to the current chat before starting a new one.');
      return;
    }
    setCurrentChatId(null);
    setMessages([]);
    startNewChat();
    inputRef?.current?.focus();
  }

  // request to /api/new-chat
  async function startNewChat() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch('http://localhost:3000/api/new-chat', requestOptions);
      const data = await response.json();
      setCurrentChatId(data.lastID);
      getChatHistory();
      return data.lastID;
    } catch (error: unknown) {
      console.error(error);
      // return false;
    }
  }

  async function handleDeleteSingleChat(id: number) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId: id }),
    };

    try {
      const response = await fetch(`http://localhost:3000/api/delete-chat`, requestOptions);
      const data = await response.json();
      setCurrentChatId(null);
      setMessages([]);
      setLastMessage(null);
      getChatHistory();
    } catch (error: unknown) {
      console.error(error);
    }
  }

  // request to /api/chat
  function handleShowSingleChat(id: number) {
    setCurrentChatId(id);
    getSingleChat(id);
  }

  async function getSingleChat(id: number) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId: id }),
    };
    try {
      const response = await fetch('http://localhost:3000/api/chat', requestOptions);
      const data = await response.json();

      const mappedData = data.map((item: any /* temporaty type */) => [
        { role: 'user', content: item?.question },
        { role: 'assistant', content: item?.answer },
      ]);

      setMessages(mappedData.flat());
    } catch (error: unknown) {
      console.error(error);
    }
  }

  async function getChatHistory() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch('http://localhost:3000/api/history', requestOptions);
      const data = await response.json();
      setChatHistory(data.reverse());
    } catch (error: unknown) {
      console.error(error);
    }
  }

  // ! Console Logs
  console.log('currentChatId', currentChatId);
  console.log('messages lenght', messages.length);
  console.log('lastMessage', lastMessage);
  console.log('chatHistory', chatHistory);

  useEffect(() => {
    getChatHistory();
    inputRef?.current?.focus();
  }, []);

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
            <Button
              sx={{
                marginBottom: '0.5rem',
              }}
              onClick={handleNewChat}
              className={styles.button}
              color='info'
              fullWidth
              variant='outlined'
              startIcon={<AddIcon />}
            >
              new chat
            </Button>

            {chatHistory.length === 0 ? (
              <div>
                <p>No previouse chats</p>
              </div>
            ) : (
              chatHistory?.map((item: { id: number; date: string }, index: number) => {
                const date = new Date(item.date);
                return (
                  <Button
                    data-chat-id={item?.id}
                    // disabled={item.id === currentChatId}
                    key={index}
                    sx={{
                      boxShadow: item.id === currentChatId ? '0 0 10px 1px grey' : '',
                      marginBottom: '0.5rem',
                      position: 'relative',
                    }}
                    onClick={() => handleShowSingleChat(item?.id)}
                    className={styles.button}
                    color='info'
                    fullWidth
                    variant='outlined'
                    startIcon={<ChatIcon />}
                    // endIcon={}
                  >
                    Chat from {date.toLocaleDateString()}
                    {currentChatId === item.id && (
                      <DeleteOutlineIcon
                        onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                          e.stopPropagation();
                          handleDeleteSingleChat(item?.id);
                        }}
                        sx={{
                          position: 'absolute',
                          right: '8px',
                          zIndex: 1,
                        }}
                      />
                    )}
                  </Button>
                );
              })
            )}
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
            >
              <Box className='messages' sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages?.map((message, index) => {
                  return <Message message={message} key={index} />;
                })}
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
                  onSubmit={handleFormSubmit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    position: 'relative',
                  }}
                >
                  <TextField
                    // autoFocus={true} /* MUI read about it */
                    value={inputValue}
                    placeholder='Type a new message'
                    onChange={handleValueChange}
                    fullWidth
                    variant='outlined'
                    inputRef={inputRef}
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
