export type FollowUser = {
  id: string | number;
  name: string;
  username: string;
  avatarUrl?: string;
};

export interface Followers extends FollowUser {
  isFollowedByMe: boolean;
};

export type UserChat = {
  id: string | number;
  createdAt: string;
  receiver: {
    id: string | number;
    name: string;
    username: string;
    avatarUrl?: string;
  };
};

export type UserProfile = {
  id: string | number;
  name: string;
  username: string;
  bio: string;
  url: string;
  avatarUrl: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  isFollowedByMe: boolean;
};
