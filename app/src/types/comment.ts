export interface Comment {
    content: string;
    createdAt: string;
    postId: string;
    author: {
        id: string | number;
        name: string;
        username: string;
        avatarUrl: string;
    }
}