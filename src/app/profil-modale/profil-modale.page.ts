import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';




@Component({
  selector: 'app-profil-modale',
  templateUrl: './profil-modale.page.html',
  styleUrls: ['./profil-modale.page.scss'],
})
export class ProfilModalePage implements OnInit {

  constructor(public modal:ModalController) { }

  ngOnInit() {
  }
  close(){
    this.modal.dismiss()
  }
}
