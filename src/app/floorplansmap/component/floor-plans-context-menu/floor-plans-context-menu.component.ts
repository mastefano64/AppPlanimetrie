import { Component, input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

import { AppMaterialModule } from '../../../app-material.module';

import { ContextMenu } from '../../_model/floor-plans-options';
import { Marker } from '../../_model/floor-plans-point';
import { MenuItemArg } from '../../_model/menu-item-arg';
import { cloneDeep } from 'lodash-es';

@Component({
    selector: 'app-floor-plans-context-menu',
    templateUrl: './floor-plans-context-menu.component.html',
    styleUrls: ['./floor-plans-context-menu.component.scss'],
    standalone: true,
    imports: [
      AppMaterialModule,
      NgClass, NgStyle,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorPlansContextMenuComponent implements OnInit, OnDestroy {
  marker = input<Marker>(null);
  @Output() clickitem = new EventEmitter<MenuItemArg>();

  constructor() { }

  ngOnInit(): void {

  }

  onClickMenuItem(menuitem: ContextMenu, marker: Marker): void {
    const args = new MenuItemArg();
    args.menuitem = cloneDeep(menuitem);
    args.marker = cloneDeep(marker);
    this.clickitem.emit(args);
  }

  ngOnDestroy(): void {

  }
}
