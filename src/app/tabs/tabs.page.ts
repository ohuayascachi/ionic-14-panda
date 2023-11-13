import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Storage } from '@ionic/storage-angular';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  userRole$: Observable<string> = of('general');

  constructor(private userService: UserService, private storage: Storage) {
    //Esto con este delay, pues si no sale un error;
    // setTimeout(() => {
    this.storage.create();
    this.recuperaUser();
    // }, 200);
  }

  ngOnInit() {}

  // activeService() {
  //   this.userService.tabsToPag4();
  // }

  async recuperaUser() {
    const user = await this.storage.get('user');
    if (user === null) {
      return;
    } else {
      this.userRole$ = of(user.role);
    }
  }
}
