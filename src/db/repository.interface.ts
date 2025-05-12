export interface IRepository<T> {
  find(query: Partial<T>): Promise<T[]>;
  create(document: T): Promise<T>;
}
