export type ChatUser = {
  id: string | number;
  name: string;
  username: string;
  avatarUrl?: string;
};

export type ChatMessage = {
  chatId: string | number;
  content: string;
  createdAt: string;
  id: string | number;
  senderId: string | number;
};
