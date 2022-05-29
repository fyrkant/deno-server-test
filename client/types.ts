export interface CommentType {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  votes: number;
  parentCommentId?: string;
  replies: CommentType[];
}
