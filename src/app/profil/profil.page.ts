import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { NavController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { tap } from 'rxjs/operators';
import { $ } from 'protractor';




@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

  user = {nom: '', prenom : ''}
  etudiant = false
  entreprise = false
  data = {}
  loginId = localStorage.getItem("_id")


  constructor(private userService:UserService, public nav:NavController, public storage:NativeStorage) { }

  ngOnInit() {

    this.userService.profil()
    .subscribe(data => {
      console.log(data)
      this.data = data
      var size = Object.keys(data).length;
      for (let i = 0; i < size ; i++ ){
        if( data[i]["_id"] == this.loginId){
          this.user = data[i]
          if (this.user["Etudiant"]){
            this.etudiant = true
            localStorage.setItem('formation', data[i]['Etudiant']['Formation']['niveau']);
            localStorage.setItem('role', 'Etudiant');
          }else{
            this.entreprise = true
            localStorage.setItem('role', 'Entreprise');
            localStorage.setItem('nom_entreprise', data[i]['Entreprise']['nom_entreprise']);
          }
        }
      }
    },
    error => console.error("User not stored", error)
    );

    
  }
}
