import { Injectable } from '@angular/core';
import{ HttpClient } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})

export class JobService {

  static readonly USER_URL = 'https://jobdatingmanager.herokuapp.com/api/users'

  constructor(private http:HttpClient, public storage:NativeStorage) { }

  public jobList(){
    return this.http.get(JobService.USER_URL)
  }

}
