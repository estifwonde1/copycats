import { Injectable } from '@angular/core';
import { StoreConfig, EntityState, EntityStore } from '@datorama/akita';
import { MenuItem } from 'primeng/api';

export interface MenuState extends EntityState<MenuItem> {}


@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'menu' })
export class MenuStore extends EntityStore<MenuState> {
  constructor() {
    super();
  }

}
