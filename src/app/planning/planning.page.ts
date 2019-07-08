import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ProfilModalePage } from '../profil-modale/profil-modale.page';
import { RencontreService } from '../services/rencontre/rencontre.service';



@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
})
export class PlanningPage implements OnInit {

  data = {}
  rencontre = []

  constructor(public RencontreService:RencontreService ,public nav:NavController, public storage:NativeStorage, public modalController: ModalController) { }

  ngOnInit() {
    this.RencontreService.meets()
    .subscribe(data => {
      console.log(data)
      this.data = data
        var size = Object.keys(data).length;
        if(localStorage.getItem("role") === "Entreprise"){
           for (let i = 0; i < size ; i++ ){
            if (data[i]["nom_entreprise"] == localStorage.getItem("nom_entreprise")){
              this.rencontre.push(data[i])  
            }
          }
          console.log(this.rencontre);
        }
      },
      error => console.error("No rencontre found", error)
      );
  }
  async presentModal(item) {
    const modal = await this.modalController.create({
      component: ProfilModalePage,
      componentProps: {
        "user" : item,
        "etudiant" : true,
      }
    });
    return await modal.present();
  }
}
