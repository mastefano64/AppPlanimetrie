## AppPlanimetrie

### Introduzione

Quando si parla di mappe geolocalizzate viene subito in mente l'accoppiata OpenLayer/GPS (per esempio). Il problema è che questo sistema funziona bene in spazi aperti, ma perde di precesione in spazi chiusi. In un contesto simile (spazi chiusi) entra in gioco la tecnologia RTLS/UWB (lasciando perdere i vari dettagli), da un punto di vista tecnico RTLS/UWB si avvale di una banda spettrale estremamente elevata che sfrutta una pluralità di frequenze dell’ordine dei GHz (generalmente fra i 3 e i 7). Generalmente viene preso in considerazione il ToF (Time of Flight, tempo di “volo” del segnale) ovvero il tempo necessario al segnale radio emesso dal tag per raggiungere l’ancora di riferimento (generalmente esistono 3 o più ancore di riferimento e viene fatta una trilaterazione). Questo per stabilire la posizione in "metri" di un oggetto dotato di TAG all'interno di un abiente chiuso (spiegato in parole semplici, la realtà potrebbe essere più complessa).

#### <center>Trovandoci in un abiente chiuso potrebbero non essere più usate le comuni mappe, ma bensì delle planimetrie dell'abiente in scala! </center> ####

### Progetto

>Partendo da una planimetria in scala (per esempio) 19.20 metri x 10.96 metri e salvata come immagine 1920 pixel x 1096 pixel, dove ad ogni pixel corrisponde un cm. E dopo aver renderizzato immagine all'interno di un canvas, ed inserito il canvas all'interno di un contenitore di opportune dimensioni (per permettere lo scroll dell'immagine), fornisce una visione di mappa.<br><br>Come menzionato all'inizio, su questa mappa possono essere posizionati sia ancore RTLS/UWB, piuttosto che dei varchi RFID. La posizione di questi punti base è ovviamente statica, ma è possibile  visualizzare eventuali oggetti in movimento. IMPORTANTE: la parte di rilevazione RTLS/UWB non è compresa nel presente progetto, ma in questo caso viene utilizzato un mock contenuto nella classe "*ManagerTestFloorPlansService*". In un contesto reale ci sarà un servizio che rileva gli oggetti in movimento chiamati "punti", e li mostra sulla mappa.

Immagine1

Tramite le "*FloorPlansOptions*" è possibile definire le opzioni della planimetria (assi, tool-bar, ancore, varchi e punti).
Esistono 3 tipi di 'punti': ancore, varchi e punti. Le ancore sono di solito associate a sensori 'Rtls'. I varchi sono di solito associati a sensori 'Rfid'. I punti possono essere statici o dinamici. I punti dinamici rappresentano un rilevamanto di uno o più sensori 'Rtls' (o possono essere inviati da sistema). I punti statici sono punti fissi. Oltre a definire il tipo di punto tramite la proprietà 'type' dell oggetto 'FloorPlansPoint', è anche possibile definire un tipo di movimento tramite la proprietà 'typeMovement': 'enter', 'inside', 'leave', 'fix'. 'Enter' viene usato quando un punto entra nella planimetria. 'Leave' viene usato quando un punto esce nella planimetria. 'Inside' viene usato quando un punto si muove nella planimetria. 'Fix' viene usato quando un punto è fisso nella planimetria (fix e inside possono essere equivalenti). Da notare che il codice base del progetto non usa direttamente 'typeMovement', ma verrà invece utilizzato dal servizio che riceve le notifiche e le inserisce poi nella struttura dati che verrà poi passata alla planimetria. I punti (ancore, varchi e punti) possono anche avere associati dei metadati presenti nell'oggetto "*PointMetadata*".

`Quando i punti vengono caricati, viene creato un oggetto di tipo "Marker" e vengono calcomate le coordinate in pixel. Le coordinate in pixel vengono ricalcolate ogno volta che si effettua uno zoom o un operazione analoga. L'oggetto "Marker" viene poi passato ai vari eventi di callback!`

### FloorPlansOptions

Tramite le "*FloorPlansOptions*" è possibile definire le opzioni della planimetria (assi, tool-bar, ancore, varchi e punti). Esistono 3 tipi di 'punti': ancore, varchi e punti. Le ancore sono di solito associate a sensori 'Rtls'. I varchi sono di solito associati a sensori 'Rfid'. I punti possono essere statici o dinamici. I punti dinamici rappresentano un rilevamanto di uno o più sensori 'Rtls' (o possono essere inviati da sistema). I punti statici sono punti fissi.

**widthMeters**: Larghezza in metri della planimeria. (*number - required*).

**heightMeters**: Altezza in metri della planimetria. (*number - required*).

<br>

**gridOverlay.GridOverlay.visibleGridOverlay**: Grif overlay visibile. (*boolean - default: false*).

**rightAxisY.RightAxisY.lineStrokeColor**: StrokeColor. (*string - default: black*).

**rightAxisY.RightAxisY.lineWidth**: Width. (*number - default: 1*).

<br>

**enablePanelOverlay**: Abilita un pannello di overlay. (*boolean - default: false*).

**enableNavbar**: Abilita una tool-bar per (zoom e posizionamento). (*boolean - default: false*).

**enableNavbarZoom**: Abilita i pulsanti per lo zoom all'interno della tool-bar. (*boolean - default: false*).

**enableNavbarPosition**: Abilita i pulsanti per il posizionamento all'interno della tool-bar. (*boolean - default: false*).

**alignNavbar**: Posiziona la tool-bar a destra o a sinistra ('top-left', 'top-right'). (*string - default: top-left*).

<br>

**contentPosition**: Allineamento del canvas all'interno del contenitore scrollabile (top-left, top-right, bottom-left, bottom-right',center). (*string - default: top-left*).

**enableSelectedPosition**: Abilita la selezione di un punto tramite il metodo "*gotoContentPosition(position: string)*". Il parametro
"*position*" specifica la posizione in metri all'interno della planimetria (es. 18-1). La posizione viene evidenziata sotto forma di "croce".

**contentSelectedColor**: Color della posizione selezionata (tramite il metodo "*gotoContentPosition()*"). (*string - default: #424242*).

**contentSelectedStroke**: Stroke della posizione selezionata (tramite il metodo "*gotoContentPosition()*"). (*string - default: #424242*).

**callbackZoom**: Funzione di callback quando si effettua uno zoom per ingrandire o rimpicciolire. O si resetta lo zoom al valore 
iniziale. (*function - optional*).

<br>

**anchorRtlsUnselectedColor**: Color quando un 'ancora' è nello stato 'unselected'. (*string - default: #ff0000*).

**anchorRtlsUnselectedGeometry**:?: Geometria associata ad un 'ancora' quando è nello stato 'unselected' (circle, square, rhombus,     triangle, icon). (*string - default: circle*).

**anchorRtlsUnselectedRadius**: Radius della geometria quando l'ancora è nello stato 'unselected' (circle, square, rhombus,     triangle). (*number - default: 15*).;

**anchorRtlsUnselectedPathicon**: Pathicon dell'immagine associata ad un 'ancora' quando è nello stato 'unselected' (icon). (*string*).;

**anchorRtlsUnselectedIconWidth**: Larghezza dell'icona associata ad un 'ancora' quando è nello stato 'unselected' (icon). (*number - default: 30*).

**anchorRtlsUnselectedIconHeight**: Altezza dell'icona associata ad un 'ancora' quando è nello stato 'unselected' (icon). (*number - default: 30*).

**anchorRtlsSelectedColor**: Color quando un 'ancora' è nello stato 'selected'. (*string - default: #ff0000*).

**anchorRtlsSelectedGeometry**:?: Geometria associata ad un 'ancora' quando è nello stato 'selected' (circle, square, rhombus,     triangle, icon). (*string - default: circle*).

**anchorRtlsSelectedRadius**: Radius della geometria quando l'ancora è nello stato 'selected' (circle, square, rhombus,     triangle). (*number - default: 15*).;

**anchorRtlsSelectedPathicon**: Pathicon dell'immagine associata ad un 'ancora' quando è nello stato 'selected' (icon). (*string*).;

**anchorRtlsSelectedIconWidth**: Larghezza dell'icona associata ad un 'ancora' quando è nello stato 'selected' (icon). (*number - default: 30*).

**anchorRtlsUSelectedIconHeight**: Altezza dell'icona associata ad un 'ancora' quando è nello stato 'selected' (icon). (*number - default: 30*).

**anchorRtlsPoint**: Lista ancore da visualizzare, la lista è formata da un array di tipo "*FloorPlansPoint*". (*FloorPlansPoint - default: []*).

**enableAnchorRtlsContextMenu**: Abilita un "context menu" associato all'ancora che viene visualizzato tramite tasto destro del mouse. (*boolean - default: false*).

**anchorRtlsContextMenu**: Lista "item menu" da visualizzare nel momento in cui viene mostrato il menu. La lista è condivisa per tutte le 'ancore' presenti nella lista "*anchorRtlsPoint*". Per avere "item menu" diversi per ogni ancora, è necessario definirli a livello di "*FloorPlansPoint*". (*ContextMenu - default: []*).

**callbackClickAckanchorRtls**: Funzione di callback quando si clicca su un 'ancora'. (*function - optional*).

<br>

**transitRfidUnselectedColor**: Color quando un 'varco rfid' è nello stato 'unselected'. (*string - default: #ff0000*).

**transitRfidUnselectedGeometry**:?: Geometria associata ad un 'varco rfid 'quando è nello stato 'unselected' (circle, square, rhombus,     triangle, icon). (*string - default: circle*).

**transitRfidUnselectedRadius**: Radius della geometria quando il 'varco rfid' è nello stato 'unselected' (circle, square, rhombus,     triangle). (*number - default: 15*).;

**transitRfidUnselectedPathicon**: Pathicon dell'immagine associata ad un 'varco rfid' quando è nello stato 'unselected' (icon). (*string*).;

**transitRfidUnselectedIconWidth**: Larghezza dell'icona associata ad un 'varco rfid' quando è nello stato 'unselected' (icon). (*number - default: 30*).

**transitRfidUnselectedIconHeight**: Altezza dell'icona associata ad un 'varco rfid' quando è nello stato 'unselected' (icon). (*number - default: 30*).

**transitRfidSelectedColor**: Color quando un 'varco rfid' è nello stato 'selected'. (*string - default: #ff0000*).

**transitRfidSelectedGeometry**:?: Geometria associata ad un 'varco rfid' quando è nello stato 'selected' (circle, square, rhombus,     triangle, icon). (*string - default: circle*).

**transitRfidSelectedRadius**: Radius della geometria quando il 'varco rfid' è nello stato 'selected' (circle, square, rhombus,     triangle). (*number - default: 15*).;

**transitRfidSelectedPathicon**: Pathicon dell'immagine associata ad un 'varco rfid' quando è nello stato 'selected' (icon). (*string*).;

**transitRfidSelectedIconWidth**: Larghezza dell'icona associata ad un 'varco rfid' quando è nello stato 'selected' (icon). (*number - default: 30*).

**transitRfidUSelectedIconHeight**: Altezza dell'icona associata ad un 'varco rfid' quando è nello stato 'selected' (icon). (*number - default: 30*).

**transitRfidPoint**: Lista 'varchi rfid' da visualizzare, la lista è formata da un array di tipo "*FloorPlansPoint*". (*FloorPlansPoint - default: []*).

**enableTransitRfidContextMenu**: Abilita un "context menu" associato al 'varco rfid' che viene visualizzato tramite tasto destro del mouse. (*boolean - default: false*).

**transitRfidContextMenu**: Lista "item menu" da visualizzare nel momento in cui viene mostrato il menu. La lista è condivisa per tutti i 'varchi rfid' presenti nella lista "*transitRfidPoint*". Per avere "item menu" diversi per ogni ancora, è necessario definirli a livello di "*FloorPlansPoint*". (*ContextMenu - default: []*).

**callbackClickTransitRfid**: Funzione di callback quando si clicca su un 'varco rfid'. (*function - optional*).

<br>

**pointUnselectedColor**: Color quando un 'punto' è nello stato 'unselected'. (*string - default: #ff0000*).

**pointUnselectedGeometry**:?: Geometria associata ad un 'punto' quando è nello stato 'unselected' (circle, square, rhombus,     triangle, icon). (*string - default: circle*).

**pointUnselectedRadius**: Radius della geometria quando un punto è nello stato 'unselected' (circle, square, rhombus,     triangle). (*number - default: 15*).;

**pointUnselectedPathicon**: Pathicon dell'immagine associata ad un 'punto' quando è nello stato 'unselected' (icon). (*string*).;

**pointUnselectedIconWidth**: Larghezza dell'icona associata ad un 'punto' quando è nello stato 'unselected' (icon). (*number - default: 30*).

**pointUnselectedIconHeight**: Altezza dell'icona associata ad un 'punto' quando è nello stato 'unselected' (icon). (*number - default: 30*).

**pointSelectedColor**: Color quando un 'punto' è nello stato 'selected'. (*string - default: #ff0000*).

**pointSelectedGeometry**:?: Geometria associata ad un 'punto' quando è nello stato 'selected' (circle, square, rhombus,     triangle, icon). (*string - default: circle*).

**pointSelectedRadius**: Radius della geometria quando un punto è nello stato 'selected' (circle, square, rhombus,     triangle). (*number - default: 15*).;

**pointSelectedPathicon**: Pathicon dell'immagine associata ad un 'punto' quando è nello stato 'selected' (icon). (*string*).;

**pointSelectedIconWidth**: Larghezza dell'icona associata ad un 'punto' quando è nello stato 'selected' (icon). (*number - default: 30*).

**pointSelectedIconHeight**: Altezza dell'icona associata ad un 'punto' quando è nello stato 'selected' (icon). (*number - default: 30*).

**enablePointContextMenu**: Abilita un "context menu" associato al punto che viene visualizzato tramite tasto destro del mouse. (*boolean - default: false*).

**pointContextMenu**: Lista "item menu" da visualizzare nel momento in cui viene mostrato il menu. Per avere "item menu" diversi per ogni punto, è necessario definirli a livello di "*FloorPlansPoint*". (*ContextMenu - default: []*).

**callbackClickPoint**: Funzione di callback quando si clicca su un 'punto'. (*function - optional*).

<br>

**topAxisX.TopAxisX.visibleTopAxisX**: Asse X top visibile. (*boolean - default: false*).

**topAxisX.TopAxisX.lineStrokeColor**: StrokeColor. (*string - default: black*).

**topAxisX.TopAxisX.lineWidth**: Width. (*number - default: 1*).

**topAxisX.TopAxisX.linefillColor**: FillColor. (*string - default: black*).

**topAxisX.TopAxisX.lineFont**: Font. (*string - default: 15px Arial*).

<br>

**bottomAxisX.BottomAxisX.visibleBottomAxisX**: Asse X top visibile. (*boolean - default: false*).

**bottomAxisX.BottomAxisX.lineStrokeColor**: StrokeColor. (*string - default: black*).

**bottomAxisX.BottomAxisX.lineWidth**: Width. (*number - default: 1*).

**bottomAxisX.BottomAxisX.linefillColor**: FillColor. (*string - default: black*).

**bottomAxisX.BottomAxisX.lineFont**: Font. (*string - default: 15px Arial*).

<br>

**leftAxisY.LeftAxisY.visibleLeftAxisY**: Asse X top visibile. (*boolean - default: false*).

**leftAxisY.LeftAxisY.lineStrokeColor**: StrokeColor. (*string - default: black*).

**leftAxisY.LeftAxisY.lineWidth**: Width. (*number - default: 1*).

**leftAxisY.LeftAxisY.linefillColor**: FillColor. (*string - default: black*).

**leftAxisY.LeftAxisY.lineFont**: Font. (*string - default: 15px Arial*).

<br>

**rightAxisY.RightAxisY.visibleRightAxisY**: Asse X top visibile. (*boolean - default: false*).

**rightAxisY.RightAxisY.lineStrokeColor**: StrokeColor. (*string - default: black*).

**rightAxisY.RightAxisY.lineWidth**: Width. (*number - default: 1*).

**rightAxisY.RightAxisY.linefillColor**: FillColor. (*string - default: black*).

**rightAxisY.RightAxisY.lineFont**: Font. (*string - default: 15px Arial*).

### FloorPlansPoint

**id**: Id del punti. (*string - required*).

**group**: Spefifica un raggruppamento. (*string - optional*).

**name**: Nome del punto. (*string - required*).

**metersX**: Coordinate in metri asse X. (*number - required*).

**metersY**: Coordinate in metri asse Y. (*number - required*).

**type**: Tipo punto (anchor, transit, point). (*string - required*).

**typeMovement**: Tipo movimento (enter, inside, leave, fix'). (*string - required*).

**enableCallbackEvent**: Abilita l'evento di callback quando si clicca sul punto. (*boolean - required*).

**pointMetadata**: Metadati associati al punto. (*PointMetadata - optional*).

**contextMenu**: ContextMenu associato al punto. (*ContextMenu - optional*).

### PointMetadata

**id**: Id del metadato. (*string - required*).

**name**: Nome del metadato. (*string - required*).

**type**: Tipo metadato (string, number, boolean'). (*string - required*).

**value**: Valore metadato. (*any - required*).

### Marker

**id**: Id del marker. (*string - required*).

**group**: Spefifica un raggruppamento. (*string - optional*).

**name**: Nome del marker. (*string - required*).

**metersX**: Coordinate in metri asse X. (*number - required*).

**metersY**: Coordinate in metri asse Y. (*number - required*).

**pixelX**: Coordinate in pixel asse X. (*number - required*).

**pixelY**: Coordinate in pixel asse Y. (*number - required*).

**radius**: Radius della geometria. (*number - required*).

**enableCallbackEvent**: Abilita l'evento di callback quando si clicca sul marker. (*boolean - required*).

**pointMetadata**: Metadati associati al marker. (*PointMetadata - optional*).

**contextMenu**: ContextMenu associato al marker. (*ContextMenu - optional*).

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
