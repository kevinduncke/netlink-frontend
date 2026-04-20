export type Post = {
  id: string | number;
  authorId: string | number;
  content: string;
  location: string;
  imageUrl?: string;
  hideLikes: boolean;
  disableComments: boolean;
  createdAt: string;
  isShared: boolean;
  favorites: Post[];
  following: Post[];
  comments: Comment[];
  author: User;
  _count: {
    comments: number;
    likes: number;
    shares: number;
  };
  postCount: number;
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
