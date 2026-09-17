export interface Book {
  _id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  createdAt?: string;
}


export interface BookFormValue {
  title: string;
  description?: string;
  price: number;
  category: string;
}
