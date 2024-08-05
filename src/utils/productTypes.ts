export type Product = {
  id: number;
  name: string;
  description: string;
  images: string[] | null; // Resim URL'lerini içeren bir dizi
  price: number;
};
