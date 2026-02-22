interface Adress {
  pais: string;
  estado: string;
  provincia: string;
  distrito: string;
  adress: {
    location: string;
    reference: string;
  };
}

interface Edad {
  edad: string;
  verificado: boolean;
}
interface Banco {
  nombreBanco: string;
  cuenta: string;
  cci: string;
  status: string;
  titular: string;
}

export interface CustomerGet {
  _id: string;
  phone: string;
  name: string;
  lastName1: string;
  lastName2: string;
  image: string;
  empresa: string;
  userRigister: string;
  dni: string;
  email: string;
  edad: Edad;
  ruc: string;
  genero: string;
  adress: Adress;
  createdAt: Date;
  status: boolean;
  id: string;
  informacionBanco: Banco;
  createdUpdeted: Date;
  __v: number;
  nameFull: string;
  order: any;
}

export interface CustomerPost {
  phone: string;
  name: string;
  lastName1: string;
  lastName2: string;
  image: string;
  dni: string;
  ruc: string;
  genero: string;
  email: string;
  edad: Edad;
  adress: Adress;
  informacionBanco: [Banco];
}
