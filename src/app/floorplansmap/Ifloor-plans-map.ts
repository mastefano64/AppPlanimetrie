import { Marker } from "./_model/floor-plans-point";

export interface IFloorPlansMap {
  contextMenuOpenClose(visible: boolean, pointX: number, pointY: number, marker: Marker);
}
