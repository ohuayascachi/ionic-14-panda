import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

const server = environment.serverDev;

@Injectable({
  providedIn: 'root',
})
export class FuncionesService {
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {}

  //Solo es valido para precios
  async presentAlert() {
    return this.alertController.create({
      header: 'Exitoso!',
      message: 'Se ha agregado correctamente.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/prices']);
          },
        },
      ],
    });

   
  }

    //Solo es valido para Usuario
    async presentAlertUser() {
      return this.alertController.create({
        header: 'Exitoso!',
        message: 'Se ha modificado correctamente.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.router.navigate(['/user']);
            },
          },
        ],
      });
  
     
    }

  async presentAlertWhenDelete() {
    return this.alertController.create({
      header: 'Exitoso!',
      message: 'Se ha eliminado correctamente.',
      buttons: [
        {
          text: 'OK',
          // handler: () => {
          //   this.router.navigate(['/prices']);
          // },
        },
      ],
    });

    //await alert.present(); this.router.navigate(['/auth/log-in']);
  }

  //Proceso de carga de post
  showLoading() {
    return this.loadingCtrl.create({
      message: 'CARGADO...',
      // duration: 3000,
      spinner: 'circles',
    });

    //loading.present();
  }
  async requiredSigIn() {
    const alert = await this.alertController.create({
      header: 'DEBE INICIAR SESSIÓN',
      subHeader: 'Esta acción requiere iniciar sessión',
      buttons: [
        {
          text: 'INICIAR SESSIÓN',
          // htmlAttributes: {
          //   'aria-label': 'close',
          // },
          handler: () => {
            this.router.navigate(['/auth/log-in']);
          },
        },
        {
          text: 'CACELAR',
          // htmlAttributes: {
          //   'aria-label': 'close',
          // },
          handler: () => {
            this.router.navigate(['/products']);
          },
        },
      ],
    });

    await alert.present();
  }

  //para indicar alvertencia de eliminar

  //Return de last page or user page
  returnUser() {
    this.router.navigate(['/user']);
  }
}
