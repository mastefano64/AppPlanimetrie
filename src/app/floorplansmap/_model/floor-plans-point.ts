// anchor, transit, iot, 'point' => fix
// point => enter, inside, leave, fix

import { ContextMenu } from "./floor-plans-options";

export type TypePoint = 'anchor' | 'transit' | 'point';

export type TypeMovement = 'enter' | 'inside' | 'leave' | 'fix' | '*';

export type TypeValueMatadata = 'string' | 'number' | 'boolean';

export class FloorPlansPoint {
  id: string;
  group: string;
  name: string;
  metersX: number;
  metersY: number;
  type: TypePoint;
  typeMovement: TypeMovement;
  enableCallbackEvent: boolean;
  pointMetadata: PointMetadata[] = [];
  contextMenu: ContextMenu[] = [];
}

export class PointMetadata {
  id: string;
  name: string;
  type: TypeValueMatadata;
  value: any;
}

export class Marker {
  id: string;
  group: string;
  name: string;
  type: TypePoint;
  metersX: number;
  metersY: number;
  pixelX: number;
  pixelY: number;
  radius: number;
  enableCallbackEvent: boolean;
  pointMetadata: PointMetadata[] = [];
  contextMenu: ContextMenu[] = [];
}

