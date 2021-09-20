import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  // отправляем событие родителю

  @Input() modalShow!: boolean

  @Output() isModal = new EventEmitter<boolean>()
  modal(changed: boolean) {
    this.isModal.emit(changed);
  }

  constructor() {
  }

}
