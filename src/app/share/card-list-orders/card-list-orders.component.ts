import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { OrderService } from 'src/app/services/order.service';

import { OrderGet } from 'src/model/order.model';
import { UserGet } from 'src/model/user.model';

@Component({
  selector: 'app-card-list-orders',
  templateUrl: './card-list-orders.component.html',
  styleUrls: ['./card-list-orders.component.scss'],
})
export class CardListOrdersComponent implements OnInit {
  @Input()
  orders: OrderGet[] = [];
  user: UserGet;

  alertButtons = ['OK'];
  alertInputs = [
    {
      label: 'Pedido creado',
      type: 'radio',
      value: 'created-order',
      role: 'created-order',
    },
    {
      label: 'En reparto',
      type: 'radio',
      value: 'en-reparto',
      role: 'en-reparto',
    },
    {
      label: 'Entregado',
      type: 'radio',
      value: 'completed',
      role: 'completed',
    },
  ];

  isAlertOpen = false;
  public progress = 0;
  orderID: string;
  constructor(private storage: Storage, private orderService: OrderService) {}

  async ngOnInit() {
    this.storage.create();
    this.user = await this.storage.get('user');
    setInterval(() => {
      this.progress += 0.01;

      // Reset the progress bar when it reaches 100%
      // to continuously show the demo
      if (this.progress > 1) {
        setTimeout(() => {
          this.progress = 0;
        }, 800);
      }
    }, 50);
  }
  // Permite como botton el ion-badge para root
  changeStatusOrder(e: any) {
    if (this.user.role !== 'root') {
      console.log('no acces');
      return;
    } else {
      this.setOpen(true, null);
      this.orderID = e;
    }
  }

  setOpen(isOpen: boolean, e: any) {
    this.isAlertOpen = isOpen;
    if (e === null) {
      return;
    } else {
      if (e.detail.data === undefined) {
        return;
      } else {
        // Aqui hacemos el codigo para cambio de estatus de order
        const form = { statusOrder: e.detail.data.values };
       // console.log(this.orderID, form);
        this.orderService.updatedOrderForRoot(this.orderID, form);

        this.orderID = null;
      }
    }
  }
}
