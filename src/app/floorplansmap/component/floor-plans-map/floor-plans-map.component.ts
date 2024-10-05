import { Component, ViewChild, ElementRef, Input, OnInit, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

import { AppMaterialModule } from '../../../app-material.module';

import { FloorPlansContextMenuComponent } from '../floor-plans-context-menu/floor-plans-context-menu.component';
import { FloorPlansBarComponent } from '../floor-plans-bar/floor-plans-bar.component';
import { FloorPlansMap } from '../../floor-plans-map';
import { FloorPlansOptions } from '../../_model/floor-plans-options';
import { FloorPlansPoint, Marker } from '../../_model/floor-plans-point';
import { IFloorPlansMap } from '../../Ifloor-plans-map';
import { MenuItemArg } from '../../_model/menu-item-arg';

@Component({
    selector: 'app-floor-plans-map',
    templateUrl: './floor-plans-map.component.html',
    styleUrls: ['./floor-plans-map.component.scss'],
    standalone: true,
    imports: [
      AppMaterialModule,
      FloorPlansContextMenuComponent,
      FloorPlansBarComponent,
      NgClass, NgStyle,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorPlansMapComponent implements IFloorPlansMap,  OnInit, OnDestroy {
  @ViewChild('containerRef', { read: ElementRef, static: true }) containerRef: ElementRef;
  @ViewChild('canvasRef', { read: ElementRef, static: true }) canvasRef: ElementRef;
  @Input() options: FloorPlansOptions;
  canvas: HTMLCanvasElement;
  imageplans: HTMLImageElement;
  fpr: FloorPlansMap
  floorplancreated = false;
  withCanvas = 0;
  heightCanvas = 0;
  context2d: any;

  menuVisible = signal<boolean>(false);
  contextmenuX = signal<string>(null);
  contextmenuY = signal<string>(null);
  marker = signal<Marker>(null);

  constructor() { }

  ngOnInit(): void {
    this.options._scrollContainer = this.containerRef.nativeElement;
  }

  createFloorPlan(imageplans: HTMLImageElement, options: FloorPlansOptions): void {
    this.floorplancreated = false;
    this.destroyFloorPlan();
    this.imageplans = imageplans;
    this.context2d = this.canvasRef.nativeElement.getContext('2d');
    this.canvas = this.canvasRef.nativeElement;

    this.withCanvas = this.imageplans.width;
    this.heightCanvas = this.imageplans.height;
    this.canvasRef.nativeElement.width = this.imageplans.width;
    this.canvasRef.nativeElement.height = this.imageplans.height;
    this.options = options;

    this.fpr = new FloorPlansMap(this, this.imageplans, this.canvas, this.context2d, options);
    this.fpr.drawFloorPlanImage();
    this.fpr.setContentPosition(options.contentPosition);

    this.floorplancreated = true;
  }

  addOverlay(id: string, position: string): void {
    this.fpr.addOverlay(id, position);
  }

  contextMenuOpenClose(visible: boolean, pointX: number, pointY: number, marker: Marker): void {
    this.menuVisible.set(visible);
    this.contextmenuX.set(`${pointX}px`);
    this.contextmenuY.set(`${pointY}px`);
    this.marker.set(marker);
  }

  onMenuItemSelected(item: MenuItemArg): void {
    alert(item.menuitem.name + ' - ' + item.marker.id);
  }

  onBarCommand(command: string): void {
    switch(command) {
      case 'zoom-plus': {
         this.zoomIncrement();
         break;
      }
      case 'zoom-minus': {
        this.zoomDecrement();
        break;
      }
      case 'zoom-reset': {
        this.resetZoom();
        break;
      }
      case 'zoom-fit': {
        this.zoomFloorPlanFit();
        break;
      }
      case 'clear-position': {
        this.resetContentPosition();
        break;
      }
      default: {
        this.setContentPosition(command);
        break;
      }
    }
  }

  enableBottomAxisX(value: boolean) {
    this.fpr.enableBottomAxisX(value);
  }

  enableLeftAxisY(value: boolean) {
    this.fpr.enableLeftAxisY(value);
  }

  enableTopAxisX(value: boolean) {
    this.fpr.enableTopAxisX(value);
  }

  enableRightAxisY(value: boolean) {
    this.fpr.enableRightAxisY(value);
  }

  enableGridOverlay(value: boolean) {
    this.fpr.enableGridOverlay(value);
  }

  drawFloorPlanMarker(listp: FloorPlansPoint[]): void {
    this.fpr.drawFloorPlanMarker(listp);
  }

  setContentPosition(position: string): void {
    this.fpr.setContentPosition(position);
  }

  gotoContentPosition(position: string): void {
    this.fpr.gotoContentPosition(position);
  }

  resetContentPosition(): void {
    this.fpr.resetContentPosition();
  }

  zoomFloorPlanFit(): void {
    this.fpr.zoomFloorPlanFit();
  }

  zoomIncrement(): void {
    this.fpr.zoomIncrement();
  }

  zoomDecrement(): void {
    this.fpr.zoomDecrement();
  }

  resetZoom(): void {
    this.fpr.resetZoom();
  }

  destroyFloorPlan(): void {
    if (this.fpr) {
      this.floorplancreated = false;
      this.fpr.destroy();
    }
  }

  ngOnDestroy(): void {
    this.destroyFloorPlan();
  }
}
