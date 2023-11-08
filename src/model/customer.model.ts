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
  banco: string;
  cuenta: string;
  cci: string;
  status: string;
}

export interface CustomerGet {
  _id: string;
  phone: string;
  name: string;
  lastName1: string;
  lastName2: string;
  image: string;
  user: string;
  dni: string;
  email: string;
  edad: Edad;
  ruc: string;
  genero: string;
  adress: Adress;
  createdAt: Date;
  status: boolean;
  id: string;
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
