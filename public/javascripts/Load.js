/**
 *Zeigt die Deckungskraft Level an oder aktualisiert es
 *@param i Nummer des Datasets, bei dem die Deckungskraft angezeigt werden soll
*/
function showOpacityLevel(i){
	$('#opacityOutputId'+ i ).html('Opacity Level:' + $('#opacityId'+ i ).val()+'%');
}

/**
 *Aktualisiert die Deckungskraft von angezeigten Datasets.
 *@param j Nummer des Datasets, bei dem die Opactiy angezeigt werden soll
*/
function opacityChanger(j){
	lyr.options.opacity = $('#opacityId'+ j ).val()/100;
	//Layer muss geupdatet werden nach Veränderung
	updateLyr();
}

/**
 *Aktualisiert die Deckungskraft von angezeigten Datasets.
 *Dazu wird das Layer von der Karte entfernt und neu hinzugefügt.
*/
function updateLyr(){
	map.removeLayer(lyr);
	map.addLayer(lyr);
}

/**
 *Entfernt das angezeigte Dataset von der Karte, dem Layercontorl und den Opactiyslider, wenn eins vorhanden ist.
*/
function removeDatasets(){
	if (layerControl._layers.length == 4) {
		layerControl.removeLayer(lyr);
		map.removeLayer(lyr);
		$("#opacitySlider").remove();
	}
}

/**
 *Öffnet ein Akkordion. Wird ausgeführt nach Klick auf ein Polygon.
*/
function openAccordion(){
	hash = '#search';
  openTabInSidebar(hash);
	for(var i = 1; i < this.options.resultLength+1; i++){
		if(i == (this.options.number+1)){
			$("#dataset"+(this.options.number+1)).collapse('show');
		}else{
			$("#dataset"+i).collapse('hide');
		}
	}
}

/**
 *Öffnet die Sidebar und den angegeben Tab.
 *@param hash ID des zu öffnenden Tabs
*/
function openTabInSidebar(hash) {
	$(".sidebar-tabs").find(".active").removeClass("active");
	$("#sidebar").removeClass("collapsed");
	$(".sidebar-content").find(".active").removeClass("active");
	$(hash).addClass("active");
	$(hash+"TabButton").addClass("active");
}
