import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CategoriaGet } from 'src/model/categoria.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, pluck, shareReplay, tap } from 'rxjs/operators';
import { SubcategoriaGet } from 'src/model/subcategoria.model';

const server = environment.serverDev;

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private subjectCateg = new BehaviorSubject<CategoriaGet[]>([]);
  private subjectSubca = new BehaviorSubject<SubcategoriaGet[]>([]);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public dataCateg$: Observable<CategoriaGet[]> =
    this.subjectCateg.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public dataSubca$: Observable<SubcategoriaGet[]> =
    this.subjectSubca.asObservable();

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<CategoriaGet[]> {
    // console.log('categorias');
    return this.http

      .get<{ item: CategoriaGet[]; msg: string; count: number }>(
        `${server}/categorias/all`
      )
      .pipe(
        shareReplay(),
        map((resp) => resp.item),
        tap((x) => this.subjectCateg.next(x))
      );
  }

  getSubcategoriasLocal(categID: string): Observable<SubcategoriaGet[]> {
    return this.dataCateg$.pipe(
      map((resp) => resp.filter((res) => res.id === categID)),
      map((x) => x[0].subc),
      // tap((x) => console.log(x))
      tap((x: SubcategoriaGet[]) => this.subjectSubca.next(x))
    );
  }
}
