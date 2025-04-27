import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Echo from 'laravel-echo';
import * as Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private url:string =  "http://127.0.0.1:8000/api/game/"; 
  constructor(private http: HttpClient) {}
  
  public create():Observable<any>{
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.url}create`, {}, { headers: headers });
  }
  public search():Observable<any>{
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}games`, { headers: headers });
  }
  public start(id:Number):Observable<any>{
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.url}start/${id}`, {}, { headers: headers });
  } 
  public cancel(id:any):Observable<any>{
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.url}cancel/${id}`, { headers: headers });
  } 
  public cancelAll():Observable<any>{
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.url}cancel`, { headers: headers });
  } 
  public turn(id:any):Observable<any>{
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.url}turn/${id}`, {}, { headers: headers });
  } 
  public board(id: any): Observable<any> {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.url}board/${id}`, {}, { headers: headers });
  }
  public info(id:any):Observable<any>{
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}info/${id}`, { headers: headers });
  }  
  public win(id:any, user:any):Observable<any>{
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.url}win/${id}`,user, { headers: headers });
  } 
}
