export type TypeContentPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export type TypeMarkerGeometry = 'circle' | 'square' | 'rhombus' | 'triangle' | 'icon';

export type TypeAlignNavbar = 'top-left' | 'top-right';

import { FloorPlansPoint, Marker } from "./floor-plans-point";

export class FloorPlansOptions {
  widthMeters? = 0;
  heightMeters? = 0;
  widthPixel? = 0; // read-only
  heightPixel? = 0; // read-only

  topAxisX = new TopAxisX();
  bottomAxisX = new BottomAxisX();
  leftAxisY = new LeftAxisY();
  rightAxisY = new RightAxisY();
  gridOverlay = new GridOverlay();

  contentPosition: TypeContentPosition = 'top-left';
  enableSelectedPosition = true;
  contentSelectedColor = '#424242';
  contentSelectedStroke = 3;
  callbackZoom?: any;

  anchorRtlsUnselectedColor? = '#ff0000';
  anchorRtlsUnselectedGeometry?: TypeMarkerGeometry = 'circle';
  anchorRtlsUnselectedRadius? = 15;
  anchorRtlsUnselectedPathicon? = '';
  anchorRtlsUnselectedIconWidth? = 30;
  anchorRtlsUnselectedIconHeight? = 30;
  anchorRtlsSelectedColor? = '#ff0000';
  anchorRtlsSelectedGeometry?: TypeMarkerGeometry = 'circle';
  anchorRtlsSelectedRadius? = 15;
  anchorRtlsSelectedPathicon? = '';
  anchorRtlsSelectedIconWidth? = 30;
  anchorRtlsSelectedIconHeight? = 30;
  anchorRtlsPoint?: FloorPlansPoint[] = [];
  enableAnchorRtlsContextMenu? = false;
  anchorRtlsContextMenu?: ContextMenu[] = [];
  callbackClickAckanchorRtls?: any;

  transitRfidUnselectedColor? = '#0000ff';
  transitRfidUnselectedGeometry?: TypeMarkerGeometry = 'circle';
  transitRfidUnselectedRadius? = 15;
  transitRfidUnselectedPathicon? = '';
  transitRfidUnselectedIconWidth? = 30;
  transitRfidUnselectedIconHeight? = 30;
  transitRfidSelectedColor? = '#0000ff';
  transitRfidSelectedGeometry?: TypeMarkerGeometry = 'circle';
  transitRfidSelectedRadius? = 15;
  transitRfidSelectedPathicon? = '';
  transitRfidSelectedIconWidth? = 30;
  transitRfidSelectedIconHeight? = 30;
  transitRfidPoint?: FloorPlansPoint[] = [];
  enableTransitRfidContextMenu? = false;
  transitRfidContextMenu?: ContextMenu[] = [];
  callbackClickTransitRfid?: any;

  pointUnselectedColor? = '#00ff00';
  pointUnselectedGeometry?: TypeMarkerGeometry = 'circle';
  pointUnselectedRadius? = 15;
  pointUnselectedPathicon? = 'zoom01.png';
  pointUnselectedIconWidth? = 30;
  pointUnselectedIconHeight? = 30;
  pointSelectedColor? = '#00ff00';
  pointSelectedGeometry?: TypeMarkerGeometry = 'circle';
  pointSelectedRadius? = 15;
  pointSelectedPathicon? = 'zoom01.png';
  pointSelectedIconWidth? = 30;
  pointSelectedIconHeight? = 30;
  enablePointContextMenu? = false;
  pointContextMenu?: ContextMenu[] = [];
  callbackClickPoint?: any;

  enablePanelOverlay = false;
  enableNavbar = false;
  enableNavbarZoom = false;
  enableNavbarPosition = false;
  alignNavbar: TypeAlignNavbar = 'top-left';

  _pixelDimensionCn? = 1;
  _scrollContainer?: any;
}

export class TopAxisX {
  visibleTopAxisX = false;
  lineStrokeColor = 'black';
  lineWidth = 1;
  linefillColor = 'black';
  lineFont = '15px Arial';
}

export class BottomAxisX {
  visibleBottomAxisX = false;
  lineStrokeColor = 'black';
  lineWidth = 1;
  linefillColor = 'black';
  lineFont = '15px Arial';
}

export class LeftAxisY {
  visibleLeftAxisY = false;
  lineStrokeColor = 'black';
  lineWidth = 1;
  linefillColor = 'black';
  lineFont = '15px Arial';
}

export class RightAxisY {
  visibleRightAxisY = false;
  lineStrokeColor = 'black';
  lineWidth = 1;
  linefillColor = 'black';
  lineFont = '15px Arial';
}

export class GridOverlay {
  visibleGridOverlay = false;
  gridLineStrokeColor = 'lightgray';
  gridLineWidth = 1;
}

export class ContextMenu {
  id: string;
  name: string;
}
