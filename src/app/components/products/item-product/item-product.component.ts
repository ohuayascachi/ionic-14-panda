/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductGet } from 'src/model/product.model';
import { ActionSheetController } from '@ionic/angular';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service';
import { CartService } from 'src/app/services/cart.service';

//
@Component({
    selector: 'app-item-product',
    templateUrl: './item-product.component.html',
    styleUrls: ['./item-product.component.scss'],
    standalone: false
})
export class ItemProductComponent implements OnInit {
  @ViewChild('userInput') userInputViewChild: ElementRef;

  userInputElement: HTMLInputElement;
  public product: ProductGet;
  public productSub: Subscription;
  public formOrderProducts: FormGroup;
  public noExiste = true;
  public seletedValue = 'producto';
  formOrder: FormGroup;
  formStar: FormGroup;
  private idProductSeleted: string;
  public orderArray: Array<[]> = []; // SOLO UNO DE ESTOS DOS DEBO EXISTIR

  constructor(
    private route: ActivatedRoute,

    private fb: FormBuilder,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private orderService: OrderService,
    private cartService: CartService
  ) {
    this.formOrderProducts = this.fb.group({
      client: [],
      statusShipping: ['procesando', Validators.required],
      statusVenta: ['no-paid', Validators.required],
      comment: [],
      order: this.fb.array([]),
      direccion: [],
      docSolitado: [],
    });

    this.formOrder = this.fb.group({
      productSelected: ['', Validators.required],
      unidadOrder: ['und', Validators.required],
      quantities: [1, Validators.required],
      stampPrecio: [],
      status: ['status', Validators.required],
      unidadPrecio: ['S/', Validators.required],
    });
  }

  ngOnInit() {
    const result = this.route.snapshot.data.productSlug;
    this.product = result[0];
    //  console.log(this.product);

    if (result) {
      this.noExiste = false;
    } else {
      this.noExiste = true;
    }
    this.formStar = this.fb.group({
      rating: [this.product.ratingsAverage || 5],
    });

    //  console.log(this.product);
  }

  get productsArray() {
    return this.formOrderProducts.controls.order as FormArray;
  }

  segmentChange(event: any) {
    this.seletedValue = event.detail.value;
  }

  onSlideChange(event: any) {
    //console.log(event[0].activeIndex);
  }

  // Add a carrito
  async addCarrrito() {
    const form = {
      producto: this.product.id,
      count: 1,
      status: true,
    };

    if (form.producto && form.count && form.status) {
      this.cartService.postCart(form);
    }
  }

  retroLink() {
    this.router.navigate(['/products']);
  }
}

/*
 */
