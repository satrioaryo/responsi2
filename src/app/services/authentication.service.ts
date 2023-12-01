import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = 'token-saya';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // Inisialisasi is auth
  // isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
  //   null
  // );
  // token = '';
  constructor(private http: HttpClient) {
    this.loadToken();
  }
  loadToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
  apiURL() {
    return 'https://api-auth.dalhaqq.xyz/';
  }
  logout() {
    localStorage.clear();
    return true;
  }
}
