import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class Loader {
  loading: HTMLIonLoadingElement | null  = null;

  constructor(private loadingCtrl: LoadingController){

  }

  async presentLoading(message: string, duration: number){
    this.loading =  await this.loadingCtrl.create({
      message: `Please Wait...`,
      duration: 0,
      spinner: 'crescent',
      backdropDismiss: true,
    })
    await this.loading.present();
  }

  async hideLoader(){
    if(this.loading){
      await this.loading.dismiss();
    }
  }
}
