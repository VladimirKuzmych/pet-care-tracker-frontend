export interface Pet {
  id?: number;
  name: string;
  breed: string;
  kind: 'dog' | 'cat' | 'other';
  customKind?: string;
}
