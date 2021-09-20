import { HttpClient } from '@angular/common/http';
import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchService } from '../services/fetch.service';
import { ICars } from '../services/fetch.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit, DoCheck {

  //Определяем необходимые переменные
  loaded: number | null = null;
  unloaded: number | null = null;

  focusStartDate: boolean = false;
  focusEndDate: boolean = false;

  trucks: ICars[] = [];

  form: FormGroup = new FormGroup({});

  disableSelect: boolean = false;

  //передаем колбэк в родителя для открытия и закрытия модалки
  @Input() modalShow: boolean = false;

  @Output() isModal = new EventEmitter()
  modal(changed: boolean) {
    this.isModal.emit(changed)
  };

  //Вызываем в конструкторе необходимые сервисы
  constructor(private fetchService: FetchService,
    private fb: FormBuilder,
    private http: HttpClient) {
    fetchService.getCars().subscribe(cars => this.trucks = cars)
  }


  ngOnInit() {
    // слушаем событие onClick по кнопкее редактирования таблицы в tablecomponent
    this.fetchService.event$.subscribe(
      (event) => this.eventChecker(event)
    )
    //инициализируем реактивную форму
    this.form = this.fb.group({
      selectCrane: this.fb.control('', [
        Validators.required
      ]),
      employeeName: this.fb.control('', [
        Validators.required,
        Validators.pattern(/[А-я]/)
      ]),
      dateStart: this.fb.control('', [
        Validators.required,
      ]),
      dateEnd: this.fb.control('', [
        Validators.required,
      ]),
      firstCrane: this.fb.array([]),
      secondCrane: this.fb.array([]),
    })
    //добавляем в FormArray первые группы
    this.addCrane(this.firstCrane, this.secondCrane);
  }

  ngDoCheck() {

    // при каждои изменении формы считаем погруженный и выгруженный груз
    this.loaded = this.loadedCalc()

    this.unloaded = this.unLoadedCalc()
  }
  // вызываем форму при нажатии на кнопку редактирвоания в таблице
  // и заполняем редактируемые данные
  eventChecker = (event: MouseEvent) => {
    let id = this.fetchService.tableIndex
    this.disableSelect = true;
    this.form.patchValue({
      selectCrane: this.fetchService.formData[id].selectCrane,
      employeeName: this.fetchService.formData[id].employeeName,
      dateStart: this.fetchService.formData[id].dateStart,
      dateEnd: this.fetchService.formData[id].dateEnd,
    })
  }

  buildFormGroup = () => {
    return this.fb.group({
      selectTruck: [''],
      loaded: [null, [Validators.pattern(/[0-9]/)]],
      unloaded: [null, [Validators.pattern(/[0-9]/)]],
    })
  }

  get firstCrane() {
    return this.form.get('firstCrane') as FormArray
  }
  get secondCrane() {
    return this.form.get('secondCrane') as FormArray
  }
  // метод для добавления новых формгрупп в форме
  addCrane = (...args: FormArray[]) => {
    args.forEach(crane => {
      crane.push(
        this.buildFormGroup()
      );
    })
  }
  // разрешаем добавление если ивент проходит толкьо на последней формгруппе 
  onAddForminArray = (event: any, idx: number, crane: FormArray) => {
    if (event.target.value && crane.controls.length - 1 === idx) {
      this.addCrane(crane)
    }
  }
  //удаляем форм группу
  deleteFormGroup = (idx: number, crane: FormArray) => {
    if (crane.controls.length > 1) {
      crane.removeAt(idx)
    }
  }
  //считаем груз
  loadedCalc = () => {
    return (this.firstCrane.value
      .reduce((acc: number, curr: any) => acc + curr.loaded, 0)
      +
      this.secondCrane.value
        .reduce((acc: number, curr: any) => acc + curr.loaded, 0)
    )
  }

  unLoadedCalc = () => {
    return (this.firstCrane.value
      .reduce((acc: number, curr: any) => acc + curr.unloaded, 0)
      +
      this.secondCrane.value
        .reduce((acc: number, curr: any) => acc + curr.unloaded, 0)
    )
  }
  // меняем значения переменных для отображения placeholder или даты на input даты
  changeTypeFocusStart = () => {
    this.focusStartDate = true
  }
  changeTypeBlurStart = () => {
    this.focusStartDate = false
  }
  changeTypeFocusEnd = () => {
    this.focusEndDate = true
  }
  changeTypeBlurEnd = () => {
    this.focusEndDate = false
  }
  //скрываем при submit модалку, сбрасываем форму и возвращаем ее в первоначальнео состояние
  additionalSubmitAction = () => {
    this.modal(this.modalShow);
    this.fetchService.form = this.form
    this.form.reset();
    this.ngOnInit();
    this.disableSelect = false;
  }
  // submit форму сохраняем данные из формы в сервисе,
  //либо сохраняем отредактированные данные в сервисе
  onSubmit = () => {

    this.form.value.loaded = this.loaded
    this.form.value.unloaded = this.unloaded
    if (this.fetchService.tableIndex === -1) {
      this.fetchService.formData.push(this.form.value);
      this.fetchService.setForm()
        .subscribe(form => {
          console.log('FORM', form)
        })
      this.additionalSubmitAction()

    } else {
      this.fetchService.formData[this.fetchService.tableIndex] = this.form.value;
      this.fetchService.tableIndex = -1;
      this.additionalSubmitAction()
    }
  }
}


