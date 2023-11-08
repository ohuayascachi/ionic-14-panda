export interface Adress {
  pais: string;
  estado: string;
  provincia: string;
  distrito: string;
  adress: {
    location: string;
    reference: string;
  };
}

export interface UserGet {
  id: string;
  name: string;
  name2: string;
  lastName1: string;
  lastName2: string;
  nameFull: string;
  user: string;
  photo: string;
  phone: string;
  dni: string;
  area: string;
  email: string;
  gender: string;
  adress: Adress;
  carrito: [];
  statusOrder: number;
  registerOrder: string;
  role: string;
  status: boolean;
  createdUpdeted: Date;
  createdAt: Date;
}

export interface UserPost {
  name: string;
  lastName1: string;
  lastName2: string;
  phoneEmpresa: string;
  phonePersonal: string;
  dni: string;
  area: string;
  genero: string;
  email: string;
  password: string;
  adress: Adress;
  role: string;
  status: boolean;
}

export interface UserLogin {
  phone: string;
  password: string;
}

export interface UserLoginReturn {
  user: string;
  dateSession: string;
  failedAttempts: number;
}
