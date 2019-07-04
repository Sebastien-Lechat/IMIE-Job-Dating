import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login/login.service';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import * as jwt_decode from "jwt-decode";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginCredentials = { email :'', password:''}
  decode:any
  constructor(private loginService:LoginService, private toast:ToastController, public nav:NavController) { }
  ngOnInit() {
  }

  async toastControl( msg:string){
    const toast = await this.toast.create({
      message:msg,
      duration:2000,
      position:'bottom',
      cssClass: 'toast'
    });
    toast.present()
  }

  public login() {
    this.loginService.login(this.loginCredentials)
    .subscribe((data: any) => {
        localStorage.setItem('_token', data.token);
        this.decode = jwt_decode(data.token);
        localStorage.setItem('_id', this.decode._id);
        this.toastControl('Connexion réussie');
    },
    error => {
        console.log(error);
        this.toastControl('Erreur : Connexion impossible');
    },
    () => {
        this.nav.navigateRoot('/profil', {animated: true, animationDirection:'forward'});
    });
  }
}
