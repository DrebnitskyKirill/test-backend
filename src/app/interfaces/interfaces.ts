export interface JwtPayload {
  id: string;
}

export interface IUser {
  id: string;
  token: string;
}
export interface RegistrationStatus {
  id: string;
  token: string;
}
export interface LoginStatus {
  id: string;
  password: string;
}
export interface ITodo {
  _id: string;
  owner: string;
  title: string;
  description: string;
}
