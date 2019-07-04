import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-job',
  templateUrl: './job.page.html',
  styleUrls: ['./job.page.scss'],
})
export class JobPage implements OnInit {

  constructor(public modal:ModalController) { }

  ngOnInit() {
  }

  close(){
    this.modal.dismiss()
  }

}
