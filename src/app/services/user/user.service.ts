import { Injectable } from '@angular/core';
import{ HttpClient } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  static readonly USER_URL = 'https://jobdatingmanager.herokuapp.com/api/users'

  constructor(private http:HttpClient, public storage:NativeStorage) { }

  public profil() {
    return this.http.get(UserService.USER_URL)
  }
}