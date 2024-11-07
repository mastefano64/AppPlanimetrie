## AppPlanimetrie

### Introduction

[LIVE DEMO](https://www.stefanomarchisio.it/AppPlanimetrie/index.html)<br>

[Italian article: Dal sensore IoT al Cloud, quanti Layer verranno attraversati? (CloudComputing, EdgeComputing, IoT-Gateway)](https://www.linkedin.com/pulse/dal-sensore-iot-al-cloud-quanti-layer-verranno-stefano-marchisio-9qasf)<br>

When discussing geolocated maps, the combination of OpenLayers and GPS (for example) immediately comes to mind. This system works well in open spaces but loses precision in enclosed spaces. In a similar context (enclosed spaces), RTLS/UWB technology comes into play (leaving aside the various details). From a technical standpoint, RTLS/UWB utilizes an extremely high spectral band that exploits a plurality of frequencies in the GHz range (generally between 3 and 7). Typically, the Time of Flight (ToF) is considered, i.e., the time it takes for the radio signal emitted by the tag to reach the reference anchor (if there are 3 or more reference anchors, trilateration is performed). In this way, the position of an object equipped with a tag is established, and the position is expressed in "meters" rather than geographic coordinates.

#### <center>Therefore, when in a closed environment, we need to use floor plans instead of the classic maps that use geographic coordinates (although there are exceptions).</center> ####

### Project

>Starting from a scaled floor plan (for example) 19.20 meters x 10.96 meters and saved as a 1920 pixel x 1096 pixel image, where each pixel corresponds to one centimeter. After rendering the image within a canvas and inserting the canvas into a container of appropriate dimensions (to allow scrolling of the image), a scrollable view can be provided to the user.<br> As mentioned at the beginning, both RTLS/UWB anchors and RFID gateways can be positioned on this map. The position of these base points is obviously static/fixed. But thanks to the RTLS/UWB anchors, we can visualize any moving objects within the coverage area of the anchors. The RTLS/UWB detection part is not present in this project, so a mock is used within the "ManagerTestFloorPlansService" class. In a real context, there will instead be a service that detects moving objects called "points" and displays them on the map.

**IMPORTANT. Currently, each pixel corresponds to one centimeter. Therefore, if we have a floor plan of 19.20 meters x 10.96 meters, it must be saved as a 1920 pixel x 1096 pixel image!**

![AppPlanimetrie](/screenshot/image1.png)

`The various points (whether anchors, gateways, or simple points) are defined using the "FloorPlansPoint" class. When points are loaded, a "Marker" object is created and the respective pixel coordinates are calculated (we externally express them in meters, since the floor plan is in meters). The pixel coordinates are recalculated each time a zoom or similar operation is performed. The "Marker" object is then passed to various callback events if enabled.!`

<br>

![AppPlanimetrie](/screenshot/image2.png)

In the code example, you can see that a "FloorPlansOptions" is instantiated, through which the various map options are defined. Then, within the "loadImage()" method, the desired map image is loaded. When the loading is complete, the "createFloorPlan()" and "startPointFloorPlans()" methods are called.

The "ManagerTestFloorPlansService" service exposes an Observer, and through a subscribe(), changes are notified. For each change, the "drawFloorPlanMarker(result)" method is invoked. The desired callback events are also registered.

```javascript
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
    });
  }

  ngAfterViewInit(): void {
    this.loadImage();
  }

  loadImage(): void {
    this.imagefloorplans = new Image();
    this.imagefloorplans.src = 'planimetria2.png';
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
```

Through the "FloorPlansOptions", it is possible to define the floor plan options (axes, tool-bar, anchors, gateways, and points). There are 3 types of 'points': anchors, gateways, and points. Anchors are usually associated with 'Rtls' sensors. Gateways are usually associated with 'Rfid' sensors. Points can be static or dynamic. Dynamic points represent a detection of one or more 'Rtls' sensors (or can be sent by a system). Static points are fixed points. In addition to defining the type of point through the 'type' property of the 'FloorPlansPoint' object, it is also possible to define a type of movement through the 'typeMovement' property: 'enter', 'inside', 'leave', 'fix'. 'Enter' is used when a point enters the floor plan. 'Leave' is used when a point exits the floor plan. 'Inside' is used when a point moves within the floor plan. 'Fix' is used when a point is fixed in the floor plan (fix and inside can be equivalent). Note that the base code of the project does not directly use 'typeMovement', instead it is used by the service that receives the notifications and then inserts them into the data structure that will then be passed to the floor plan. The points (anchors, gateways, and points) can have associated metadata present in the "PointMetadata" object. Through this metadata, Overlays are created that show one or more values in real time.

### Methods of the FloorPlansMapComponent component - app-floor-plans-map

**createFloorPlan(imageplans: HTMLImageElement, options: FloorPlansOptions)**: Creates a map, passing the loaded image and the options..

**addOverlay(id: string, position: string)**: Adds an overlay to the map..

**enableBottomAxisX(value: boolean)**: Enables the bottom-positioned X-axis.

**enableLeftAxisY(value: boolean)**: Enables the left-positioned Y-axis.

**enableTopAxisX(value: boolean)**:  Enables the top-positioned X-axis.

**enableRightAxisY(value: boolean)**: Enables the right-positioned Y-axis.

**enableGridOverlay(value: boolean)**: Enables the grid overlay.

**drawFloorPlanMarker(listp: FloorPlansPoint[])**: Draws the map, initially and whenever a notification is triggered.

**setContentPosition(position: string)**: Aligns the map to the specified position (top-left, top-right, bottom-left, bottom-right',center).

**gotoContentPosition(position: string)**: Goes to the specified position on the map (position in meters).

**resetContentPosition()**: Resets the specified position.

**zoomFloorPlanFit()**: Fits the map to the container (scroll bars disappear).

**zoomIncrement()**: Increases the zoom level.

**zoomDecrement()**: Decreases the zoom level.

**resetZoom()**: Resets the zoom level.

### FloorPlansOptions

The "FloorPlansOptions" object allows you to define the floor plan options (axes, tool-bar, anchors, gateways, and points). There are 3 types of 'points': anchors, gateways, and points. Anchors are usually associated with 'Rtls' sensors. Gateways are usually associated with 'Rfid' sensors. Points can be static or dynamic. Dynamic points represent a detection of one or more 'Rtls' sensors (or can be sent by the system). Static points are fixed points.

**widthMeters**: Width in meters of the floor plan. (*number - required*).

**heightMeters**: Height in meters of the floor plan. (*number - required*).

<br>

**enablePanelOverlay**: Enable an overlay panel. (*boolean - default: false*).

**enableNavbar**: Enable a toolbar for (zoom and positioning). (*boolean - default: false*).

**enableNavbarZoom**: Enable zoom buttons within the toolbar. (*boolean - default: false*).

**enableNavbarPosition**: Enables buttons for positioning within the toolbar. (*boolean - default: false*).

**alignNavbar**: Position the toolbar to the right or left ('top-left', 'top-right'). (*string - default: top-left*).

<br>

**contentPosition**: Aligning the canvas inside the scrollable container (top-left, top-right, bottom-left, bottom-right',center). (*string - default: top-left*).

**enableSelectedPosition**: Enables point selection via the "*gotoContentPosition(position: string)*" method. The "*position*" parameter specifies the position in meters within the floor plan (e.g. 18-1). The position is highlighted as a "cross".

**contentSelectedColor**: Color of the selected position (via the "*gotoContentPosition()*" method). (*string - default: #424242*).

**contentSelectedStroke**: Stroke of the selected position (via the "*gotoContentPosition()*" method). (*string - default: #424242*).

**callbackZoom**: Callback function when zooming in or out. Or reset zoom to initial value. (*function - optional*).

<br>

**anchorRtlsUnselectedColor**: Color when an 'anchor' is in the 'unselected' state. (*string - default: #ff0000*).

**anchorRtlsUnselectedGeometry**: Geometry associated with an 'anchor' when it is in the 'unselected' state (circle, square, rhombus,  triangle, icon). (*string - default: circle*).

**anchorRtlsUnselectedRadius**: Radius of the geometry when the anchor is in the 'unselected' state (circle, square, rhombus,     triangle). (*number - default: 15*).

**anchorRtlsUnselectedPathicon**: Pathicon dell'immagine associata ad un 'ancora' quando è nello stato 'unselected' (icon). (*string*).

**anchorRtlsUnselectedIconWidth**: Width of the icon associated with an 'anchor' when it is in the 'unselected' state (icon). (*number - default: 30*).

**anchorRtlsUnselectedIconHeight**: Height of the icon associated with an 'anchor' when it is in the 'unselected' state (icon). (*number - default: 30*).

**anchorRtlsSelectedColor**: Color when an 'anchor' is in the 'selected' state. (*string - default: #ff0000*).

**anchorRtlsSelectedGeometry**: Geometry associated with an 'anchor' when it is in the 'selected' state (circle, square, rhombus,  triangle, icon). (*string - default: circle*).

**anchorRtlsSelectedRadius**: Radius of the geometry when the anchor is in the 'selected' state (circle, square, rhombus,     triangle). (*number - default: 15*).

**anchorRtlsSelectedPathicon**: Pathicon dell'immagine associata ad un 'ancora' quando è nello stato 'selected'  (icon). (*string*).

**anchorRtlsSelectedIconWidth**: Width of the icon associated with an 'anchor' when it is in the 'selected' state (icon). (*number - default: 30*).

**anchorRtlsUSelectedIconHeight**: Height of the icon associated with an 'anchor' when it is in the 'selected' state (icon). (*number - default: 30*).

**anchorRtlsPoint**: List of anchors to display, the list is formed by an array of type "*FloorPlansPoint*". (*FloorPlansPoint - default: []*).

**enableAnchorRtlsContextMenu**: Enables a "context menu" associated with the anchor that appears when you right-click. (*boolean - default: false*).

**anchorRtlsContextMenu**: "item menu" list to display when the menu is shown. The list is shared for all the 'anchors' present in the "*anchorRtlsPoint*" list. To have different "item menu" for each anchor, it is necessary to define them at the "*FloorPlansPoint*" level. (*ContextMenu - default: []*).

**callbackClickAckanchorRtls**: Callback function when clicking on an 'anchor'. (*function - optional*).

<br>

**transitRfidUnselectedColor**: Color when an 'rfid gate' is in the 'unselected' state. (*string - default: #ff0000*).

**transitRfidUnselectedGeometry**: Geometry associated with an 'rfid gate' when it is in the 'unselected' state (circle, square, rhombus,  triangle, icon). (*string - default: circle*).

**transitRfidUnselectedRadius**: Radius of the geometry when the rfid gate is in the 'unselected' state (circle, square, rhombus,     triangle). (*number - default: 15*).

**transitRfidUnselectedPathicon**: Pathicon dell'immagine associata ad un 'ancora' quando è nello stato 'unselected' (icon). (*string*).

**transitRfidUnselectedIconWidth**: Width of the icon associated with an 'rfid gate' when it is in the 'unselected' state (icon). (*number - default: 30*).

**transitRfidUnselectedIconHeight**: Height of the icon associated with an 'rfid gate' when it is in the 'unselected' state (icon). (*number - default: 30*).

**transitRfidSelectedColor**: Color when an 'rfid gate' is in the 'selected' state. (*string - default: #ff0000*).

**transitRfidSelectedGeometry**: Geometry associated with an 'rfid gate' when it is in the 'selected' state (circle, square, rhombus,  triangle, icon). (*string - default: circle*).

**transitRfidSelectedRadius**: Radius of the geometry when the rfid gate is in the 'selected' state (circle, square, rhombus,     triangle). (*number - default: 15*).

**transitRfidSelectedPathicon**: Pathicon dell'immagine associata ad un 'ancora' quando è nello stato 'selected'  (icon). (*string*).

**transitRfidSelectedIconWidth**: Width of the icon associated with an 'rfid gate' when it is in the 'selected' state (icon). (*number - default: 30*).

**transitRfidSelectedIconHeight**: Height of the icon associated with an 'rfid gate' when it is in the 'selected' state (icon). (*number - default: 30*).

**transitRfidPoint**: List of rfid gates to display, the list is formed by an array of type "*FloorPlansPoint*". (*FloorPlansPoint - default: []*).

**enabletransitRfidContextMenu**: Enables a "context menu" associated with the rfid gate that appears when you right-click. (*boolean - default: false*).

**transitRfidContextMenu**: "item menu" list to display when the menu is shown. The list is shared for all the 'rfid gates' present in the "*transitRfidPoint*" list. To have different "item menu" for each rfid gate, it is necessary to define them at the "*FloorPlansPoint*" level. (*ContextMenu - default: []*).

**callbackClickAcktransitRfid**: Callback function when clicking on an 'rfid gate'. (*function - optional*).

<br>

**pointUnselectedColor**: Color when an 'point' is in the 'unselected' state. (*string - default: #ff0000*).

**pointUnselectedGeometry**: Geometry associated with an 'point' when it is in the 'unselected' state (circle, square, rhombus,  triangle, icon). (*string - default: circle*).

**pointUnselectedRadius**: Radius of the geometry when the point is in the 'unselected' state (circle, square, rhombus,     triangle). (*number - default: 15*).

**pointUnselectedPathicon**: Pathicon dell'immagine associata ad un 'ancora' quando è nello stato 'unselected' (icon). (*string*).

**pointUnselectedIconWidth**: Width of the icon associated with an 'point' when it is in the 'unselected' state (icon). (*number - default: 30*).

**pointUnselectedIconHeight**: Height of the icon associated with an 'point' when it is in the 'unselected' state (icon). (*number - default: 30*).

**pointSelectedColor**: Color when an 'point' is in the 'selected' state. (*string - default: #ff0000*).

**pointSelectedGeometry**: Geometry associated with an 'point' when it is in the 'selected' state (circle, square, rhombus,  triangle, icon). (*string - default: circle*).

**pointSelectedRadius**: Radius of the geometry when the point is in the 'selected' state (circle, square, rhombus,     triangle). (*number - default: 15*).

**pointSelectedPathicon**: Pathicon dell'immagine associata ad un 'ancora' quando è nello stato 'selected'  (icon). (*string*).

**pointSelectedIconWidth**: Width of the icon associated with an 'point' when it is in the 'selected' state (icon). (*number - default: 30*).

**pointSelectedIconHeight**: Height of the icon associated with an 'point' when it is in the 'selected' state (icon). (*number - default: 30*).

**enabletransitRfidContextMenu**: Enables a "context menu" associated with the point that appears when you right-click. (*boolean - default: false*).

**pointContextMenu**: "item menu" list to display when the menu is shown. The list is shared for all the 'points' present in the "*pointPoint*" list. To have different "item menu" for each point, it is necessary to define them at the "*FloorPlansPoint*" level. (*ContextMenu - default: []*).

**callbackClickAcktransitRfid**: Callback function when clicking on an 'point'. (*function - optional*).

<br>

**topAxisX.TopAxisX.visibleTopAxisX**: Top X-axis visible. (*boolean - default: false*).

**topAxisX.TopAxisX.lineStrokeColor**: StrokeColor. (*string - default: black*).

**topAxisX.TopAxisX.lineWidth**: Width. (*number - default: 1*).

**topAxisX.TopAxisX.linefillColor**: FillColor. (*string - default: black*).

**topAxisX.TopAxisX.lineFont**: Font. (*string - default: 15px Arial*).

<br>

**bottomAxisX.BottomAxisX.visibleBottomAxisX**: Bottom X-axis visible. (*boolean - default: false*).

**bottomAxisX.BottomAxisX.lineStrokeColor**: StrokeColor. (*string - default: black*).

**bottomAxisX.BottomAxisX.lineWidth**: Width. (*number - default: 1*).

**bottomAxisX.BottomAxisX.linefillColor**: FillColor. (*string - default: black*).

**bottomAxisX.BottomAxisX.lineFont**: Font. (*string - default: 15px Arial*).

<br>

**leftAxisY.LeftAxisY.visibleLeftAxisY**: Y-axis left visible. (*boolean - default: false*).

**leftAxisY.LeftAxisY.lineStrokeColor**: StrokeColor. (*string - default: black*).

**leftAxisY.LeftAxisY.lineWidth**: Width. (*number - default: 1*).

**leftAxisY.LeftAxisY.linefillColor**: FillColor. (*string - default: black*).

**leftAxisY.LeftAxisY.lineFont**: Font. (*string - default: 15px Arial*).

<br>

**rightAxisY.RightAxisY.visibleRightAxisY**: Y-axis right visible. (*boolean - default: false*).

**rightAxisY.RightAxisY.lineStrokeColor**: StrokeColor. (*string - default: black*).

**rightAxisY.RightAxisY.lineWidth**: Width. (*number - default: 1*).

**rightAxisY.RightAxisY.linefillColor**: FillColor. (*string - default: black*).

**rightAxisY.RightAxisY.lineFont**: Font. (*string - default: 15px Arial*).

<br>

**gridOverlay.GridOverlay.visibleGridOverlay**: Grid overlay visible. (*boolean - default: false*).

### FloorPlansPoint

**id**: Id of the point. (*string - required*).

**group**: Specifies a grouping. (*string - optional*).

**name**: Name of the point. (*string - required*).

**metersX**: Coordinates in meters X-axis. (*number - required*).

**metersY**: Coordinates in meters Y-axis. (*number - required*).

**type**: Type of point (anchor, transit, point). (*string - required*).

**typeMovement**: Type of movement (enter, inside, leave, fix'). (*string - required*).

**enableCallbackEvent**: Enables the callback event when clicking on the point. (*boolean - required*).

**pointMetadata**: Metadata associated with the point. (*PointMetadata - optional*).

**contextMenu**: ContextMenu associated with the point. (*ContextMenu - optional*).

### PointMetadata

**id**: Id of the metadata. (*string - required*).

**name**:  Name of the metadata. (*string - required*).

**type**: Type of metadata (string, number, boolean'). (*string - required*).

**value**: Value metadata. (*any - required*).

### Marker

**id**: Id of the marker. (*string - required*).

**group**: Specifies a grouping. (*string - optional*).

**name**: Name of the marker. (*string - required*).

**metersX**: Coordinates in meters X-axis. (*number - required*).

**metersY**: Coordinates in meters Y-axis. (*number - required*).

**pixelX**: Coordinates in pixel X-axis. (*number - required*).

**pixelY**: Coordinates in pixel Y-axis. (*number - required*).

**radius**: Radius of the geometry. (*number - required*).

**enableCallbackEvent**:  Enables the callback event when clicking on the marker. (*boolean - required*).

**pointMetadata**: Metadata associated with the marker. (*PointMetadata - optional*).

**contextMenu**: ContextMenu associated with the marker. (*ContextMenu - optional*).

### ZoomValueArg

**action**: string
**zoomValue**: number
**origWidthPixel**: number
**origHeightPixel**: number
**origPixelDimensionCn**: number
**currWidthPixel**: number
**currHeightPixel**: number
**currPixelDimensionCn**: number

### PanelOverlay

**id**: string
**elem**: HTMLElement
**position**: string

### MenuItemArg

**menuitem**: ContextMenu
**marker**: Marker
