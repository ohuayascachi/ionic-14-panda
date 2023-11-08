import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './services/user.service';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class UserGeneralGuard implements CanActivate {
  userRole = 'general';
  constructor(private userService: UserService, private storage: Storage) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.storage.get('user').then((resp) => (this.userRole = resp.role));
    console.log(this.userRole);
    console.log('GUAR DE EJECUTO+O');
    console.log(route);
    if (this.userRole !== 'root') {
      return false; // es true, si queremos q pase;
    } else if (this.userRole === 'root') {
      return true; // es false, si no queremos q pase;
    }
  }
}
