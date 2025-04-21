//la lógica de registro, login y otras interacciones de usuario se manejan en el servicio de autenticación
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url:string =  "http://127.0.0.1:8000/api/user/"; 
  constructor(private http: HttpClient) {}
  
  public register(body: any){
    return this.http.post(this.url + "register", body);
  }


  public code(body: any){
    return this.http.post(this.url + "code", body);
  }//holaaa
  public login(body: any):Observable<any>{
    return this.http.post(this.url + "login", body);
  }
  public logout(){
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);    
    return this.http.post(`${this.url}logout`,{}, { headers: headers });
  }
  public history():Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
    
    return this.http.get(`${this.url}history`, { headers });
  }
  
  public userName(id: any): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      
      // La URL correcta sin duplicar 'user'
      return this.http.get(`${this.url}search/${id}`, { headers });
    }
}