/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProductService } from 'src/app/services/product.service';
import { CategoriaGet } from 'src/model/categoria.model';

import { SubcategoriaGet } from 'src/model/subcategoria.model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  public formFeature: FormGroup;
  public formProduct: FormGroup;
  public featureArray: Array<[]> = [];
  public categorias$: Observable<CategoriaGet[]>;
  public subcategor$: Observable<SubcategoriaGet[]>;

  public alertButtons = ['OK'];

  public form = this.fb.group({
    name: [''],
    categoria: [''],
    subcategoria: [''],
    description: ['Este producto ..'],
    features: this.fb.array([]),
    unidadprice: ['S/'],
    image1: [],
    image2: [],
    image3: [],
    tienda: ['cintas-panda'],
    count: [0],
    countByBox: [0],
    nota: ['ok'],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoriasService: CategoriaService,
    private productService: ProductService
  ) {
    this.formProduct = this.fb.group({
      name: ['', Validators.required],
      categoria: ['', Validators.required],
      subcategoria: ['', Validators.required],
      description: ['Este producto ..', Validators.required],
      features: this.fb.array([]),
      // priceCentiCaja: ['00.00', [Validators.required, Validators.min(0)]],
      unidadprice: ['S/', Validators.required],
      image1: [],
      image2: [],
      image3: [],
      tienda: ['cintas-panda', [Validators.required]],
      count: [0, [Validators.required, Validators.min(0)]],
      countByBox: [0, [Validators.required, Validators.min(0)]],
      nota: ['ok'],
    });

    this.formFeature = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.categorias$ = this.categoriasService.getCategorias();
  }

  get caracteristicas() {
    return this.formProduct.controls.features as FormArray;
  }

  getAllSubcateXcategoria(x: CustomEvent) {
    this.subcategor$ = this.categoriasService.getSubcategoriasLocal(
      x.detail.value
    );
  }

  addViewFeature() {
    this.featureArray.push(this.formFeature.value);

    this.caracteristicas.push(
      this.fb.control(this.featureArray[this.featureArray.length - 1])
    );
  }

  deleteItemArrayFeature(item: number) {
    this.caracteristicas.removeAt(item);
  }

  postProduct() {
    this.productService.postProducto(this.formProduct.value);
  }

  routerLinkRetro() {
    this.router.navigate(['/user']);
  }
}
