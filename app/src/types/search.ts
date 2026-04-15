export interface SearchUser {
  id: number;
  name: string;
  username: string;
  avatarUrl: string;
}

export interface SearchFavoriteUser extends SearchUser {
  isFavorite: boolean;
}