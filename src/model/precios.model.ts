export interface PriceGet {
  id: string;
  productSelect: string;
  step: number;
  codigo: string;
  range: {
    start: number;
    end: number;
  };
  price: number;
  priceDiscount: number;
  toUser: string;
  createdAt: Date;
}

export interface PricePost {
  productSelect: string;
  step: number;
  range: {
    start: number;
    end: number;
  };
  price: number;
  priceDiscount: number;
  toUser: string;
}
