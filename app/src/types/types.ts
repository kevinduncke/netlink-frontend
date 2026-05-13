export type PostType = {
  id: number;
  authorId: string | number;
  content: string;
  location: string;
  imageUrl?: string;
  hideLikes: boolean;
  disableComments: boolean;
  createdAt: string;
  comments: Comment[];
  author: User;
  _count: {
    comments: number;
    likes: number;
    shares: number;
  };
  postCount: number;
  isRepost: boolean;
  repostedAt: string;
  repostedBy: User;
  mentions: User[];
};

export type User = {
  id: string | number;
  name: string;
  username: string;
  bio: string;
  avatarUrl?: string;
  followers: string | number;
  isFollowedByMe: boolean;
  liked: boolean;
};

export type UserMention = {
  username: string;
}

export interface Comment {
  id: string | number;
  content: string;
  createdAt: string;
  postId: string;
  author: User;
}

export interface CreatePost {
  content: string;
  mentions: UserMention[];
  location: string;
  imageUrl: string;
  visibility: "PUBLIC" | "FOLLOWERS" | "ONLY_ME" | "SPECIFIC";
  specificFollowers: string[];
  hideLikes: boolean;
  disableComments: boolean;
  showMentionModal: boolean;
  showSpecificModal: boolean;
}

export interface EditingComment {
  postComment: string;
  editedCommentContent: string;
  openCommentPostId: number | string | null;
  editingCommentId: number | string | null;
  openCommentActions: number | string | null;
}

export type NotificationType =
  | "FOLLOW"
  | "LIKE"
  | "COMMENT"
  | "REPOST"
  | "MENTION"
  | "MESSAGE";

export interface Notification {
  id: string | number;
  type: NotificationType;
  content: string;
  read: boolean;
  createdAt: string;

  fromUser?: User;
  post?: PostType;
  comment?: Comment;
}
