import { idEquals } from "../idUtils";
import type { Comment, PostType } from "../../types/types";
import type { MutationFeedbackHandler } from "./feedback";

export interface CreateCommentSnapshot {
  postId: number | string;
  previousComments?: Comment[];
  previousCount: number;
}

export function createCreateCommentSnapshot(post: PostType): CreateCommentSnapshot {
  return {
    postId: post.id,
    previousComments: post.comments ? [...post.comments] : undefined,
    previousCount: post._count.comments ?? 0,
  };
}

export function applyOptimisticCreateComment(post: PostType, comment: Comment) {
  const snapshot = createCreateCommentSnapshot(post);

  if (!post.comments) {
    post.comments = [comment];
  } else {
    post.comments.unshift(comment);
  }
  post._count.comments = (post._count.comments ?? 0) + 1;

  return snapshot;
}

export function rollbackCreateComment(post: PostType, snapshot: CreateCommentSnapshot | null) {
  if (!snapshot) return;
  if (!idEquals(post.id, snapshot.postId)) return;

  post.comments = snapshot.previousComments ?? [];
  post._count.comments = snapshot.previousCount;
}

export interface CreateCommentOptions {
  post: PostType;
  comment: Comment;
  onRequest: (postId: number | string, content: string) => Promise<Comment>;
  onFeedback?: MutationFeedbackHandler;
}

export async function runCreateComment({ post, comment, onRequest, onFeedback }: CreateCommentOptions) {
  const snapshot = applyOptimisticCreateComment(post, comment);

  try {
    const serverComment = await onRequest(post.id, comment.content);
    if (post.comments && post.comments.length > 0) {
      post.comments[0] = serverComment;
    }
    onFeedback?.({ kind: "success", title: "Comment posted" });
  } catch (error) {
    rollbackCreateComment(post, snapshot);
    onFeedback?.({ kind: "error", title: "Could not post comment", error });
    throw error;
  }
}

export interface DeleteCommentSnapshot {
  postId: number | string;
  previousComments?: Comment[];
  previousCount: number;
}

export function createDeleteCommentSnapshot(post: PostType): DeleteCommentSnapshot {
  return {
    postId: post.id,
    previousComments: post.comments ? [...post.comments] : undefined,
    previousCount: post._count.comments ?? 0,
  };
}

export function applyOptimisticDeleteComment(post: PostType, commentId: number | string) {
  const snapshot = createDeleteCommentSnapshot(post);

  post.comments = post.comments?.filter((c) => c.id !== commentId) || [];
  post._count.comments = Math.max(0, (post._count.comments ?? 0) - 1);

  return snapshot;
}

export function rollbackDeleteComment(post: PostType, snapshot: DeleteCommentSnapshot | null) {
  if (!snapshot) return;
  if (!idEquals(post.id, snapshot.postId)) return;

  post.comments = snapshot.previousComments ?? [];
  post._count.comments = snapshot.previousCount;
}

export interface DeleteCommentOptions {
  post: PostType;
  commentId: number | string;
  onRequest: (commentId: number | string) => Promise<void>;
  onFeedback?: MutationFeedbackHandler;
}

export async function runDeleteComment({ post, commentId, onRequest, onFeedback }: DeleteCommentOptions) {
  const snapshot = applyOptimisticDeleteComment(post, commentId);

  try {
    await onRequest(commentId);
    onFeedback?.({ kind: "success", title: "Comment deleted" });
  } catch (error) {
    rollbackDeleteComment(post, snapshot);
    onFeedback?.({ kind: "error", title: "Could not delete comment", error });
    throw error;
  }
}
