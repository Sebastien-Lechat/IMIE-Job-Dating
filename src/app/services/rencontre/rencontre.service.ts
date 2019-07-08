import { Injectable } from '@angular/core';
import{ HttpClient,HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RencontreService {

  static readonly MEET_URL = 'https://jobdatingmanager.herokuapp.com/api/Meets'

  constructor(private http:HttpClient, public storage:NativeStorage) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem('_token')}`
      }
    });
    return next.handle(req);
  }
  
  public meets(){
  return this.http.get(RencontreService.MEET_URL)
  }
  
}
