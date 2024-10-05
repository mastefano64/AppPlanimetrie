import { Injectable } from '@angular/core';

import { FloorPlansPoint, PointMetadata } from '../floorplansmap/_model/floor-plans-point';
import { cloneDeep } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class ApiTestFloorPlansService {
  list: any = [];

  constructor() { }

  getAllPointFloorPlans(): FloorPlansPoint[] {
    this.list = this.createPointList();
    return this.list;
  }

  // -----------------------------------------------

  createPointList(): FloorPlansPoint[] {
    const data = [];

    const p1 =new FloorPlansPoint();
    p1.id = 'p1';
    p1.name = 'punto1';
    p1.metersX = 0;
    p1.metersY = 2.3;
    p1.type = 'point';
    p1.typeMovement = 'inside';
    p1.enableCallbackEvent = true;
    p1.pointMetadata = this.createMetadata('p1');
    p1.contextMenu.push(
      {
        id: 'p1m1',
        name: 'Menu-1'
      }
    );
    p1.contextMenu.push(
      {
        id: 'p1m2',
        name: 'Menu-2'
      }
    );

    const p2 =new FloorPlansPoint();
    p2.id = 'p2';
    p2.name = 'punto2';
    p2.metersX = 0;
    p2.metersY = 4.6;
    p2.type = 'point';
    p2.typeMovement = 'inside';
    p2.enableCallbackEvent = true;
    p2.pointMetadata = this.createMetadata('p2');
    p2.contextMenu.push(
      {
        id: 'p2m1',
        name: 'Menu-1'
      }
    );
    p2.contextMenu.push(
      {
        id: 'p2m2',
        name: 'Menu-2'
      }
    );

    for (let i = -1; i <= 22; i++) {
      const p3 = cloneDeep(p1);
      const p4 = cloneDeep(p2);
      if (i <= 0) {
        //p3.metersX = 0;
        //p3.typeMovement = 'enter';
        p3.typeMovement = 'inside';
        this.updateMetadata(i, p3.pointMetadata);
        //p4.metersX = 0;
        //p4.typeMovement = 'enter';
        p4.typeMovement = 'inside';
        this.updateMetadata(i, p4.pointMetadata);
      }
      if (i > 0 && i < 22) {
        p3.metersX = i;
        this.updateMetadata(i, p3.pointMetadata);
        p4.metersX = i;
        this.updateMetadata(i, p4.pointMetadata);
      }
      if (i >= 22) {
        p3.metersX = 5;
        //p3.typeMovement = 'leave';
        p3.typeMovement = 'inside';
        this.updateMetadata(i, p3.pointMetadata);
        p4.metersX = 5;
        //p4.typeMovement = 'leave';
        p4.typeMovement = 'inside';
        this.updateMetadata(i, p4.pointMetadata);
      }

      data.push(p3);
      data.push(p4);
    }

    return data;
  }

  updateMetadata(value: number, metadata: PointMetadata[]): void {
    for (const m of metadata) {
      m.value = value + 1;
    }
  }

  createMetadata(parent: string): PointMetadata[] {
    const metadata = [];

    for (let i= 1; i <= 4; i++) {
      const m = new PointMetadata();
      m.id = `value${i}`;
      m.name = `${parent}-value-${i}`;
      m.type = 'number';
      m.value = 1;
      metadata.push(m);
    }

    return metadata;
  }
}
