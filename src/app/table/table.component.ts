import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FetchService } from '../services/fetch.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  // инициализируем необходимые переменные

  data: any[] = [];

  index: number = -1


  // возвращаем родителю инфу о событии
  @Input() modalShow!: boolean

  @Output() isModal = new EventEmitter<boolean>()
  modal(changed: boolean) {
    this.isModal.emit(changed)
  }

  constructor(private fetchService: FetchService) { }

  // собираем инфу по данным из сервиса
  ngOnInit(): void {
    this.getData()
  }

  getData = () => {
    this.data = this.fetchService.formData
  }
  // удаляем строки
  deleteRow = (idx: number) => {
    this.fetchService.formData.splice(idx, 1)
  }

  // создаем событие и с помощью сервиса слушаем его в FormComponent
  editForm = (idx: number, event: MouseEvent) => {
    this.fetchService.tableIndex = idx;
    this.modal(this.modalShow);
    this.fetchService.editFormClick(event)
  }

}
