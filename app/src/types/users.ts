export type FollowUser = {
  id: string | number;
  name: string;
  username: string;
  avatarUrl?: string;
};

export type UserChat = {
  chatId: string | number;
  receiver: {
    id: string | number;
    name: string;
    username: string;
    avatarUrl?: string;
  };
};

export type UserProfile = {
  name: string;
  username: string;
  bio: string;
  url: string;
  avatarUrl: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
};
