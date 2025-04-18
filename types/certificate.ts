export interface Certificate {
  _id: string;
  title: string;
  description: string;
  imgPath: string;
  orgLogos: string[];
  liveLink?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}