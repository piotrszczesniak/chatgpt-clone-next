import { SingleMessageType } from '@/utilis/types';
import { Box, Paper } from '@mui/material';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MessageProps = {
  message: SingleMessageType;
};

const Message = ({ message }: MessageProps) => {
  return (
    <Box
      className='message'
      sx={{
        display: 'flex',
        gap: '0.5rem',

        justifyContent: message.role === 'user' ? 'flex-start' : 'flex-end',
      }}
    >
      <Image
        src={message.role === 'user' ? '/user.webp' : '/assistant.svg'}
        alt={''}
        width={32}
        height={32}
        style={{
          order: message.role === 'user' ? '0' : '1',
          color: 'white',
          borderRadius: '50%',
          backgroundColor: message.role === 'user' ? 'white' : 'white',
        }}
      />
      <Paper
        elevation={4}
        sx={{
          padding: '0.5rem',
          position: 'relative',
          boxShadow: '0 0 10px 5px #444c56',
        }}
      >
        <ReactMarkdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>{message.content || ''}</ReactMarkdown>
      </Paper>
    </Box>
  );
};

export default Message;
