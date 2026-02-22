import { Component, OnInit, reflectComponentType } from '@angular/core';
import { ActivatedRoute, Event, Route, Router } from '@angular/router';
import { Observable, fromEvent, of, pipe } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pluck,
  tap,
} from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import { ProductGet } from 'src/model/product.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrecioProdListComponent } from './precio-prod-list.component';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-precio-prod',
    templateUrl: './precio-prod.component.html',
    styleUrls: ['./precio-prod.component.scss'],
    standalone: false
})
export class PrecioProdComponent implements OnInit {
  public tpreciosG = [
    { item: 1, pre: 'gen' },
    // { item: 2, pre: 'gen' },
    // { item: 3, pre: 'gen' },
  ];
  isDisabled = false;
  public toUser: string;

  public tprecg1 = [{ item: 1, pre: 'gen' }];
  public tprec2 = [];
  public tprec3 = [];
  public tprec4 = [];
  public tprec5 = [];
  public listado = [];
  matrix = false;
  isOk = false;

  // NO CAMBIAR ESTE ARRAY - DEPNDE OTROS OBJETOS
  public sellers = [
    { item: 'General', name: 'general', check: true },
    { item: 'Vendedor-1', name: 'seller-1', check: false },
    { item: 'Vendedor-2', name: 'seller-2', check: false },
    { item: 'Vendedor-3', name: 'seller-3', check: false },
    { item: 'Vendedor-4', name: 'seller-4', check: false },
    { item: 'Vendedor-5', name: 'seller-5', check: false },
  ];

  listadoIDS = [];
  public tprec0 = [];
  public product$: Observable<ProductGet>;
  public product: ProductGet;
  public productID: string;
  productName: Observable<string>;

  public formPrices: FormGroup;
  public pricesArray: Array<[]> = [];
  form: FormGroup;

  pricesReset = {
    productSelect: '11111',
    step: '',
    range: {
      start: '',
      end: '',
    },
    price: '',
    priceDiscount: '',
    toUser: '',
  };

  compon = PrecioProdListComponent;
  file1 = true;
  file2 = false;
  file3 = false;
  file4 = false;
  file5 = false;
  numeroFilas = 1;

  constructor(
    private route: ActivatedRoute,
    private productServices: ProductService,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
    const valor = new PrecioProdListComponent();
    this.listado = valor.listOfIDs();

    this.formPrices = this.fb.group({
      productSelect: ['11111', [Validators.required]],
      step: ['', [Validators.required]],
      range: this.fb.group({
        start: ['', [Validators.required]],
        end: ['', [Validators.required]],
      }),
      price: ['', [Validators.required]],
      priceDiscount: [],
      toUser: ['', [Validators.required]],
    });

    this.form = this.fb.group({
      prices: this.fb.array([]),
    });
  }

  async ngOnInit() {
    const result = this.route.snapshot.params.prod;
    // this.productServices.getAllProducts();
  // this.productServices.getProductsByUser().subscribe();

    this.productServices
      .getProductSlug(result)
      .pipe(
        debounceTime(1000),
       // tap(x => console.log(x)),
        map((resol) => resol[0]),
        tap((x) => {
          this.product = x;
          this.productName = of(x.name);
        })
      )
      .subscribe();

    fromEvent(document.getElementById('tpg1'), 'click')
      .pipe(
        debounceTime(100),
        distinctUntilChanged((prev, curr) => prev.target === curr.target)
      )

      .subscribe((x: any) => {
        // console.log(x.target.id);
        if (!x.target.id) {
          return;
        }
        if (x === undefined) {
          return;
        }
        const text = x.target.id;
        // console.log(text);
        const lugar = text.split('-')[2];
        //const usuario = text.split('-')[1];

        const item = this.listadoIDS.filter(
          (resp: any) => resp.id === x.target.id
        );

        // fromEvent(document.getElementById(x.target.id), 'keyup').subscribe(
        //   (r) => {
        //     const target = r.target as HTMLButtonElement;
        //     console.log(target.value);
        //   }
        // );

        fromEvent(document.getElementById(x.target.id), 'change')
          .pipe(pluck('target', 'value'))
          .subscribe((res: any) => {
            //  console.log(res);
            if (lugar === 's') {
              item[0].start = res;
            } else if (lugar === 'e') {
              item[0].end = res;
            } else if (lugar === 'p') {
              item[0].price = res;
            } else if (lugar === 'e') {
              item[0].end = res;
            }
            //  else if (lugar === 'd') {
            //   item[0].discount = res;
            // }
          });
      });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get arrayOfPrices() {
    return this.form.controls.prices as FormArray;
  }

  // Funcio legavy
  addFileTable() {
    this.tpreciosG.push({
      item: this.tpreciosG.length + 1,
      pre: `gen${this.tpreciosG.length + 1}`,
    });
  }
  // Funcio legavy
  deleteFileTable() {
    this.tpreciosG.pop();
  }

  selectRango($event) {
    this.numeroFilas = $event.target.value;
    // console.log($event.target.value);

    this.isDisabled = false;
  }

  selectVendedor(e: CustomEvent, valor: string) {
    this.isOk = false;
    const vendedor = this.sellers.filter((x) => x.name === valor);

    this.isDisabled = false;
    vendedor[0].check = e.detail.checked;
  }

  generarMatrix() {
    this.isOk = true;
    this.showLoading();
    this.form.reset({ prices: [] });
    // console.log(this.numeroFilas);
    if (this.numeroFilas * 1 === 1) {
      this.file1 = true;
      this.file2 = false;
      this.file3 = false;
      this.file4 = false;
      this.file5 = false;
    }
    if (this.numeroFilas * 1 === 2) {
      this.file1 = true;
      this.file2 = true;
      this.file3 = false;
      this.file4 = false;
      this.file5 = false;
    }
    if (this.numeroFilas * 1 === 3) {
      this.file1 = true;
      this.file2 = true;
      this.file3 = true;
      this.file4 = false;
      this.file5 = false;
    }
    if (this.numeroFilas * 1 === 4) {
      this.file1 = true;
      this.file2 = true;
      this.file3 = true;
      this.file4 = true;
      this.file5 = false;
    }
    if (this.numeroFilas * 1 === 5) {
      this.file1 = true;
      this.file2 = true;
      this.file3 = true;
      this.file4 = true;
      this.file5 = true;
    }

    const sellFilter = this.sellers.filter((x) => x.check === true);
    const seller = sellFilter.map((x) => x.name);
    const lista = [];
    seller.forEach((x) => {
      const nuevo = this.listado.filter(
        (y) => y.user === x && y.step <= this.numeroFilas
      );
      // console.log(nuevo);
      lista.push(...nuevo);
      this.listadoIDS = lista;
    });

    this.isDisabled = true;

    this.formPrices.get('productSelect').setValue(this.product.id);
  }

  postPrices() {
    const sellFilter = this.sellers.filter((x) => x.check === true);
    const seller = sellFilter.map((x) => x.name);
    //console.log(seller);
    //Filtra los vendedores seleccionados y los añadde en semento
    const segmento = [];
    seller.forEach((x) => {
      const xxx = this.listadoIDS.filter(
        (y) => y.step <= this.numeroFilas && y.user === x
      );
      segmento.push(...xxx);
    });

    // console.log('segmento', segmento);

    segmento.forEach((x) => {
      // console.log(x);

      if (x.end !== undefined) {
        // this.formPrices.get('range').get('start').setValue(x.start);
        this.formPrices.get('range').get('end').setValue(x.end);
        //console.log('eend', x.end); OK
      }

      if (x.price !== undefined) {
        this.formPrices.get('price').setValue(x.price);
        // console.log('price', x.price);
      }
      if (x.start !== undefined) {
        this.formPrices.get('step').setValue(x.step);
        this.formPrices.get('toUser').setValue(x.user);
        this.formPrices.get('range').get('start').setValue(x.start);
        //  console.log('start', x.start);
      }

      if (this.formPrices.valid) {
        // console.log('valido');
        this.pricesArray.push(this.formPrices.value);
        this.arrayOfPrices.push(
          this.fb.control(this.pricesArray[this.pricesArray.length - 1])
        );
        this.formPrices.reset(this.pricesReset);
        this.formPrices.get('productSelect').setValue(this.product.id);
        // console.log('formPrices', this.formPrices.value);
      }
    });

    const precios = this.form.get('prices').value;
    console.log('precios', precios);
    const result = precios.filter((x) => x !== null);
    //console.log('resultat', result);
    if (result.length === 0) {
      console.log('No hay ningun precio');
      return;
    } else {
      this.productServices.postPrecios(result);
    }
  }

  routerRetro() {
    this.router.navigate(['/user']);
  }
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Creado Matriz de precios',
      duration: 600,
    });

    loading.present();

    loading.onDidDismiss().then(() => {
      this.matrix = true;
    });
  }
}
