export interface Query {
  id: string;
  userId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Pending' | 'Solved';
  reply?: string;
  createdAt: string;
  repliedAt?: string;
}
