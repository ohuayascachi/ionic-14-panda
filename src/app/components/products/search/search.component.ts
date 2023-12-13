import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Output() busqueda = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  handleInput(event) {
    const query = event.target.value.toLowerCase();
    this.busqueda.emit(query);
  }
}
