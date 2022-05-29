export interface CommentType {
  id: string;
  author: string;
  text: string;
  createdAt: string; // YY-MM-DD HH:MM:SS
  votes: number;
  parentCommentId?: string;
  replies: CommentType[];
}
