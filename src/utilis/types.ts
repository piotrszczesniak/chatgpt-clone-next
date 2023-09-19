export type MessageType = {
  role: 'user' | 'assistant' | null;
  content: string | null;
};

export type ChatType = {
  id: number;
  conversation: MessageType[];
};

export type HistoryType = {
  records: ChatType[];
};
