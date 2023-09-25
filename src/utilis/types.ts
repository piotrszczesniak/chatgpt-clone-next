export type SingleMessageType = {
  role: 'user' | 'assistant' | null;
  content: string | null;
};

export type SingleChatType = {
  id: number | null;
  conversation: SingleMessageType[] | null;
};

export type HistoryType = {
  records: SingleChatType[];
};
