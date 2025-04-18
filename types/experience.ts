export interface Experience {
  _id: string;
  title: string;
  company: string;
  duration: string;
  type: string;
  role: string[];
  order: number;
  createdAt?: string;
  updatedAt?: string;
}