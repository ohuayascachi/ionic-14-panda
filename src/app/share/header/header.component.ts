import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnChanges, OnInit {
  @Input() title: string;
  @Input() iconName: string;
  @Input() count: number;
  @Output() pathRetro = new EventEmitter<string>();

  constructor() {}

  ngOnChanges(change: SimpleChanges) {
    // console.log('HEADER --', change);
  }
  ngOnInit() {
    // console.log(this.title);
  }

  pathToRetro() {
    this.pathRetro.emit(null);
  }
}
