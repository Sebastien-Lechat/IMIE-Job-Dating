import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job/job.service';
import { NavController, ModalController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { JobPage } from '../job/job.page'




@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {

  job = []
  entreprise = {}
  data = {}
  loginId = localStorage.getItem("_id");
  myParam: any;

  constructor(private jobService:JobService, public nav:NavController, public storage:NativeStorage, public modalController: ModalController) { 

  }

  ngOnInit() {

    this.jobService.jobList()
      .subscribe(data => {
        console.log(data)
        this.data = data
        var size = Object.keys(data).length;
        if(localStorage.getItem("role") == "Etudiant"){
          for (let i = 0; i < size ; i++ ){
            if (data[i]["Entreprise"]){
              var sizeJob = Object.keys(data[i]["Entreprise"]["Job"]).length;
              if ( sizeJob >= 2){
                for (let j = 1; j < sizeJob ; j++ ){
                  if(data[i]["Entreprise"]["Job"][j]["Formation"]["niveau"] == localStorage.getItem("formation")){
                    data[i]["Entreprise"]["Job"][j]["logo"]= data[i]["Entreprise"]["logo"]
                    this.job.push(data[i]["Entreprise"]["Job"][j])                    
                  }
                }
              } 
            }
          }
        }

        if(localStorage.getItem("role") == "Entreprise"){
          for (let i = 0; i < size ; i++ ){
            if (data[i]["_id"] == localStorage.getItem("_id")){
              var sizeJob = Object.keys(data[i]["Entreprise"]["Job"]).length;
              if ( sizeJob >= 2){
                for (let j = 1; j < sizeJob ; j++ ){
                  data[i]["Entreprise"]["Job"][j]["logo"] = data[i]["Entreprise"]["logo"]
                  data[i]["Entreprise"]["Job"][j]["nom_entreprise"] = data[i]["Entreprise"]["nom_entreprise"]
                  this.job.push(data[i]["Entreprise"]["Job"][j])                  
                }
              } 
            }
          }
        }
  
      },
      error => console.error("No job found", error)
      );
    }

    async presentModal(item) {
      const modal = await this.modalController.create({
        component: JobPage,
        componentProps: {
          "item" : item
        }
      });
      console.log(item)
      return await modal.present();
    }
}
