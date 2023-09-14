import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user/User';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user: any){
    return this.http.post(`${environment.API_URL}/login`, user, {headers: {'Allow-access-expose-headers': 'Authorization'}, observe: 'response'});
  }

  recoverPassword(mobile:string) {
    return new Observable<void>(observer => {
      setTimeout(() => {
        if(mobile != "8109206218"){
          observer.error({message: "Mobile not found"})
        }
        observer.next();
        observer.complete();
      }, 3000);
    })
  }
}
