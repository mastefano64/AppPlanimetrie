import { Injectable } from '@angular/core';
import { Subject, interval, Subscription } from 'rxjs';

import { FloorPlansPoint } from '../floorplansmap/_model/floor-plans-point';
import { ApiTestFloorPlansService } from './api-test-floor-plans.service';

@Injectable()
export class ManagerTestFloorPlansService {
  private pointSubject = new Subject<FloorPlansPoint[]>();
  public pointSubjectAsync = this.pointSubject.asObservable();
  listpoint1: FloorPlansPoint[] = [];
  listpoint2: FloorPlansPoint[] = [];
  index = 0;
  sub1: Subscription;

  constructor(private api: ApiTestFloorPlansService) { }

  startPointFloorPlans(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    const source = interval(1000);
    this.listpoint1 = this.api.getAllPointFloorPlans();
    this.sub1 = source.subscribe(val => {
      const point = this.listpoint1[this.index];
      if (point) {
        this.sendPointFloorPlans(point);
        this.index = this.index + 1;
      }
    });
  }

  sendPointFloorPlans(point: FloorPlansPoint): void {
    if (!point)
      return;
    if (point.typeMovement !== 'leave') {
      const found = this.listpoint2.find(x => x.id === point.id);
      if (found) {
        const pos = this.listpoint2.indexOf(found);
        this.listpoint2[pos] = point;
      } else {
        this.listpoint2.push(point);
      }
    } else {
      const item = this.listpoint2.find(x => x.id === point.id);
      const pos = this.listpoint2.indexOf(item);
      this.listpoint2.splice(pos, 1);
    }
    this.pointSubject.next(this.listpoint2);
  }

  resetFloorPlans() {
    this.listpoint2 = [];
    this.index = 0;
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }
}
