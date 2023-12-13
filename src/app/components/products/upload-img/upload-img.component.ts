import { Component, OnInit } from '@angular/core';
import { CategoriaService } from 'src/app/services/categoria.service';
import { FuncionesService } from 'src/app/services/funciones.service';
import { ProductService } from 'src/app/services/product.service';
import { CategoriaGet } from 'src/model/categoria.model';
import { ProductGet } from 'src/model/product.model';
import { SubcategoriaGet } from 'src/model/subcategoria.model';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
// import type { Animation } from '@ionic/angular';

@Component({
  selector: 'app-upload-img',
  templateUrl: './upload-img.component.html',
  styleUrls: ['./upload-img.component.scss'],
})
export class UploadImgComponent implements OnInit {
  //OBSERVABLES
  public categorias$: Observable<CategoriaGet[]>;
  public subcategorias$: Observable<Partial<SubcategoriaGet>[]>;
  public productos$: Observable<Partial<ProductGet>[]>;

  // variables
  public categoria: CategoriaGet;
  public ima1: string;
  public ima2: string;
  public ima3: string;
  public ima4: string;
  public ima5: string;
  public loading1 = false;
  public loading2 = false;
  public loading3 = false;
  public loading4 = false;
  public loading5 = false;
  public prodId: string;

  //vARIABLES DE ANIMACION
  private animation: Animation;

  constructor(
    public funcionesService: FuncionesService,
    private categoriaService: CategoriaService,
    private productService: ProductService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    //Get all products
    // this.productService.getAllProducts();
    // this.productos$ = this.productService.dataPrAll$;

    //GET ALL CATEGORIAS
    this.categoriaService.getCategorias().subscribe();
    this.categorias$ = this.categoriaService.dataCateg$.pipe(
      //tap((x) => console.log(1, x)),
      map((resp) => resp.filter((x) => x.cantidadProduc > 0))
    );
    // setTimeout(() => {
    //   this.productos$.pipe(tap((x) => console.log(x))).subscribe();
    // }, 100);
  }

  selectProdByCategoria(e: Event) {
    //  console.log(e);
    const target = e.target as HTMLButtonElement;

    if (!target.value) {
      console.log('No hay ID en la pedición');
      return;
    }
    this.prodId = null;

    //get all products
    //this.productService.getAllProducts();


    this.productos$ = this.productService.getProductsByUser().pipe(
      map((resp) => resp.filter((x) => x.categoria === target.value)),
      tap( x => console.log(x))
      // map((resp) => resp.map( x => x.costo[0].cost.map( t => t) ))
    );

    const cate$ = this.categorias$.pipe(
      map((resp) => resp.find((x) => x.id === target.value)),
      tap((x) => (this.categoria = x))
    );

    this.subcategorias$ = cate$.pipe(
      map((resp) => resp.subc),
      map((res: Partial<SubcategoriaGet>[]) =>
        res.filter((x) => x.products.length > 0)
      )
    );
  }

  selectProdBySubCategoria(e: Event) {
    const target = e.target as HTMLButtonElement;
    console.log('sub', target.value);
    //this.productService.getAllProducts();
    const subca$ = this.subcategorias$.pipe(
      map((resp) => resp.filter((x) => x.id === target.value))
    );
    this.prodId = null;
    console.log('cat', this.categoria.id);
    this.productos$ = this.productos$.pipe(
      map((resp) =>
        resp.filter(
          (x) =>
            x.categoria === this.categoria.id && x.subcategoria === target.value
        )
      )
    );
  }

  selectProduct(e: any) {
    const target = e.target as HTMLButtonElement;

    if (target.value === 'none') {
      this.clearImgs();
      return console.log('No se ha seleccionado producto');
    }

    this.productService
      .getProductIdFromServer(target.value)
      .pipe(
        tap((x) => {
          if (x === undefined || x === null) {
            return;
          } else {
            //console.log(x);
            this.prodId = x.id;
            this.ima1 =
              x.image1.imgLarge || x.image1.imgMediun || x.image1.imgSmall;
            this.ima2 =
              x.image2.imgLarge || x.image2.imgMediun || x.image2.imgSmall;
            this.ima3 =
              x.image3.imgLarge || x.image3.imgMediun || x.image3.imgSmall;
            this.ima4 =
              x.image4.imgLarge || x.image4.imgMediun || x.image4.imgSmall;
            this.ima5 =
              x.image5.imgLarge || x.image5.imgMediun || x.image5.imgSmall;
          }
        })
      )
      .subscribe();
  }
  uploadImg(e: Event, lugar: string) {
    if (!this.prodId) {
      return this.presentAlert();
    }
    //console.log(e, lugar, this.prodId);

    const file = (e.target as HTMLInputElement).files[0];

    this.seleccionarCampo(lugar, true);

    this.productService
      .uploadImgProduct(this.prodId, file, lugar)
      .subscribe((resp) => {
        this.seleccionarCampo(lugar, false, resp);
      });
  }

  deleteImg(num: string) {
    if (!this.prodId) {
      return this.presentAlert();
    } else {
      this.seleccionarCampo(num, true);
      this.productService
        .patchDelteImage(this.prodId, num)
        .subscribe((resp) => {
          console.log(resp);
          this.seleccionarCampo(num, false, resp);
        });

      // if (num === 'image1') {
      //   this.loading1 = true;

      //     this.loading1 = false;

      // } else if (num === 'image2') {
      //   this.ima2 = null;
      // } else if (num === 'image3') {
      //   this.ima3 = null;
      // } else if (num === 'image4') {
      //   this.ima4 = null;
      // } else if (num === 'image5') {
      //   this.ima5 = null;
      // }
    }
  }

  // Funcion de ayuda

  seleccionarCampo(parte: string, status: boolean, item?: ProductGet) {
    //  console.log('aqui');
    if (parte === 'image1') {
      if (item) {
        this.ima1 = item.image1.imgMediun;
      }

      this.loading1 = status;
    } else if (parte === 'image2') {
      if (item) {
        this.ima2 = item.image2.imgMediun;
      }
      this.loading2 = status;
    } else if (parte === 'image3') {
      if (item) {
        this.ima3 = item.image3.imgMediun;
      }

      this.loading3 = status;
    } else if (parte === 'image4') {
      if (item) {
        this.ima4 = item.image4.imgMediun;
      }

      this.loading4 = status;
    } else if (parte === 'image5') {
      if (item) {
        this.ima5 = item.image5.imgMediun;
      }

      this.loading5 = status;
    }
  }

  clearImgs() {
    this.ima1 = null;
    this.ima2 = null;
    this.ima3 = null;
    this.ima4 = null;
    this.ima5 = null;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'No se ha seleccionado producto',
      // message: 'A message should be a short, complete sentence.',
      buttons: ['ok'],
    });

    await alert.present();
  }

  //ANIMATION
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  // ngAfterViewInit() {
  //   console.log('animas');
  //   this.animation = this.animationCtrl
  //     .create()
  //     .addElement(document.querySelector('.img-uno-1'))
  //     .duration(3000)
  //     .iterations(Infinity)
  //     .fromTo('transform', 'translateX(0px)', 'translateX(100px)')
  //     .fromTo('opacity', '3', '0.2');
  //     .trans
  // }

  // play() {
  //   this.animation.play();
  // }
}

// if (lugar === 'image1') {
//   this.loading1 = true;
// } else if (lugar === 'image2') {
//   this.loading2 = true;
// } else if (lugar === 'image3') {
//   this.loading3 = true;
// } else if (lugar === 'image4') {
//   this.loading4 = true;
// } else if (lugar === 'image5') {
//   this.loading5 = true;
// }

// setTimeout(() => {
//   // this.ima2 = '../../../../assets/img/products/medium_1_big_f3d14c6d9e.jpg';
// }, 2000);

// if (lugar === 'image1') {
//   this.ima1 = resp.image1.imgMediun;
//   this.loading1 = false;
// } else if (lugar === 'image2') {
//   this.ima2 = resp.image2.imgMediun;
//   this.loading2 = false;
// } else if (lugar === 'image3') {
//   this.ima3 = resp.image3.imgMediun;
//   this.loading3 = false;
// } else if (lugar === 'image4') {
//   this.ima4 = resp.image4.imgMediun;
//   this.loading4 = false;
// } else if (lugar === 'image5') {
//   this.ima5 = resp.image5.imgMediun;
//   this.loading5 = false;
// }

// this.loading1 = false;
// this.loading2 = false;
// this.loading3 = false;
// this.loading4 = false;
// this.loading5 = false;
// console.log(target.value);
// this.productos$ = this.productos$.pipe(
//   map((resp) => resp.filter((x) => x.id === target.value))
// );
