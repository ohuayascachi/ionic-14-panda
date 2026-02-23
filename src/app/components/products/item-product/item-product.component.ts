import { Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductGet } from 'src/model/product.model';
import { ActionSheetController, ToastController, IonicModule } from '@ionic/angular';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/auth/service/auth.service';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { NgxStarRatingModule } from 'ngx-star-rating';

@Component({
  selector: 'app-item-product',
  templateUrl: './item-product.component.html',
  styleUrls: ['./item-product.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, SwiperModule, NgxStarRatingModule]
})
export class ItemProductComponent implements OnInit {
  @ViewChild('userInput') userInputViewChild: ElementRef;

  userInputElement: HTMLInputElement;
  public product: ProductGet | null = null;
  public productSub: Subscription;
  public formOrderProducts: FormGroup;
  public noExiste = signal(true);
  public seletedValue = signal('producto');
  formOrder: FormGroup;
  formStar: FormGroup;
  private idProductSeleted: string;
  public orderArray: Array<[]> = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private orderService: OrderService,
    private cartService: CartService,
    private authService: AuthService,
    private toastController: ToastController
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

    this.formStar = this.fb.group({
        rating: [5],
    });
  }

  ngOnInit() {
    const result = this.route.snapshot.data.productSlug;
    if (result && result.length > 0) {
        this.product = result[0];
        this.noExiste.set(false);
        this.formStar.patchValue({ rating: this.product.ratingsAverage || 5 });
    } else {
        this.noExiste.set(true);
    }
  }

  get productsArray() {
    return this.formOrderProducts.controls.order as FormArray;
  }

  segmentChange(event: any) {
    this.seletedValue.set(event.detail.value);
  }

  onSlideChange(event: any) {
    //console.log(event[0].activeIndex);
  }

  // Add a carrito
  async addCarrrito() {
    if (!this.authService.token) {
      const toast = await this.toastController.create({
        message: 'Debes iniciar sesión para agregar al carrito',
        duration: 2000,
        color: 'warning',
        position: 'top',
      });
      await toast.present();
      this.router.navigate(['/auth/log-in']);
      return;
    }

    if (this.product) {
        const form = {
        producto: this.product.id,
        count: 1,
        status: true,
        };

        if (form.producto && form.count && form.status) {
            this.cartService.postCart(form);
        }
    }
  }

  retroLink() {
    this.router.navigate(['/products']);
  }
}
