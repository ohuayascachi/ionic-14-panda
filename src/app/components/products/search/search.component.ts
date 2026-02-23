import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule]
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
