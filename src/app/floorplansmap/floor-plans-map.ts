import { IFloorPlansMap } from "./Ifloor-plans-map";
import { FloorPlansOptions, ContextMenu } from "./_model/floor-plans-options";
import { FloorPlansPoint, Marker, TypePoint } from "./_model/floor-plans-point";
import { PanelOverlay } from "./_model/panel-overlay";
import { ZoomValueArg } from "./_model/zoom-value-arg";
import { cloneDeep } from 'lodash-es';

export class FloorPlansMap {
  origWidthMeters = 0;
  origHeightMeters = 0;
  origRatioMeters = 0;
  origWidthPixel = 0;
  origHeightPixel = 0;
  origRatioPixel = 0;
  origPixelDimensionCn = 0;
  currWidthPixel = 0;
  currHeightPixel = 0;
  currPixelDimensionCn = 0;
  zoomLevelStepW = 0;
  minZoomLevel = 0;
  maxZoomLevel = 10;
  zoomLevel = 0;
  gotoPosMetersX = undefined;
  gotoPosMetersY = undefined;

  isDragging = false;
  selectedObject: TypePoint = undefined;
  currListp: FloorPlansPoint[] = [];
  currmarkers: Marker[] = [];
  scrollContainer: HTMLElement = undefined;
  boundCanvasContextMenu = undefined;
  boundCanvasClick = undefined;
  boundMouseDown = undefined;
  boundMouseMove = undefined;
  boundMouseUp = undefined;
  boundMouseLeave = undefined;
  startX = 0;
  startY = 0;
  scrollLeft = 0;
  scrollTop = 0;

  cacheoverlay = new Map();
  cacheimage = new Map();

  constructor(private sendnotify: IFloorPlansMap, private imagefloorplans: HTMLImageElement,
      private canvas: any, private context2d: any, private options: FloorPlansOptions) {
    this.scrollContainer = options._scrollContainer;
    this.origPixelDimensionCn = this.options._pixelDimensionCn;
    this.currPixelDimensionCn = this.options._pixelDimensionCn;
    options.widthPixel = this.meterToPixelCoord(options.widthMeters);
    options.heightPixel = this.meterToPixelCoord(options.heightMeters);
    this.initialize();
    this.registerEvent();
  }

  private initialize(): void {
    this.origWidthMeters = this.options.widthMeters;
    this.origHeightMeters = this.options.heightMeters;
    this.origRatioMeters = this.origWidthMeters / this.origHeightMeters;

    this.origWidthPixel = this.options.widthPixel;
    this.origHeightPixel = this.options.heightPixel;
    this.origRatioPixel = this.origWidthPixel / this.origHeightPixel;

    this.zoomLevelStepW = Math.floor((this.origWidthPixel - this.scrollContainer.
                         offsetWidth) / this.maxZoomLevel);

    this.currWidthPixel = this.origWidthPixel
    this.currHeightPixel = this.origHeightPixel;
  }

  private registerEvent(): void {
    this.boundCanvasContextMenu = this.handleCanvasContextMenu.bind(this);
    this.canvas.addEventListener('contextmenu', this.boundCanvasContextMenu);
    this.boundCanvasClick = this.handleCanvasClick.bind(this);
    this.canvas.addEventListener('click', this.boundCanvasClick);
    if (this.options._scrollContainer) {
      this.boundMouseDown = this.handleMouseDown.bind(this);
      this.boundMouseMove = this.handleMouseMove.bind(this);
      this.boundMouseUp = this.handleMouseUp.bind(this);
      this.boundMouseLeave = this.handleMouseLeave.bind(this);
      this.options._scrollContainer.addEventListener('mousedown', this.boundMouseDown);
      this.options._scrollContainer.addEventListener('mousemove', this.boundMouseMove);
      this.options._scrollContainer.addEventListener('mouseup', this.boundMouseUp);
      this.options._scrollContainer.addEventListener('mouseleave', this.boundMouseLeave);
    }
  }

  addOverlay(id: string, position: string): void {
    if (!this.cacheoverlay.has(id)) {
      const elem = document.getElementById(id);
      const panel = new PanelOverlay();
      panel.id = id;
      panel.elem = elem;
      panel.position = position;
      this.cacheoverlay.set(id, panel);
    }
  }

  enableBottomAxisX(value: boolean) {
    this.options.bottomAxisX.visibleBottomAxisX = value;
    this.drawFloorPlanMarker(this.currListp);
  }

  enableLeftAxisY(value: boolean) {
    this.options.leftAxisY.visibleLeftAxisY = value;
    this.drawFloorPlanMarker(this.currListp);
  }

  enableTopAxisX(value: boolean) {
    this.options.topAxisX.visibleTopAxisX = value;
    this.drawFloorPlanMarker(this.currListp);
  }

  enableRightAxisY(value: boolean) {
    this.options.rightAxisY.visibleRightAxisY = value
    this.drawFloorPlanMarker(this.currListp);
  }

  enableGridOverlay(value: boolean) {
    this.options.gridOverlay.visibleGridOverlay = value;
    this.drawFloorPlanMarker(this.currListp);
  }

  // Disegna l'immagine base, geometrie, marker (riclcolo ogni volta
  // geometrie e marker) drawPointGeometry() e createMarker()
  drawFloorPlanMarker(listp: FloorPlansPoint[]): void {
    this.currListp = listp;
    this.drawFloorPlanImage();
    this.currmarkers = this.createListMarker();
    // this.currmarkers = [];

    const lista = this.options.anchorRtlsPoint;
    if (lista && lista.length > 0) {
      let pointGeometry; let pointColor; let pointRadius;
      let pathIcon; let iconWidth; let iconHeight;
      if (this.selectedObject === 'anchor') {
        pointGeometry = this.options.anchorRtlsSelectedGeometry;
        pointColor = this.options.anchorRtlsSelectedColor;
        pointRadius = this.options.anchorRtlsSelectedRadius;
        pathIcon = this.options.anchorRtlsSelectedPathicon;
        iconWidth = this.options.anchorRtlsSelectedIconWidth;
        iconHeight = this.options.anchorRtlsSelectedIconHeight;
      } else {
        pointGeometry = this.options.anchorRtlsUnselectedGeometry;
        pointColor = this.options.anchorRtlsUnselectedColor;
        pointRadius = this.options.anchorRtlsUnselectedRadius;
        pathIcon = this.options.anchorRtlsUnselectedPathicon;
        iconWidth = this.options.anchorRtlsUnselectedIconWidth;
        iconHeight = this.options.anchorRtlsUnselectedIconHeight;
      }

      lista.forEach(pt => {
        const pixelX = this.meterToPixelCoordX(pt.metersX);
        const pixelY = this.meterToPixelCoordY(pt.metersY);
        this.context2d.beginPath();
        this.drawPointGeometry(pixelX, pixelY, pointGeometry, pointColor,
                  pointRadius, pathIcon, iconWidth, iconHeight);
        this.context2d.fillStyle = pointColor;
        this.context2d.fill();

        let contextMenu;
        if (pt.contextMenu && pt.contextMenu.length > 0) {
          contextMenu = pt.contextMenu;
        } else {
          contextMenu = this.options.anchorRtlsContextMenu;
        }
        const marker = this.createMarker(pixelX, pixelY, pointRadius, contextMenu, pt);
        this.currmarkers.push(marker);
      });
    }

    const listt = this.options.transitRfidPoint;
    if (listt && lista.length > 0) {
      let pointGeometry; let pointColor; let pointRadius;
      let pathIcon; let iconWidth; let iconHeight;
      if (this.selectedObject === 'transit') {
        pointGeometry = this.options.transitRfidSelectedGeometry;
        pointColor = this.options.transitRfidSelectedColor;
        pointRadius = this.options.transitRfidSelectedRadius;
        pathIcon = this.options.transitRfidSelectedPathicon;
        iconWidth = this.options.transitRfidSelectedIconWidth;
        iconHeight = this.options.transitRfidSelectedIconHeight;
      } else {
        pointGeometry = this.options.transitRfidUnselectedGeometry;
        pointColor = this.options.transitRfidUnselectedColor;
        pointRadius = this.options.transitRfidUnselectedRadius;
        pathIcon = this.options.transitRfidUnselectedPathicon;
        iconWidth = this.options.transitRfidUnselectedIconWidth;
        iconHeight = this.options.transitRfidUnselectedIconHeight;
      }

      listt.forEach(pt => {
        const pixelX = this.meterToPixelCoordX(pt.metersX);
        const pixelY = this.meterToPixelCoordY(pt.metersY);
        this.context2d.beginPath();
        this.drawPointGeometry(pixelX, pixelY, pointGeometry, pointColor,
                  pointRadius, pathIcon, iconWidth, iconHeight);
        this.context2d.fillStyle = pointColor;
        this.context2d.fill();

        let contextMenu;
        if (pt.contextMenu && pt.contextMenu.length > 0) {
          contextMenu = pt.contextMenu;
        } else {
          contextMenu = this.options.transitRfidContextMenu;
        }
        const marker = this.createMarker(pixelX, pixelY, pointRadius, contextMenu, pt);
        this.currmarkers.push(marker);
      });
    }

    if (listp && listp.length > 0) {
      let pointGeometry; let pointColor; let pointRadius;
      let pathIcon; let iconWidth; let iconHeight;
      if (this.selectedObject === 'point') {
        pointGeometry = this.options.pointSelectedGeometry;
        pointColor = this.options.pointSelectedColor;
        pointRadius = this.options.pointSelectedRadius;
        pathIcon = this.options.pointSelectedPathicon;
        iconWidth = this.options.pointSelectedIconWidth;
        iconHeight = this.options.pointSelectedIconHeight;
      } else {
        pointGeometry = this.options.pointUnselectedGeometry;
        pointColor = this.options.pointUnselectedColor;
        pointRadius = this.options.pointUnselectedRadius;
        pathIcon = this.options.pointUnselectedPathicon;
        iconWidth = this.options.pointUnselectedIconWidth;
        iconHeight = this.options.pointUnselectedIconHeight;
      }

      listp.forEach(pt => {
        const pixelX = this.meterToPixelCoordX(pt.metersX);
        const pixelY = this.meterToPixelCoordY(pt.metersY);
        this.context2d.beginPath();
        this.drawPointGeometry(pixelX, pixelY, pointGeometry, pointColor,
                  pointRadius, pathIcon, iconWidth, iconHeight);
        this.context2d.fillStyle = pointColor;
        this.context2d.fill();

        let contextMenu;
        if (pt.contextMenu && pt.contextMenu.length > 0) {
          contextMenu = pt.contextMenu;
        } else {
          contextMenu = this.options.pointContextMenu;
        }
        const marker = this.createMarker(pixelX, pixelY, pointRadius, contextMenu, pt);
        this.currmarkers.push(marker);
      });
    }

    if (this.options.enablePanelOverlay === true) {
      this.cacheoverlay.forEach((value) => {
        this.showOverlayAtPosition(value.id, value.elem, value.position);
      });
    }

    if (this.options.enableSelectedPosition === true) {
      if (this.gotoPosMetersX && this.gotoPosMetersY) {
        const x = this.meterToPixelCoordX(this.gotoPosMetersX);
        const y = this.meterToPixelCoordY(this.gotoPosMetersY);
        this.context2d.strokeStyle = this.options.contentSelectedColor;
        this.context2d.lineWidth = this.options.contentSelectedStroke;
        this.context2d.beginPath();
        this.context2d.moveTo(x, y);
        this.context2d.lineTo(x - 10, y);
        this.context2d.moveTo(x, y);
        this.context2d.lineTo(x + 10, y);
        this.context2d.moveTo(x, y);
        this.context2d.lineTo(x, y - 10);
        this.context2d.moveTo(x, y);
        this.context2d.lineTo(x, y + 10);
        this.context2d.stroke();
      }
    }
  }

  // Disegno l'immagine base e gli assi
  drawFloorPlanImage(): void {
    // this.context2d.drawImage(this.imagefloorplans, 0, 0);
    this.context2d.drawImage(this.imagefloorplans, 0, 0,
      this.currWidthPixel, this.currHeightPixel);

    const stepLengthX = 20; const stepLengthY = 20;
    const pixelPerMeterX = Math.floor(this.currWidthPixel / this.origWidthMeters);
    const pixelPerMeterY = Math.floor(this.currHeightPixel /  this.origHeightMeters);

    // const factorOrig = (this.origPixelDimensionCn * 100);
    // const factorCurr = (this.currPixelDimensionCn * 100);
    // if (this.origWidthPixel !== this.currWidthPixel) {
    //   if (factorOrig !== factorCurr) {
    //     const v1 = factorCurr - factorOrig;
    //     this.pixelPerMeterX = Math.floor(factorOrig - v1);
    //   } else {
    //     this.pixelPerMeterX = factorCurr;
    //   }
    // }
    // if (this.origHeightPixel !== this.currHeightPixel) {
    //   if (factorOrig !== factorCurr) {
    //     const v1 = factorCurr - factorOrig;
    //     this.pixelPerMeterY = Math.floor(factorOrig - v1);
    //   } else {
    //     this.pixelPerMeterY = factorCurr;
    //   }
    // }

    if (this.options.bottomAxisX?.visibleBottomAxisX === true) {
      // Imposta il colore e lo spessore della linea
      this.context2d.strokeStyle = this.options.bottomAxisX.lineStrokeColor;
      this.context2d.lineWidth = this.options.bottomAxisX.lineWidth;

      // Disegna la linea dell'asse
      this.context2d.beginPath();
      this.context2d.moveTo(0, this.currHeightPixel);
      this.context2d.lineTo(this.currWidthPixel, this.currHeightPixel);
      this.context2d.stroke();

      // Disegna le tacche e le etichette
      for (let x = 0; x <= this.currWidthPixel; x += pixelPerMeterX) {
        this.context2d.beginPath();
        this.context2d.moveTo(x, this.currHeightPixel);
        this.context2d.lineTo(x, this.currHeightPixel - stepLengthX);
        this.context2d.stroke();

        if (x > 0) {
          this.context2d.fillStyle = this.options.bottomAxisX.linefillColor;
          this.context2d.font = this.options.bottomAxisX.lineFont;
          this.context2d.fillText(x / pixelPerMeterX, x + 5, this.currHeightPixel - 15);
        }
      }
    }

    if (this.options.leftAxisY?.visibleLeftAxisY === true) {
      // Imposta il colore e lo spessore della linea
      this.context2d.strokeStyle = this.options.leftAxisY.lineStrokeColor;
      this.context2d.lineWidth = this.options.leftAxisY.lineWidth;

      // Disegna la linea dell'asse
      this.context2d.beginPath();
      this.context2d.moveTo(0, this.currHeightPixel);
      this.context2d.lineTo(0, 0);
      this.context2d.stroke();

      // Disegna le tacche e le etichette
      for (let y = 0; y <= this.currHeightPixel; y += pixelPerMeterY) {
        this.context2d.beginPath();
        this.context2d.moveTo(0, y);
        this.context2d.lineTo(stepLengthY, y);
        this.context2d.stroke();

        if (y > 0) {
          this.context2d.fillStyle = this.options.leftAxisY.linefillColor;
          this.context2d.font = this.options.leftAxisY.lineFont;
          this.context2d.fillText(y / pixelPerMeterY, 10, this.currHeightPixel - y - 10);
        }
      }
    }

    if (this.options.topAxisX?.visibleTopAxisX === true) {
      // Imposta il colore e lo spessore della linea
      this.context2d.strokeStyle = this.options.topAxisX.lineStrokeColor;
      this.context2d.lineWidth = this.options.topAxisX.lineWidth;

      // Disegna la linea dell'asse X in alto
      this.context2d.beginPath();
      this.context2d.moveTo(0, 0);
      this.context2d.lineTo(this.currWidthPixel, 0);
      this.context2d.stroke();

      // Disegna le tacche e le etichette
      for (let x = 0; x <= this.currWidthPixel; x += pixelPerMeterX) {
        this.context2d.beginPath();
        this.context2d.moveTo(x, 0);
        this.context2d.lineTo(x, stepLengthX);
        this.context2d.stroke();

        if (x > 0) {
          this.context2d.fillStyle = this.options.topAxisX.linefillColor;
          this.context2d.font = this.options.topAxisX.lineFont;
          this.context2d.fillText(x / pixelPerMeterX, x + 5, stepLengthX + 15);
        }
      }
    }

    if (this.options.rightAxisY?.visibleRightAxisY === true) {
      // Imposta il colore e lo spessore della linea
      this.context2d.strokeStyle = this.options.rightAxisY.lineStrokeColor;
      this.context2d.lineWidth = this.options.rightAxisY.lineWidth;

      // Disegna la linea dell'asse Y a destra
      this.context2d.beginPath();
      this.context2d.moveTo(this.currWidthPixel, 0);
      this.context2d.lineTo(this.currWidthPixel, this.currHeightPixel);
      this.context2d.stroke();

      // Disegna le tacche e le etichette
      for (let y = 0; y <= this.currHeightPixel; y += pixelPerMeterY) {
        this.context2d.beginPath();
        this.context2d.moveTo(this.currWidthPixel, y);
        this.context2d.lineTo(this.currWidthPixel - stepLengthY, y);
        this.context2d.stroke();

        if (y > 0) {
          this.context2d.fillStyle = this.options.rightAxisY.linefillColor;
          this.context2d.font = this.options.rightAxisY.lineFont;
          this.context2d.fillText(y / pixelPerMeterY, this.currWidthPixel - 25,
                            this.currHeightPixel - y - 10);
        }
      }
    }

    if (this.options.gridOverlay?.visibleGridOverlay === true) {
      // Imposta il colore e lo spessore della griglia
      this.context2d.strokeStyle = this.options.gridOverlay.gridLineStrokeColor;
      this.context2d.lineWidth = this.options.gridOverlay.gridLineWidth;

      // Disegna le linee della griglia
      for (let x = 0; x <= this.currWidthPixel; x += pixelPerMeterX) {
        this.context2d.beginPath();
        this.context2d.moveTo(x, 0);
        this.context2d.lineTo(x, this.currHeightPixel);
        this.context2d.stroke();
      }
      for (let y = 0; y <= this.currHeightPixel; y += pixelPerMeterY) {
        this.context2d.beginPath();
        this.context2d.moveTo(0, y);
        this.context2d.lineTo(this.currWidthPixel, y);
        this.context2d.stroke();
      }
    }
  }

  // Imposta posizione overlay
  showOverlayAtPosition(id: string, elem: any, position: string): void {
    const arr = position.split('-');
    const pixelX = this.meterToPixelCoordX(+arr[0]);
    const pixelY = this.meterToPixelCoordY(+arr[1]);

    elem.style.top = `${pixelY}px`;
    elem.style.left = `${pixelX}px`;
    elem.style.display = 'block';
  }

  // setta la posizione del canvas
  setContentPosition(position: string = 'top-left'): void {
    const currClientWidth = this.scrollContainer.clientWidth;
    const currClientHeight = this.scrollContainer.clientHeight;
    const currScrollWidth = this.scrollContainer.scrollWidth;
    const currScrollHeight = this.scrollContainer.scrollHeight;

    if (position === 'top-left') {
      this.scrollContainer.scrollTop = 0;
      this.scrollContainer.scrollLeft = 0;
    } else if (position === 'top-right') {
      this.scrollContainer.scrollTop = 0;
      this.scrollContainer.scrollLeft = currScrollWidth - currClientWidth;
    } else if (position === 'bottom-left') {
      this.scrollContainer.scrollTop = currScrollHeight - currClientHeight;
      this.scrollContainer.scrollLeft = 0;
    } else if (position === 'bottom-right') {
      this.scrollContainer.scrollTop = currScrollHeight - currClientHeight;
      this.scrollContainer.scrollLeft = currScrollWidth - currClientWidth;
    } else if (position === 'center') {
      this.scrollContainer.scrollTop = (currScrollHeight - currClientHeight) / 2;
      this.scrollContainer.scrollLeft = (currScrollWidth - currClientWidth) / 2;
    }
  }

  // setta la posizione del canvas (in metri)
  gotoContentPosition(position: string): void {
    // Se parti dal centro funziona, altrimento no?
    this.setContentPosition('center');
    const arr = position.split('-');
    const pixelX = this.meterToPixelCoordX(+arr[0]);
    const pixelY = this.meterToPixelCoordY(+arr[1]);
    this.gotoPosMetersX = +arr[0];
    this.gotoPosMetersY = +arr[1];

    const sideW = (pixelX > this.currWidthPixel / 2) ? 'dx' : 'sx';
    const sideH = (pixelY < this.currHeightPixel / 2) ? 'tx' : 'bx';

    const currClientWidth = this.scrollContainer.clientWidth;
    const currClientHeight = this.scrollContainer.clientHeight;
    const currScrollWidth = this.scrollContainer.scrollWidth;
    const currScrollHeight = this.scrollContainer.scrollHeight;
    const containerRect = this.scrollContainer.getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();

    // Sottraendo containerRect.top da canvasRect.top, otteniamo la distanza effettiva tra il
    // bordo superiore del canvas e il bordo superiore del contenitore. Questo perché stiamo
    // sottraendo la distanza dal bordo superiore del contenitore rispetto alla viewport, dalla
    // distanza del bordo superiore del canvas rispetto alla viewport.

    const distanceFromTop = Math.abs(canvasRect.top - containerRect.top);
    const distanceFromBottom = Math.abs(containerRect.bottom - canvasRect.bottom);
    const distanceFromLeft = Math.abs(canvasRect.left - containerRect.left);
    const distanceFromRight = Math.abs(containerRect.right - canvasRect.right);
    const fromRight =  this.currWidthPixel - distanceFromLeft;
    const fromBottom = this.currHeightPixel - distanceFromTop;

    let posX = 0; let posY = 0;
    let sposX = ''; let sposY = '';
    if (sideW === 'sx') {
      if (pixelX <= distanceFromLeft) {
        sposX = 'left'; posX = 0;
        //this.scrollContainer.scrollLeft = 0;
      } else {
        sposX = 'x'; posX = pixelX;
        //this.scrollContainer.scrollLeft = metersX;
      }
    }
    if (sideW === 'dx') {
      if (pixelX >= fromRight) {
        sposX = 'right'; posX = currScrollWidth - currClientWidth;
        //this.scrollContainer.scrollLeft = currScrollWidth - currClientWidth;
      } else {
        sposX = 'x'; posX = pixelX;
        //this.scrollContainer.scrollLeft = metersX;
      }
    }

    if (sideH === 'tx') {
      if (pixelY <= distanceFromTop) {
        sposY = 'top'; posY = 0;
        //this.scrollContainer.scrollTop = 0;
      } else {
        sposY = 'y'; posY = pixelY;
        //this.scrollContainer.scrollTop = metersY;
      }
    }
    if (sideH === 'bx') {
      if (pixelY >= fromBottom) {
        sposY = 'bottom'; posY = currScrollHeight - currClientHeight;
        //this.scrollContainer.scrollTop = currScrollHeight - currClientHeight;
      } else {
        sposY = 'y'; posY = pixelY;
        //this.scrollContainer.scrollTop = metersY
      }
    }

    this.scrollContainer.scrollLeft = posX;
    this.scrollContainer.scrollTop = posY;
    this.drawFloorPlanMarker(this.currListp);
    //console.log(sposX + ' - ' + sposY);
  }

  // reset della posizione del canvas (in metri)
  resetContentPosition(): void {
    this.gotoPosMetersX = undefined;
    this.gotoPosMetersY = undefined;
    this.drawFloorPlanMarker(this.currListp);
  }

  // fit zoom
  zoomFloorPlanFit(): void {
    let orientation = ''; let delta = 0;
    const scrollOffsetWidth = this.scrollContainer.offsetWidth - 25;
    const scrollOffsetHeight = this.scrollContainer.offsetHeight - 25;
    if (scrollOffsetWidth < scrollOffsetHeight) {
      orientation = 'h';
      delta = this.currWidthPixel - scrollOffsetWidth ;
      this.currWidthPixel = this.currWidthPixel - delta;
      this.currHeightPixel = this.currWidthPixel / this.origRatioPixel;
    } else {
      orientation = 'w';
      delta = this.currHeightPixel - scrollOffsetHeight;
      this.currHeightPixel = this.currHeightPixel - delta;
      this.currWidthPixel = this.currHeightPixel * this.origRatioPixel;
    }
    // this.imagefloorplans.width = this.currWidthPixel;
    // this.imagefloorplans.height = this.currHeightPixel;
    this.canvas.width = this.currWidthPixel;
    this.canvas.height = this.currHeightPixel;
    this.currPixelDimensionCn = (this.origWidthPixel / this.currWidthPixel)
                     * this.origPixelDimensionCn;
    this.drawFloorPlanMarker(this.currListp);
    if (this.options.callbackZoom) {
      this.sendCallbackZoom('fit');
    }
  }

  // incrementa zoom
  zoomIncrement(): void {
    this.closeContextMenu();
    this.zoomLevel = this.zoomLevel + 1;
    this.currWidthPixel = this.currWidthPixel + this.zoomLevelStepW;
    this.currHeightPixel = this.currWidthPixel / this.origRatioPixel;
    // this.imagefloorplans.width = this.currWidthPixel;
    // this.imagefloorplans.height = this.currHeightPixel;
    this.canvas.width = this.currWidthPixel;
    this.canvas.height = this.currHeightPixel;
    this.currPixelDimensionCn = (this.origWidthPixel / this.currWidthPixel)
                     * this.origPixelDimensionCn;
    this.drawFloorPlanMarker(this.currListp);
    if (this.options.callbackZoom) {
      this.sendCallbackZoom('zoom-plus');
    }
  }

  // decrementa zoom
  zoomDecrement(): void {
    this.closeContextMenu();
    this.zoomLevel = this.zoomLevel - 1;
    this.currWidthPixel = this.currWidthPixel - this.zoomLevelStepW;
    this.currHeightPixel = this.currWidthPixel / this.origRatioPixel;
    // this.imagefloorplans.width = this.currWidthPixel;
    // this.imagefloorplans.height = this.currHeightPixel;
    this.canvas.width = this.currWidthPixel;
    this.canvas.height = this.currHeightPixel;
    this.currPixelDimensionCn = (this.origWidthPixel / this.currWidthPixel)
                     * this.origPixelDimensionCn;
    this.drawFloorPlanMarker(this.currListp);
    if (this.options.callbackZoom) {
      this.sendCallbackZoom('zoom-minus');
    }
  }

  // resetta zoom
  resetZoom(): void {
    this.closeContextMenu();
    this.zoomLevel = 0;
    this.currWidthPixel = this.origWidthPixel;
    this.currHeightPixel = this.origHeightPixel;
    // this.imagefloorplans.width = this.currWidthPixel;
    // this.imagefloorplans.height = this.currHeightPixel;
    this.canvas.width = this.currWidthPixel;
    this.canvas.height = this.currHeightPixel;
    this.currPixelDimensionCn = this.origPixelDimensionCn;
    this.drawFloorPlanMarker(this.currListp);
    if (this.options.callbackZoom) {
      this.sendCallbackZoom('zoom-reset');
    }
  }

  private handleCanvasClick(event: MouseEvent) {
    if (event.type !== 'click') {
      return;
    }
    this.closeContextMenu();
    // const mouseX = event.clientX; const mouseY = event.clientY;
    // Queste righe calcolano le coordinate del mouse relative al canvas.
    const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;
    this.selectedObject = undefined;

    this.currmarkers.forEach(marker => {
      const pixelX = marker.pixelX;
      const metersX = marker.metersX;
      const pixelY = marker.pixelY;
      const metersY = marker.metersY;
      // Questa riga calcola la distanza euclidea tra il punto cliccato e il centro del marker.
      const distance = Math.sqrt(Math.pow(mouseX - pixelX, 2) + Math.pow(mouseY - pixelY, 2));
      if (distance <= marker.radius) {
        if (marker.type === 'anchor' && this.options.callbackClickAckanchorRtls) {
          if (marker.enableCallbackEvent === true) {
            this.selectedObject = marker.type;
            this.options.callbackClickAckanchorRtls(marker);
          }
        }
        if (marker.type === 'transit' && this.options.callbackClickTransitRfid) {
          if (marker.enableCallbackEvent === true) {
            this.selectedObject = marker.type;
            this.options.callbackClickTransitRfid(marker);
          }
        }
        if (marker.type === 'point' && this.options.callbackClickPoint) {
          if (marker.enableCallbackEvent === true) {
            this.selectedObject = marker.type;
            this.options.callbackClickPoint(marker);
          }
        }
      }
    });
    this.drawFloorPlanMarker(this.currListp);
  };

  private handleCanvasContextMenu(event: MouseEvent) {
    if (event.type !== 'contextmenu') {
      return;
    }
    event.preventDefault();
    // const mouseX = event.clientX; const mouseY = event.clientY;
    // Queste righe calcolano le coordinate del mouse relative al canvas.
    const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;

    this.currmarkers.forEach(marker => {
      const pixelX = marker.pixelX;
      const metersX = marker.metersX;
      const pixelY = marker.pixelY;
      const metersY = marker.metersY;
      // Questa riga calcola la distanza euclidea tra il punto cliccato e il centro del marker.
      const distance = Math.sqrt(Math.pow(mouseX - pixelX, 2) + Math.pow(mouseY - pixelY, 2));
      if (distance <= marker.radius) {
        //
        // ???
        //
        if (marker.type === 'anchor' && this.options.enableAnchorRtlsContextMenu) {
          this.sendnotify.contextMenuOpenClose(true, pixelX, pixelY, marker);
        }
        if (marker.type === 'transit' && this.options.enableTransitRfidContextMenu) {
          this.sendnotify.contextMenuOpenClose(true, pixelX, pixelY, marker);
        }
        if (marker.type === 'point' && this.options.enablePointContextMenu) {
          this.sendnotify.contextMenuOpenClose(true, pixelX, pixelY, marker);
        }
      }
    });
    this.drawFloorPlanMarker(this.currListp);
  };

  private handleMouseDown(event: MouseEvent) {
    if (event.type !== 'mousedown') {
      return;
    }
    // Registriamo le coordinate del mouse relative all'immagine.
    this.isDragging = true;
    this.startX = event.pageX - this.scrollContainer.offsetLeft;
    this.startY = event.pageY - this.scrollContainer.offsetTop;
    this.scrollLeft = this.scrollContainer.scrollLeft;
    this.scrollTop = this.scrollContainer.scrollTop;
  }

  private handleMouseMove(event: MouseEvent) {
    if (event.type !== 'mousemove') {
      return;
    }
    // Calcoliamo la differenza tra le coordinate attuali e quelle iniziali.
    if (this.isDragging) {
      event.preventDefault();
      const x = event.pageX - this.scrollContainer.offsetLeft;
      const y = event.pageY - this.scrollContainer.offsetTop;
      const walkX = (x - this.startX) * 1; // scroll speed multiplier
      const walkY = (y - this.startY) * 1; // scroll speed multiplier
      this.scrollContainer.scrollLeft = this.scrollLeft - walkX;
      this.scrollContainer.scrollTop = this.scrollTop - walkY;
    }
  }

  private handleMouseUp(event: MouseEvent) {
    if (event.type !== 'mouseup') {
      return;
    }
    // Resettiamo le coordinata iniziali.
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.scrollLeft = 0;
    this.scrollTop = 0;
  }

  private handleMouseLeave(event: MouseEvent) {
    if (event.type !== 'mouseleave') {
      return;
    }
    // Resettiamo le coordinata iniziali.
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.scrollLeft = 0;
    this.scrollTop = 0;
  }

  private createListMarker(): Marker[] {
    const list = [];

    if (this.options.anchorRtlsPoint) {
      for(const x of this.options.anchorRtlsPoint) {
        list.push(x);
      }
    }
    if (this.options.transitRfidPoint) {
      for(const x of this.options.transitRfidPoint) {
        list.push(x);
      }
    }

    return list;
  }

  private createMarker(pixelX: number, pixelY: number, radius: number, contextMenu:
                 ContextMenu[],  point: FloorPlansPoint): Marker {
    const marker = new Marker();
    marker.id = point.id;
    marker.group = point.group;
    marker.name = point.name;
    marker.type = point.type;
    marker.metersX = point.metersX;
    marker.metersY = point.metersY;
    marker.pixelX = pixelX;
    marker.pixelY = pixelY;
    marker.radius = radius;
    marker.enableCallbackEvent = point.enableCallbackEvent;
    marker.pointMetadata = cloneDeep(point.pointMetadata);
    marker.contextMenu = cloneDeep(contextMenu);
    return marker;
  }

  private drawPointGeometry(pixelX: number, pixelY: number, pointGeometry: string, pointColor: string,
      pointRadius: number, pathIcon: string, iconWidth: number, iconHeight: number): void {
    if (pointGeometry === 'circle') {
      this.context2d.arc(pixelX, pixelY, pointRadius, 0, Math.PI * 2);
    } else if (pointGeometry === 'square') {
      this.context2d.rect(pixelX - pointRadius / 2, pixelY - pointRadius / 2,
                            pointRadius, pointRadius);
    } else if (pointGeometry === 'rhombus') {
      this.context2d.moveTo(pixelX - pointRadius, pixelY);
      this.context2d.lineTo(pixelX, pixelY + pointRadius);
      this.context2d.lineTo(pixelX + pointRadius, pixelY);
      this.context2d.lineTo(pixelX, pixelY - pointRadius);
      this.context2d.lineTo(pixelX - pointRadius, pixelY);
    } else if (pointGeometry === 'triangle') {
      this.context2d.moveTo(pixelX, pixelY - pointRadius);
      this.context2d.lineTo(pixelX + pointRadius, pixelY + pointRadius);
      this.context2d.lineTo(pixelX - pointRadius, pixelY + pointRadius);
      this.context2d.lineTo(pixelX, pixelY - pointRadius);
    } else {
      const image = this.getImage(pathIcon);
      if (image !== null) {
        this.context2d.drawImage(image, pixelX - iconWidth / 2,
            pixelY - iconHeight / 2, iconWidth, iconHeight);
      }
    }
  }

  private sendCallbackZoom(action: string): void {
    const args = new ZoomValueArg();
    args.action = action;
    args.zoomValue = this.zoomLevel;
    args.origWidthPixel = this.origWidthPixel;
    args.origHeightPixel = this.origWidthPixel;
    args.origPixelDimensionCn = this.origPixelDimensionCn;
    args.currWidthPixel = this.currWidthPixel;
    args.currHeightPixel = this.currWidthPixel;
    args.currPixelDimensionCn = this.currPixelDimensionCn;
    this.options.callbackZoom(args);
  }

  private closeContextMenu(): void {
    this.sendnotify.contextMenuOpenClose(false, 0, 0, null);
  }

  private meterToPixelCoord(meters: number): number {
    const pixel = (meters * 100) / this.currPixelDimensionCn;
    return pixel;
  }

  private meterToPixelCoordX(meters: number): number {
    const pixel = (meters * 100) / this.currPixelDimensionCn;
    return Math.round(pixel);
  }

  private meterToPixelCoordY(meters: number): number {
    const pixel = (meters * 100) / this.currPixelDimensionCn;
    const reverse = this.currHeightPixel - pixel;
    return Math.round(reverse);
  }

  private getImage(filename: string): HTMLImageElement {
    let image1 = null;
    if (!this.cacheimage.has(filename)) {
      const image2 = new Image();
      image2.onload = () => {
        this.cacheimage.set(filename, image2);
        image1 = image2;
      };
      image2.src = filename;
    } else {
      image1 = this.cacheimage.get(filename);
    }
    return image1;
  }

  private unregisterEvent(): void {
    this.canvas.removeEventListener('contextmenu', this.boundCanvasContextMenu);
    this.canvas.removeEventListener('click', this.boundCanvasClick);
    if (this.options._scrollContainer) {
      this.options._scrollContainer.removeEventListener('mousedown', this.boundMouseDown);
      this.options._scrollContainer.removeEventListener('mousemove', this.boundMouseMove);
      this.options._scrollContainer.removeEventListener('mouseup', this.boundMouseUp);
      this.options._scrollContainer.removeEventListener('mouseleave', this.boundMouseLeave);
    }
  }

  destroy(): void {
    this.unregisterEvent();
  }
}
