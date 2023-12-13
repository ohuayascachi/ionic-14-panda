import { Component, OnInit } from '@angular/core';
import { FuncionesService } from 'src/app/services/funciones.service';

@Component({
  selector: 'app-simulacion',
  templateUrl: './simulacion.component.html',
  styleUrls: ['./simulacion.component.scss'],
})
export class SimulacionComponent implements OnInit {
  constructor(public funcionesService: FuncionesService) {}

  ngOnInit() {}

  routerRetro() {}
}
