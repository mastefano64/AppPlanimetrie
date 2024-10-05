import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AppMaterialModule } from '../../app-material.module';
import { MatSelectChange } from '@angular/material/select';

import { FloorPlansMapComponent } from '../../floorplansmap/component/floor-plans-map/floor-plans-map.component';
import { FloorPlansOptions } from '../../floorplansmap/_model/floor-plans-options';
import { ManagerTestFloorPlansService } from '../../service/manager-test-floor-plans.service';
import { FloorPlansPoint } from '../../floorplansmap/_model/floor-plans-point';
import { ZoomValueArg } from '../../floorplansmap/_model/zoom-value-arg';

@Component({
    selector: 'app-page03',
    templateUrl: './page03.component.html',
    styleUrls: ['./page03.component.scss'],
    standalone: true,
    imports: [
      FormsModule,
      AppMaterialModule,
      FloorPlansMapComponent
    ],
    providers:[ ManagerTestFloorPlansService ]
})
export class Page03Component implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('floorplans') floorplans: FloorPlansMapComponent;
  selectedfloorplans = 'planimetria2';
  selectcontentposition = 'center';
  imagefloorplans: HTMLImageElement;
  options: FloorPlansOptions;
  zoomLevel: number;
  sub: Subscription;

  #floorplans = signal<FloorPlansPoint[]>([]);

  constructor(private service: ManagerTestFloorPlansService) { }

  ngOnInit(): void {
    this.options = new FloorPlansOptions();
    this.options.widthMeters = 19.20;
    this.options.heightMeters = 10.96;
    this.options.contentPosition = 'center';

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
    this.options.anchorRtlsPoint.push(a1);

    const t1 = new FloorPlansPoint();
    t1.id = 't1';
    t1.name = 'transit1';
    t1.metersX = 3;
    t1.metersY = 7;
    t1.type = 'transit';
    t1.typeMovement = 'fix';
    t1.enableCallbackEvent = true;
    this.options.transitRfidPoint.push(t1);

    this.options.callbackZoom = (zoom: ZoomValueArg) => {
      this.zoomLevel = zoom.zoomValue;
    };
    this.options.callbackClickAckanchorRtls = (marker) => {
      alert(marker.id);
    };
    this.options.callbackClickTransitRfid = (marker) => {
      alert(marker.id);
    };
    this.options.callbackClickPoint = (marker) => {
      alert(marker.id);
    };

    this.sub = this.service.pointSubjectAsync.subscribe(result => {
      this.#floorplans.set(result);
      this.floorplans.drawFloorPlanMarker(result);
      // this.floorplans.drawFloorPlanTest(result);
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

  onSelectedContentPosition(event: MatSelectChange): void {
    const value = event.value;
    switch (value) {
      case ('top-left'): {
        this.floorplans.setContentPosition('top-left');
        break;
      }
      case ('top-right'): {
        this.floorplans.setContentPosition('top-right');
        break;
      }
      case ('bottom-left'): {
        this.floorplans.setContentPosition('bottom-left');
        break;
      }
      case ('bottom-right'): {
        this.floorplans.setContentPosition('bottom-right');
        break;
      }
      case ('center'): {
        this.floorplans.setContentPosition('center');
        break;
      }
      default: {
        alert('content-align not found');
        break;
      }
    }
  }

  loadImage(filename: string): void {
    this.imagefloorplans = new Image();
    this.imagefloorplans.src = filename;
    this.imagefloorplans.onload = (event) => {
      this.floorplans.createFloorPlan(this.imagefloorplans, this.options);
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
