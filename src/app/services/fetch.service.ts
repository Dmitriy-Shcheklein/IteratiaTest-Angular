import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

export interface ICars {
  id: number;
  name: string;
}
export interface IformData {
  selectCrane?: string;
  employeeName?: string;
  dateStart?: Date;
  dateEnd?: Date;
  firstCrane?: ICrane[];
  secondCrane?: ICrane[];
  loaded?: number | null;
  unloaded?: number | null;
}
export interface ICrane {
  selectTruck: string;
  loaded: number;
  unloaded: number;
}

@Injectable({
  providedIn: 'root'
})
export class FetchService {

  // определяем необходимые переменные

  formData: any[] = [];

  tableIndex: number = -1;

  form: FormGroup = new FormGroup({});

  // назначаем адреса для имитации сервера

  private carsUrl = 'api/cars';

  private formUrl = 'api/serverData';

  // методы для обращения к серверу
  public getCars = (): Observable<ICars[]> => {
    return this.http.get<ICars[]>(this.carsUrl);
  }

  public setForm = (): Observable<IformData[]> => {
    return this.http.put<IformData[]>(this.formUrl, this.formData);
  }

  // метод для того чтобы в FormComponent слушать событие в TableComponent
  public event$ = new Subject<MouseEvent>();

  public editFormClick = (event: MouseEvent) => {
    this.event$.next(event);
  }

  constructor(private http: HttpClient) { }
}
