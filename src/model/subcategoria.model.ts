import { ProductGet } from './product.model';

export interface OrderProductGetc {
  _id: string;
  productSelected: any;
  unidadOrder: string;
  quantities: number;
  status: string;
  unidadPrecio: string;
  stampPrecio: number;
}

export interface SubcategoriaGet {
  id: string;
  name: string;
  slug: string;
  description: string;
  cantidadProduc: number;
  img: object;
  rating: number;
  createdAt: Date;
  products: Partial<ProductGet[]>;
}
