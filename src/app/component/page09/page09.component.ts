import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AppMaterialModule } from '../../app-material.module';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AppGaugeModule } from '../../app-gauge.module';

import { FloorPlansMapComponent } from '../../floorplansmap/component/floor-plans-map/floor-plans-map.component';
import { FloorPlansOptions } from '../../floorplansmap/_model/floor-plans-options';
import { ManagerTestFloorPlansService } from '../../service/manager-test-floor-plans.service';
import { FloorPlansPoint } from '../../floorplansmap/_model/floor-plans-point';
import { ZoomValueArg } from '../../floorplansmap/_model/zoom-value-arg';
import { GaugeModule } from 'angular-gauge';

// https://github.com/naikus/svg-gauge
// https://www.npmjs.com/package/angular-gauge
// https://mattlewis92.github.io/angular-gauge/docs
// https://codepen.io/naikus/pen/BzZoLL

// https://stackoverflow.com/questions/53684763/how-to-remove-space-bottom-mat-form-field

@Component({
    selector: 'app-page09',
    templateUrl: './page09.component.html',
    styleUrls: ['./page09.component.scss'],
    standalone: true,
    imports: [
      FormsModule,
      AppMaterialModule,
      AppGaugeModule,
      FloorPlansMapComponent
    ],
    providers:[ ManagerTestFloorPlansService ]
})
export class Page09Component implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('floorplans') floorplans: FloorPlansMapComponent;
  selectedfloorplans = 'planimetria2';
  selectcontentposition = 'center';
  gotocontentposition = '9-6';
  imagefloorplans: HTMLImageElement;
  options: FloorPlansOptions;
  zoomLevel: number;
  sub: Subscription;

  showBottomAxisX = false;
  showLeftAxisY = false;
  showTopAxisX = false;
  showRightAxisY = false;
  showGridOverlay = false;

  #floorplans = signal<FloorPlansPoint[]>([]);
  v11 = signal<number>(null);
  v12 = signal<number>(null);
  v21 = signal<number>(null);
  v22 = signal<number>(null);

  constructor(private service: ManagerTestFloorPlansService) { }

  ngOnInit(): void {
    this.options = new FloorPlansOptions();
    this.options.widthMeters = 19.20;
    this.options.heightMeters = 10.96;
    this.options.contentPosition = 'center';
    this.options.anchorRtlsUnselectedGeometry = 'square';
    this.options.transitRfidUnselectedGeometry = 'rhombus';
    this.options.pointUnselectedGeometry = 'icon';
    this.options.anchorRtlsSelectedGeometry = 'square';
    this.options.transitRfidSelectedGeometry = 'rhombus';
    this.options.pointSelectedGeometry = 'icon';
    this.options.anchorRtlsSelectedRadius = 20;
    this.options.transitRfidSelectedRadius = 20;

    this.options.enablePanelOverlay = true;
    this.options.enableNavbar = true;
    this.options.enableNavbarZoom = true;
    this.options.enableNavbarPosition = true;
    this.options.alignNavbar = 'top-right';

    // this.options.topAxisX.visibleTopAxisX = true;
    // this.options.bottomAxisX.visibleBottomAxisX = true;
    // this.options.leftAxisY.visibleLeftAxisY = true;
    // this.options.rightAxisY.visibleRightAxisY = true;
    // this.options.gridOverlay.visibleGridOverlay = true;

    const a1 = new FloorPlansPoint();
    a1.id = 'a1';
    a1.name = 'ackanchor1'
    a1.metersX = 3;
    a1.metersY = 3;
    a1.type = 'anchor';
    a1.typeMovement = 'fix';
    a1.enableCallbackEvent = true;
    a1.contextMenu.push(
      {
        id: 'a1m1',
        name: 'Menu-1'
      }
    );
    a1.contextMenu.push(
      {
        id: 'a1m2',
        name: 'Menu-2'
      }
    );
    this.options.anchorRtlsPoint.push(a1);
    this.options.enableAnchorRtlsContextMenu = true;

    const t1 = new FloorPlansPoint();
    t1.id = 't1';
    t1.name = 'transit1';
    t1.metersX = 3 // 18;
    t1.metersY = 7;
    t1.type = 'transit';
    t1.typeMovement = 'fix';
    t1.enableCallbackEvent = true;
    t1.contextMenu.push(
      {
        id: 't1m1',
        name: 'Menu-1'
      }
    );
    t1.contextMenu.push(
      {
        id: 't1m2',
        name: 'Menu-2'
      }
    );
    this.options.transitRfidPoint.push(t1);
    this.options.enableTransitRfidContextMenu = true;

    this.options.enablePointContextMenu = true;

    this.options.callbackZoom = (zoom: ZoomValueArg) => {
      this.zoomLevel = zoom.zoomValue;
    };
    this.options.callbackClickAckanchorRtls = (marker) => {
      const str = `${marker.id} X:${marker.metersX} Y:${marker.metersY}`;
      alert(str);
    };
    this.options.callbackClickTransitRfid = (marker) => {
      const str = `${marker.id} X:${marker.metersX} Y:${marker.metersY}`;
      alert(str);
    };
    this.options.callbackClickPoint = (marker) => {
      const str = `${marker.id} X:${marker.metersX} Y:${marker.metersY}`;
      alert(str);
    };

    this.sub = this.service.pointSubjectAsync.subscribe(result => {
      // listp: FloorPlansPoint[]
      this.#floorplans.set(result);
      this.floorplans.drawFloorPlanMarker(result);
      const v1 = result.find(x => x.id === 'p1');
      if (v1) {
        this.v11.set(v1.pointMetadata[0].value);
        this.v12.set(v1.pointMetadata[1].value);
      }
      const v2 = result.find(x => x.id === 'p2');
      if (v2) {
        this.v21.set(v2.pointMetadata[0].value);
        this.v22.set(v2.pointMetadata[1].value);
      }
    });
  }

  ngAfterViewInit(): void {
    const filename = '/planimetria2.png';
    this.loadImage(filename);
  }

  onSelectedFloorPlans(event: MatSelectChange): void {
    const value = event.value;
    if (value === 'planimetria2') {
      const filename = '/planimetria2.png';
      this.loadImage(filename);
      this.service.resetFloorPlans()
    }
    if (value === 'planimetria3') {
      const filename = '/planimetria3.png';
      this.loadImage(filename);
      this.service.resetFloorPlans()
    }
  }

  onGotoContentPosition(event: MatSelectChange): void {
    const value = event.value;
    this.floorplans.gotoContentPosition(value);
  }

  onZoomFloorPlanFit(): void {
    this.floorplans.zoomFloorPlanFit();
  }

  onShowBottomAxisX(event: MatCheckboxChange): void {
    const value = event.checked;
    this.floorplans.enableBottomAxisX(value);
  }

  onShowLeftAxisY(event: MatCheckboxChange): void {
    const value = event.checked;
    this.floorplans.enableLeftAxisY(value);
  }

  onShowTopAxisX(event: MatCheckboxChange): void {
    const value = event.checked;
    this.floorplans.enableTopAxisX(value);
  }

  onShowRightAxisY(event: MatCheckboxChange): void {
    const value = event.checked;
    this.floorplans.enableRightAxisY(value);
  }

  onShowGridOverlay(event: MatCheckboxChange): void {
    const value = event.checked;
    this.floorplans.enableGridOverlay(value);
  }

  loadImage(filename: string): void {
    this.imagefloorplans = new Image();
    this.imagefloorplans.src = filename;
    this.imagefloorplans.onload = (event) => {
      this.floorplans.createFloorPlan(this.imagefloorplans, this.options);
      this.floorplans.addOverlay('overlay1', '6-9');
      this.floorplans.addOverlay('overlay2', '12-9');
      this.service.startPointFloorPlans();
    };
  }

  onZoomIncrement(): void {
    this.floorplans.zoomIncrement();
  }

  onZoomDecrement(): void {
    this.floorplans.zoomDecrement();
  }

  onResetZoom(): void {
    this.floorplans.resetZoom();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
