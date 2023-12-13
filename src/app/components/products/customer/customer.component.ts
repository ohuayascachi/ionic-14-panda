import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  public datosPersonales = true;
  public datosPedidos = false;
  constructor() {}

  ngOnInit() {}

  segmentChanged(ev: any) {
    // console.log('Segment changed', ev);
    if (ev.detail.value === 'datos') {
      this.datosPersonales = true;
      this.datosPedidos = false;
    }
    if (ev.detail.value === 'pedidos') {
      this.datosPedidos = true;
      this.datosPersonales = false;
    }
  }
}
