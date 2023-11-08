import { ProductGet } from './product.model';

export interface OrderProductGet {
  _id: string;
  productSelected: any;
  unidadOrder: string;
  quantities: number;
  status: string;
  unidadPrecio: string;
  stampPrecio: number;
}

export interface CategoriaGet {
  id: string;
  name: string;
  slug: string;
  description: string;
  cantidadProduc: number;
  img: object;
  subc: object;
  rating: number;
  products: Partial<ProductGet>;

  createdAt: Date;
}
