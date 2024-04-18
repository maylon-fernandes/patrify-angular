import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000'

  registerUser(userData: any) {
    const urlregister = `${this.url}/register/registeruser`;
    return this.http.post(urlregister, userData)
      .pipe(
        map(response => {
          // Handle successful registration (e.g., return success message or user data)
          return response;
        }),
        catchError(error => {
          // Handle registration errors (e.g., return error message or throw exception)
          return throwError(error);
        })
      );
  }

  LoginUser(userData: any){
    const urllogin = `${this.url}/auth/login`;
    return this.http.post<any>(urllogin, userData)
      .pipe(
        map(response => {
          // Handle successful registration (e.g., return success message or user data)
          return response;
        }),
        catchError(error => {
          // Handle registration errors (e.g., return error message or throw exception)
          return throwError(error);
        })
      );
  }
 
  SignedUser(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });

    const url = `${this.url}/auth/signed`;
    
    return this.http.get(url, { headers })
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  cadastrarPatrimonio(patrimonioData: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });
    const url = `${this.url}/patrimony/registerpatrimonio`;
    return this.http.post(url, patrimonioData, { headers })
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  listPatry(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });

    const url = `${this.url}/patrimony/list`;
    
    return this.http.get(url, { headers })
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }


    

}
