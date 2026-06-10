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
  repostedByMe: boolean;
  repostedAt: string;
  repostedBy: User;
  mentions: User[];
  userRestrictedMe: boolean;
  isFollowedByMe: boolean;
  isRestrictedByMe: boolean;
};

export type User = {
  id: string | number;
  name: string;
  username: string;
  bio: string;
  avatarUrl?: string;
  followers: string | number;
  liked: boolean;
};

export type UserMention = {
  username: string;
};

export type SpecificFollower = {
  id: string | number;
};

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
  specificFollowers: SpecificFollower[];
  hideLikes: boolean;
  disableComments: boolean;
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

export type GroupedNotifications = Record<string, Notification[]>;

export interface NotificationGroup {
  today: Notification[];
  yesterday: Notification[];
  older: Notification[];
  unReadNotifications: number;
}

export interface Notification {
  id: string | number;
  type: NotificationType;
  content: string;
  read: boolean;
  createdAt: string;

  fromUser?: User;
  isFollowedByMe?: boolean;
}
