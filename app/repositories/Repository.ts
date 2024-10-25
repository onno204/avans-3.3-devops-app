/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { iRepository } from './iRepository';

export class Repository<T> implements iRepository<T> {
  // In memory repository
  private repository: Array<T> = new Array<T>();

  Prop: T;
  constructor(prop: T) {
    this.Prop = prop;
  }

  getType(): T {
    return this.Prop;
  }

  getAll(): T[] {
    return this.repository;
  }

  getById(id: any): T | null {
    let result: T | null = null;
    this.repository.forEach((element: any, index) => {
      if (element['id'] === id) {
        result = element;
      }
    });
    return result;
  }

  getByVariable(variable: string, value: any): T | null {
    let result: T | null = null;
    this.repository.forEach((element: any, index) => {
      if (element[variable] === value) {
        result = element;
      }
    });
    return result;
  }

  add(item: any): T {
    this.repository.push(item);
    return item;
  }

  update(item: any): T | null {
    let result: T | null = null;
    this.repository.forEach((element: any, index) => {
      if (element['id'] === item['id']) {
        this.repository[index] = item;
        result = item;
      }
    });
    return result;
  }

  delete(id: any): boolean {
    let result: boolean = false;
    this.repository.forEach((element: any, index) => {
      if (element['id'] === id) {
        this.repository.splice(index, 1);
        result = true;
      }
    });
    return result;
  }
}
