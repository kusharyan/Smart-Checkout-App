import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { loginCredentials, signupCredentials } from 'src/app/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  loginFormSubmission(data: loginCredentials){
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  registerUserSubmission(data: signupCredentials){
    return this.http.post(`${this.apiUrl}/signup`, data);
  }

  saveToken(token: string) {
    return localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user')!);
  }

  removeToken(token:string) {
    return localStorage.clear();
  }

  isLoggedIn(){
    return !!this.getToken();
  }
}
