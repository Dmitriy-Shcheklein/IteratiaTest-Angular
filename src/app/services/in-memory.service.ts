import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

export interface ICars {
  id: number;
  name: string;
}
export interface IformData {
  selectCrane: string;
  employeeName: string;
  dateStart: Date;
  dateEnd: Date;
  firstCrane: ICrane[];
  secondCrane: ICrane[];
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
export class InMemoryService implements InMemoryDbService {

  // имитация сервера
  createDb() {

    const cars: ICars[] = [
      { id: 1, name: 'Грузовик 1' },
      { id: 2, name: 'Грузовик 2' },
      { id: 3, name: 'Грузовик 3' },
      { id: 4, name: 'Грузовик 4' },
      { id: 5, name: 'Грузовик 5' },
      { id: 6, name: 'Грузовик 6' },
    ]

    const formData: IformData[] = [];

    return { cars, formData }
  }

  constructor() { }

}
