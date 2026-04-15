export type UserPost = {
  id: string | number;
  name: string;
  postCount: number;
  username: string;
  avatarUrl?: string;
};

export type Post = {
  id: string | number;
  content: string;
  location: string;
  imageUrl?: string;
  createdAt: string;
  commentsCount?: number;
  likesCount?: number;
  sharesCount?: number;
};

export type ExplorePost = {
  author: {
    id: string | number;
    name: string;
    username: string;
    avartarUrl?: string;
    followers: string | number;
    isFollowedByMe: boolean;
  };
  authorId: string | number;
  isShared: boolean;
  content: string;
  createdAt: string;
  disableComments: boolean;
  hideLikes: boolean;
  id: string | number;
  imageUrl?: string;
  location?: string;
  _count: {
    comments: number;
    likes: number;
    shares: number;
  };
};

export type FavoritePost = {
  id: string | number;
  content: string;
  location: string;
  createdAt: string;
  commentsCount: number;
  likesCount: number;
  sharesCount: number;
  author: {
    id: string | number;
    name: string;
    username: string;
    avatarUrl?: string;
  };
};

export type FollowingPost = {
  id: string | number;
  content: string;
  createdAt: string;
  location: string;
  isShared: boolean;
  author: {
    id: string | number;
    name: string;
    username: string;
    avatarUrl: string;
  };
  _count: {
    comments: number;
    likes: number;
    shares: number;
  };
};
