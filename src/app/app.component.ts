import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // управляем модалкой
  modalShow = false;

  constructor() {
  }

  ngOnInit() {
  }

  isModal = () => {
    this.modalShow = !this.modalShow;
  }

}
