import { CartGet } from './cart.model';
import { UserGet } from './user.model';

// Revisar luego
export interface OrderProductPost {
  productSelected: string;
  unidadOrder: string;
  quantities: number;
  status: string;
  unidadPrecio: string;
  stampPrecio: number;
}

export interface OrderGet {
  _id: string;
  cartSelected: CartGet[];
  client?: string;
  typeMoneda: string;
  costoEnvio: number;
  descuento: number;
  codigo: string;
  total: number;
  userRegister: UserGet;
  metodoPago: string;
  statusOrder: string;
  statusPay: string;
  comment: string;
  docSolitado: string;
  createdAt: Date;
  sequence: number;
  subBeforeTaxes: number;
  impuestos: number;
  id: string;
}

export interface OrderPost {
  cartSelected: CartGet[];
  client: string;
  costoEnvio: number;
  descuento: 0;
  statusPay: string;
  comment: string;
  docSolitado: string;
}
