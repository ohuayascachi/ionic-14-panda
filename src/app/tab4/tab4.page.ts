import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import { UserGet } from 'src/model/user.model';
import { Observable, Subscription, of } from 'rxjs';

import { UserService } from '../services/user.service';
import { Storage } from '@ionic/storage-angular';
import { LoadingService } from '../components/shares/loading/loading.service';
import { FuncionesService } from '../services/funciones.service';

@Component({
    selector: 'app-tab4',
    templateUrl: 'tab4.page.html',
    styleUrls: ['tab4.page.scss'],
    standalone: false
})
export class Tab4Page implements OnDestroy, OnInit {
  userDB: UserGet;
  user$: Observable<UserGet>;
  userName: string;
  userLas1: string;
  userName$: Observable<string>;
  userLas1$: Observable<string>;
  subcrName: Subscription;
  subcrLastname: Subscription;
  showuser = false;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    public storage: Storage,
    public loadingService: LoadingService,
    public svc: FuncionesService
  ) {
   this.activeUserData();
  }

  ngOnInit(): void {}
  activeUserData() {
    console.log('aqui siempoke mensaje')
    this.userName = localStorage.getItem('name');
    this.userLas1 = localStorage.getItem('lastName1');

    this.authService.isLoggedIn$.subscribe();
    const loginIn$ = this.authService.isLoggedIn$;

    loginIn$.subscribe((x) => {
      console.log(x);
      if (x === true) {
        this.datasOfUser();
        // console.log('yA EXISTE!!');
      } else if (x === false && localStorage.getItem('token')) {
        this.datasOfUser();
      } else if (x === false && !localStorage.getItem('token')) {
        this.solicitarSigIn();
        // console.log('object');
      }
    });
    // loginOut$.subscribe((x) => console.log(x));
  }

  async datasOfUser() {
    // const userID = await this.storage.get('user');
    // console.log(userID);

    this.userService.getUser();

    const user$ = this.userService.dataUser$;
    const userMod$ =
      this.loadingService.showLoaderUntilCompleted<UserGet>(user$);
    userMod$.subscribe((x) => {
      if (x) {
        this.showuser = true;
        this.userDB = x;
        this.userName$ = of(x.name);
        this.userLas1$ = of(x.lastName1);
        this.subcrName = this.userName$.subscribe();
        this.subcrLastname = this.userLas1$.subscribe();
        this.loadingService.loadingOff();
      }
    });
  }

  solicitarSigIn() {
    this.svc.requiredSigIn();
  }

  ngOnDestroy() {
    this.userName = null;
    this.userLas1 = null;
    // console.log('Se cerro NGdESTTY');

    this.subcrName.unsubscribe();
    this.subcrLastname.unsubscribe();
  }
}
