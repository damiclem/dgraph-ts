export class Document<T, S extends Record<string, T>> {
  constructor(properties: S) {}
}
