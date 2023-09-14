import { MessageType } from '@/utilis/types';
import { Box, Paper } from '@mui/material';
import Image from 'next/image';

type MessageProps = {
  message: MessageType;
};

const Message = ({ message }: MessageProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '0.5rem',
        backgroundColor: 'white',
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
          backgroundColor: message.role === 'user' ? 'white' : '#19c37d',
        }}
      />
      <Paper elevation={4} sx={{ padding: '0.5rem', position: 'relative' }}>
        {message.content}
      </Paper>
    </Box>
  );
};

export default Message;
