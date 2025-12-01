export interface Pet {
  id?: string;
  name: string;
  breed: string;
  kind: 'dog' | 'cat' | 'other';
  customKind?: string;
}
