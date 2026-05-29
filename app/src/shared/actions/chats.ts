import type { Ref } from "vue";

import { idEquals } from "../idUtils";
import type { ChatMessage } from "../../types/chat";
import type { UserChat } from "../../types/users";
import type { MutationFeedbackHandler } from "./feedback";

export interface SendMessageSnapshot {
  chatId: string | number;
  previousMessages?: ChatMessage[];
}

export function createSendMessageSnapshot(
  messages: ChatMessage[],
  chatId: string | number,
): SendMessageSnapshot {
  return { chatId, previousMessages: messages ? [...messages] : undefined };
}

export function applyOptimisticSendMessage(
  messages: ChatMessage[],
  msg: ChatMessage,
) {
  const snapshot = createSendMessageSnapshot(messages, msg.chatId ?? "");
  messages.push(msg);
  return snapshot;
}

export function rollbackSendMessage(
  messages: ChatMessage[],
  snapshot: SendMessageSnapshot | null,
) {
  if (!snapshot) return;
  // restore previous messages
  if (snapshot.previousMessages) {
    messages.splice(0, messages.length, ...snapshot.previousMessages);
  } else {
    messages.splice(0, messages.length);
  }
}

export interface SendMessageOptions {
  messages: Ref<ChatMessage[]>;
  message: ChatMessage;
  onRequest: (chatId: string | number, content: string) => Promise<ChatMessage>;
  onFeedback?: MutationFeedbackHandler;
}

export async function runSendMessage({
  messages,
  message,
  onRequest,
  onFeedback,
}: SendMessageOptions) {
  const snapshot = applyOptimisticSendMessage(messages.value, message);

  try {
    const serverMsg = await onRequest(message.chatId ?? "", message.content);
    const idx = messages.value.findIndex((m) => {
      if (typeof m.id === "string" && (m.id as string).startsWith("temp-"))
        return true;
      return m.id === serverMsg.id;
    });
    if (idx >= 0) messages.value[idx] = serverMsg;
    onFeedback?.({ kind: "success", title: "Message sent" });
  } catch (error) {
    rollbackSendMessage(messages.value, snapshot);
    onFeedback?.({ kind: "error", title: "Could not send message", error });
    throw error;
  }
}

export interface CreateChatSnapshot {
  previousChats?: UserChat[];
}

export function applyOptimisticCreateChat(chats: UserChat[], chat: UserChat) {
  const snapshot: CreateChatSnapshot = { previousChats: [...chats] };
  chats.push(chat);
  return snapshot;
}

export function rollbackCreateChat(
  chats: UserChat[],
  snapshot: CreateChatSnapshot | null,
) {
  if (!snapshot) return;
  chats.splice(0, chats.length, ...snapshot.previousChats!);
}

export interface CreateChatOptions {
  chats: Ref<UserChat[]>;
  chat: UserChat;
  onRequest: (userId: string | number) => Promise<UserChat>;
  onFeedback?: MutationFeedbackHandler;
}

export async function runCreateChat({
  chats,
  chat,
  onRequest,
  onFeedback,
}: CreateChatOptions) {
  const snapshot = applyOptimisticCreateChat(chats.value, chat);
  try {
    const serverChat = await onRequest(chat.receiver.id);
    const idx = chats.value.findIndex(
      (c) =>
        idEquals(c.receiver.id, serverChat.receiver.id) ||
        c.id === serverChat.id,
    );
    if (idx >= 0) chats.value[idx] = serverChat;
    onFeedback?.({ kind: "success", title: "Chat created" });
    return serverChat;
  } catch (error) {
    rollbackCreateChat(chats.value, snapshot);
    onFeedback?.({ kind: "error", title: "Could not create chat", error });
    throw error;
  }
}

export interface DeleteChatSnapshot {
  previousChats?: UserChat[];
}

export function applyOptimisticDeleteChat(
  chats: UserChat[],
  chatId: string | number,
) {
  const snapshot: DeleteChatSnapshot = { previousChats: [...chats] };
  const idx = chats.findIndex((c) => idEquals(c.id, chatId));
  if (idx >= 0) chats.splice(idx, 1);
  return snapshot;
}

export function rollbackDeleteChat(
  chats: UserChat[],
  snapshot: DeleteChatSnapshot | null,
) {
  if (!snapshot) return;
  chats.splice(0, chats.length, ...snapshot.previousChats!);
}

export interface DeleteChatOptions {
  chats: Ref<UserChat[]>;
  chatId: string | number;
  onRequest: (chatId: string | number) => Promise<void>;
  onFeedback?: MutationFeedbackHandler;
}

export async function runDeleteChat({
  chats,
  chatId,
  onRequest,
  onFeedback,
}: DeleteChatOptions) {
  const snapshot = applyOptimisticDeleteChat(chats.value, chatId);
  try {
    await onRequest(chatId);
    onFeedback?.({ kind: "success", title: "Chat deleted" });
  } catch (error) {
    rollbackDeleteChat(chats.value, snapshot);
    onFeedback?.({ kind: "error", title: "Could not delete chat", error });
    throw error;
  }
}
