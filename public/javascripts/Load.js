


//<select> <option selected="selected" disabled="disabled">Pick a band</option> <option value="1">Band 1</option> <option value="2">Band 2</option> <option value="3">Band 3</option> <option value="4">Band 4</option> <option value="5">Band 5</option> <option value="6">Band 6</option> <option value="7">Band 7</option> <option value="8">Band 8</option> <option value="8a">Band 8a</option> <option value="9">Band 9</option> <option value="10">Band 10</option> <option value="11">Band 11</option> <option value="12">Band 12</option> </select>

//<li class="dropdown btn btn-default"><span class="glyphicon glyphicon-th-list"> Select <span class="caret"></span></span> <ul class="dropdown-menu dropdown-toggle" data-toggle="dropdown"> <li><a href="#">Band 1</a></li> <li> <a href="#">Band 2</a></li> <li><a href="#">Band 3</a></li> <li> <a href="#">Band 4</a></li> <li><a href="#">Band 5</a></li> <li> <a href="#">Band 6</a></li> <li><a href="#">Band 7</a></li> <li> <a href="#">Band 8</a></li> <li><a href="#">Band 8a</a></li> <li><a href="#">Band 9</a></li> <li> <a href="#">Band 10</a></li> <li><a href="#">Band 11</a></li> <li> <a href="#">Band 12</a></li> </ul> </li>







function opacityChanger(j){
	lyr.options.opacity = $('#opacityId'+ j ).val()/100;
	updateLyr();
}

function showOpacityLevel(i){
	$('#opacityOutputId'+ i ).html('Opacity Level:' + $('#opacityId'+ i ).val()+'%');
}

function coordsToPolygon(load){
	if(document.getElementById('searchformbybbox_topLat').value != '' &&
		 document.getElementById('searchformbybbox_bottomLat').value != '' &&
		 document.getElementById('searchformbybbox_topLong').value != '' &&
	 		 document.getElementById('searchformbybbox_bottomLong').value != ''){
	var latlon =
							[[document.getElementById('searchformbybbox_topLat').value, document.getElementById('searchformbybbox_topLong').value],
							[document.getElementById('searchformbybbox_topLat').value, document.getElementById('searchformbybbox_bottomLong').value],
							[document.getElementById('searchformbybbox_bottomLat').value,document.getElementById('searchformbybbox_bottomLong').value],
							[document.getElementById('searchformbybbox_bottomLat').value , document.getElementById('searchformbybbox_topLong').value]
							]

	var polygon = L.polygon(latlon).addTo(drawnItems);
	if(load != "true"){
		map.fitBounds(polygon.getBounds());
	}
	$('#bboxbutton').hide();
	$('#deleteDrawing').show();
	}
	else{
	$('#bboxbutton').show();
	$('#deleteDrawing').hide();
	}
}

function updateLyr(){
	map.removeLayer(lyr);
	map.addLayer(lyr);
}

function removeDatasets(){
	if (layerControl._layers.length == 4) {
		layerControl.removeLayer(lyr);
		map.removeLayer(lyr);
		$("#opacitySlider").remove();
	}
}



function stringToCoordArray(coordString){
	if(coordString != null){
		var CoordStrLen = coordString.length;
		var res = coordString.slice(9, CoordStrLen -2);
		res = res.replace(/,/g,"");
	 	res = res.split(" ");
		var coordArray = [];
		for(var i = 0; i < res.length-1; i=i+2){
			var coords = {lat: res[i+1], lng:res[i]};
			coordArray.push(coords);
		}
		return coordArray;
	}
}

function drawPolygon(result, number, page){
	var coordArray = stringToCoordArray(result[number].FOOTPRINT);
	if(coordArray != null){
		var polygon = L.polygon(coordArray, {color: 'red', number:number, resultLength:result.length});
		polygon.on('click', openAccordion);
		polygon.bindTooltip('<p> Dataset '+(((page-1)*8)+(number+1))+'</p>').addTo(map);
		polygon.addTo(polyLayer);
	}
}

function zoomToLayer(j){
	polyLayer.eachLayer(function(layer){
		if(layer.options.number == (j-1)){
			map.fitBounds(layer.getBounds());
			polyLayer.clearLayers();
		}
});
//testen hier bug fix, 2. laden geht nicht
}

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

function openTabInSidebar(hash) {
	$(".sidebar-tabs").find(".active").removeClass("active");
	$("#sidebar").removeClass("collapsed");
	$(".sidebar-content").find(".active").removeClass("active");
	$(hash).addClass("active");
	$(hash+"TabButton").addClass("active");
}

function toggleDrop(i,j){
	$('#dropd'+i).show();
	$('#dropd'+j).hide();
}

function findArray(bandArray, band){
	var number = 0;
	for(var i = 0; i<bandArray.length;i++){
		if(bandArray[i] == band){
			number = i;
			break;
		}
	}
	return number;
}

function toggleIt(i){
    var x = document.getElementById(i);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
/*function detectLong(output){
    var vorzeichen;
  if(output< 0){
    vorzeichen = -1;
  }
  else{
    vorzeichen = 1;
  }

  output=Math.abs(output);
  var zahl = Math.floor(output/180)%2;
  console.log(zahl);
  output= output%180;
  if(zahl === 0){
    output = output*vorzeichen;
  }
  else {
    console.log(output);
    output = output - (output*vorzeichen);
  }
  console.log('output= ' +  output);
  return output;

  }*/
