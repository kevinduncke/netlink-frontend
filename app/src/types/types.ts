export type PostType = {
  id: number;
  authorId: string | number;
  content: string;
  location: string;
  imageUrl?: string;
  hideLikes: boolean;
  disableComments: boolean;
  createdAt: string;
  isShared: boolean;
  comments: Comment[];
  author: User;
  _count: {
    comments: number;
    likes: number;
    shares: number;
  };
  postCount: number;
  dashboardPosts: {
    favorites: PostType[];
    following: PostType[];
  };
};

export type User = {
  id: string | number;
  name: string;
  username: string;
  avatarUrl?: string;
  followers: string | number;
  isFollowedByMe: boolean;
};

export interface Comment {
  id: string | number;
  content: string;
  createdAt: string;
  postId: string;
  author: {
    id: string | number;
    name: string;
    username: string;
    avatarUrl: string;
  };
}

export interface CreatePost {
  content: string;
  mentions: string[];
  location: string;
  imageUrl: string;
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'ONLY_ME' | 'SPECIFIC';
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
