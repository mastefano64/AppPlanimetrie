import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppMaterialModule } from '../../app-material.module';

import { FloorPlansMapComponent } from '../../floorplansmap/component/floor-plans-map/floor-plans-map.component';
import { FloorPlansOptions } from '../../floorplansmap/_model/floor-plans-options';
import { ManagerTestFloorPlansService } from '../../service/manager-test-floor-plans.service';
import { FloorPlansPoint } from '../../floorplansmap/_model/floor-plans-point';

@Component({
    selector: 'app-page01',
    templateUrl: './page01.component.html',
    styleUrls: ['./page01.component.scss'],
    standalone: true,
    imports: [
      AppMaterialModule,
      FloorPlansMapComponent
    ],
    providers:[ ManagerTestFloorPlansService ]
})
export class Page01Component implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('floorplans') floorplans: FloorPlansMapComponent;
  imagefloorplans: HTMLImageElement;
  options: FloorPlansOptions;
  sub: Subscription;

  #floorplans = signal<FloorPlansPoint[]>([]);

  constructor(private service: ManagerTestFloorPlansService) { }

  ngOnInit(): void {
    this.options = new FloorPlansOptions();
    this.options.widthMeters = 19.20;
    this.options.heightMeters = 10.96;
    this.options.contentPosition = 'center';

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

    // this.options.callbackZoom = (marker) => {
    //   alert('zoom');
    // };
    this.options.callbackClickAckanchorRtls = (marker) => {
      alert(marker.id);
    };
    this.options.callbackClickTransitRfid = (marker) => {
      alert(marker.id);
    };
    this.options.callbackClickPoint = (marker) => {
      alert(marker.id);
    };

    this.service.pointSubjectAsync.subscribe(result => {
      this.#floorplans.set(result);
      this.floorplans.drawFloorPlanMarker(result);
     //  this.floorplans.drawFloorPlanTest(result);
    });
  }

  ngAfterViewInit(): void {
    this.loadImage();
  }

  loadImage(): void {
    this.imagefloorplans = new Image();
    this.imagefloorplans.src = '/planimetria2.png';
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
