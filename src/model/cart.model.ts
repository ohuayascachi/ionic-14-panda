interface CartProduct {
  image1: {
    imgLarge: string;
    imgMediun: string;
    imgSmall: string;
  };
  _id: string;
  name: string;
  precios: any;
  id: string;
}

export interface CartGet {
  _id: string;
  entregado: boolean;
  count: number;
  user: string;
  status: boolean;
  producto: CartProduct;
  precioSelect: number;
  precioUnidad: number;
  precioUnidadDisc: number;
  colocacion: string;
  id: string;
}
