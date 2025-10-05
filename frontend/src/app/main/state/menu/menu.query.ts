import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Menu } from '../../models/menu.model';
import { MenuStore, MenuState } from '../menu/menu.store';

@Injectable({ providedIn: 'root' })
export class MenuQuery extends QueryEntity<MenuState> {

  constructor(protected store: MenuStore) {
    super(store);
  }

  transformMenu(menus: Menu[] | undefined) {
    const items: any[] = [];
    if (menus && menus.length > 0) {
      menus.forEach((menu) => {
        const m: any = {};
        m['label'] = menu.label;
        m['icon'] = menu.icon;
        m['expanded'] = true;
        if (menu.menu_items && menu.menu_items.length > 0) {
          const children: any[] = [];
          menu.menu_items.forEach((child: Menu) => {
            children.push({
              label: child.label,
              icon: child.icon,
              routerLink: child.route,
              routerLinkActiveOptions: { exact: true}
            });
          });
          m['items'] = children;
        }
        items.push(m);
      });
    }
    return items;
  }

  selectMenuItems(): Observable<MenuItem[]> {
    return this.selectAll().pipe(
      map((items: any) => this.transformMenu(items))
    );
  }

}
