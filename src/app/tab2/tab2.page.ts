import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ProductsComponent } from '../components/products/products.component';
import { SearchComponent } from '../components/products/search/search.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ProductsComponent, SearchComponent]
})
export class Tab2Page {
  public buscar: string;

  constructor() {}

  busquedaPorText(e: string) {
    this.buscar = e;
  }
}
