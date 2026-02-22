import { Component } from '@angular/core';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss'],
    providers: [],
    standalone: false
})
export class Tab2Page {
  public buscar: string;

  constructor() {}

  busquedaPorText(e: string) {
    this.buscar = e;
  }
}
