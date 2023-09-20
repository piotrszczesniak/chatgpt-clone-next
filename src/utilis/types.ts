export type MessageType = {
  role: 'user' | 'assistant' | null;
  content: string | null;
};

export type ChatType = {
  id: number | null;
  conversation: MessageType[] | null;
};

export type HistoryType = {
  records: ChatType[];
};
