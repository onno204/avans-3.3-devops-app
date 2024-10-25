/* eslint-disable @typescript-eslint/no-explicit-any */
export interface iRepository<T> {
  getAll(): Array<T>;
  getById(id: any): T | null;
  getByVariable(variable: string, value: any): T | null;

  add(item: any): T;
  update(item: any): T | any;
  delete(id: any): boolean;
  getType(): any;
}
