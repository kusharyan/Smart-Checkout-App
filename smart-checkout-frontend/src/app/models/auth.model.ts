export interface loginCredentials {
  email: string;
  password: string;
}

export interface signupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface authResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role_id?: number;
  };
}