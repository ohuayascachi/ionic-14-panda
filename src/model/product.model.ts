interface Features {
  key: string;
  value: string;
}

export interface ProductGet {
  id: string;
  slug: string;
  name: string;
  codigo: string;
  categoria: string;
  subcategoria: string;
  description: string;
  detail: string;
  features: [Features];
  shipping: number;
  unidadprice: string;
  image1: object;
  image2: object;
  image3: object;
  image4: object;
  image5: object;
  location: string;
  count: number;
  countByBox: number;
  userViews: [];
  createdAt: Date;
  updatedAt: Date;
  ratingsAverage: number;
  ratingsQuantity: number;
  views: [];
  status: string;
  precios: [];
  nota: string;
}

export interface ProductGetDB {
  _id: string;
  slug: string;
  name: string;
  categoria: string;
  description: string;
  features: [Features];
  priceUnidad: string;
  priceDocena: string;
  priceCaja: string;
  priceDecaCaja: string;
  priceQuincuaCaja: string;
  priceCentiCaja: string;
  unidadprice: string;
  image1: [];
  image2: [];
  image3: [];
  location: string;
  count: number;
  countByBox: number;
  user: string;
  userViews: [];
  createdAt: Date;
  createdUpdate: Date;
  views: string;
  status: boolean;
  nota: string;
}

export interface ProductPost {
  name: string;
  categoria: string;
  subcategoria: string;
  description: string;
  features: [Features];
  shipping: number;
  unidadprice: string;
  image1: object;
  image2: object;
  image3: object;
  image4: object;
  image5: object;
  location: string;
  tienda: string;
  count: number;
  countByBox: number;
  createdAt: Date;
  updatedAt: Date;
  ratingsAverage: number;
  ratingsQuantity: number;
  precios: [];
  nota: string;
}
