import { Injectable } from '@angular/core';
import{ HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  static readonly LOGIN_URL = 'https://jobdatingmanager.herokuapp.com/api/login'

  access:boolean;
  token:any;

  constructor(private http:HttpClient, public storage:NativeStorage) { }

  public login(credentials) {
    return this.http.post(LoginService.LOGIN_URL, credentials)
    .pipe(tap(token => {
      this.storage.setItem('token',token)
      .then( () => {
        console.log('token stored')
      },
      error => console.error("Token not stored", error)
      );
      this.token = token;
      this.access = true;
      return token;
    })
    )
  }
}
