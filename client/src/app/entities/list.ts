import { Card } from './card';

export interface List {
  id: string;
  name: string;
  position: number;
  cards: Card[];
}
