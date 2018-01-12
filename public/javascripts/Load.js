function createInnerHTML(length, pagetoview, res){
	for(i=1;i < length+1; i++){
		$('#one').html($('#one').html() + '<div class="panel panel-default"> <a class="text-muted" data-toggle="collapse" data-target="#dataset' + i + '"><div class="panel-heading"><span class="glyphicon glyphicon-open" aria-hidden="true"></span> Dataset '+ (8*(pagetoview-1)+i) +'</div></a><span class="panel-body panel-collapse collapse out" id="dataset'+i+'"> <p id="quality" style="padding: 15px; padding-bottom:0px">Metadata:</p> <p id="resolution'+i+'" style="padding: 15px; padding-top: 0px"></p> '
										+ ' <form class="colorform" id="showData' + i + '" method="POST"> <container> <input id="rgb'+i+'" type="radio" name="rgbbool" value="true" onclick="toggleDrop('+(i*2)+','+((i*2)+1)+')"/> RGB<br/> <label for="rgb" class="dropd" id="dropd'+(i*2)+'"> '
										+ ' Red band:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <select name="rcn" id="rgbselect' + ((i*3)-2)+ '"> <option selected="selected" disabled="disabled">Pick a band</option> <option value="B1">Band 1</option> <option value="B2">Band 2</option> <option value="B3">Band 3</option> <option value="B4">Band 4</option> <option value="B5">Band 5</option> <option value="B6">Band 6</option> <option value="B7">Band 7</option> <option value="B8">Band 8</option> <option value="B8a">Band 8a</option> <option value="B9">Band 9</option> <option value="B10">Band 10</option> <option value="B11">Band 11</option> <option value="B12">Band 12</option> </select> <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Min-Value: <input type="number" name="rcmin" id="minRed" placeholder="0" value="0"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Max-Value: <input type="number" name="rcmax" maxlength="5" placeholder="65536" value="65536"/><br/><br/> '
										+ ' Green band:&nbsp;&nbsp; <select name="gcn" id="rgbselect' + ((i*3)-1)+ '" value="0"> <option selected="selected" disabled="disabled" value="0">Pick a band</option> <option value="B1">Band 1</option> <option value="B2">Band 2</option> <option value="B3">Band 3</option> <option value="B4">Band 4</option> <option value="B5">Band 5</option> <option value="B6">Band 6</option> <option value="B7">Band 7</option> <option value="B8">Band 8</option> <option value="B8a">Band 8a</option> <option value="B9">Band 9</option> <option value="B10">Band 10</option> <option value="B11">Band 11</option> <option value="B12">Band 12</option> </select> <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Min-Value: <input type="number" name="gcmin" maxlength="5" placeholder="0" value="0"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Max-Value: <input type="number" name="gcmax" maxlength="5" placeholder="65536" value="65536"/><br/><br/> '
										+ ' Blue band:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <select name="bcn" id="rgbselect' + (i*3)+ '" value="0"> <option selected="selected" disabled="disabled" value="0">Pick a band</option> <option value="B1">Band 1</option> <option value="B2">Band 2</option> <option value="B3">Band 3</option> <option value="B4">Band 4</option> <option value="B5">Band 5</option> <option value="B6">Band 6</option> <option value="B7">Band 7</option> <option value="B8">Band 8</option> <option value="B8a">Band 8a</option> <option value="B9">Band 9</option> <option value="B10">Band 10</option> <option value="B11">Band 11</option> <option value="B12">Band 12</option> </select> <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Min-Value: <input type="number" name="bcmin" maxlength="5" placeholder="0" value="0"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Max-Value: <input type="number" name="bcmax" maxlength="5" placeholder="65536" value="65536"/><br/> </label><br/> '
										+ ' <input id="grey'+i+'" type="radio" name="rgbbool" value="false" onclick="toggleDrop('+((i*2)+1)+','+(i*2)+')"/> Greyscale<br/> <label for="grey" class="dropd" id="dropd'+((i*2)+1)+'"> '
										+ ' Choose a band:&nbsp;&nbsp; <select name="gsc" id="greyselect'+i+'" value="0"> <option selected="selected" disabled="disabled" value="0">Pick a band</option> <option value="B1">Band 1</option> <option value="B2">Band 2</option> <option value="B3">Band 3</option> <option value="B4">Band 4</option> <option value="B5">Band 5</option> <option value="B6">Band 6</option> <option value="B7">Band 7</option> <option value="B8">Band 8</option> <option value="B8a">Band 8a</option> <option value="B9">Band 9</option> <option value="B10">Band 10</option> <option value="B11">Band 11</option> <option value="B12">Band 12</option> </select><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Min-Value: <input type="number" name="greymin" maxlength="5" placeholder="0" value="0"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Max-Value: <input type="number" name="greymax" maxlength="5" placeholder="65536" value="65536"/><br/><br/> </label> </container> <br/> '
										+ ' <button type="submit" id="formSubmiter'+i+'" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span> Show this dataset</button> </form> </span> </div>');
	}

	return $('#one').html();
}


function createHTML(res, pagetoview){
	$('#one').html("");
	$('#one').html('<div class="panel-panel-default" id="resultpanel">'
	+ createInnerHTML(res.length, pagetoview) + '</div>');
	for(j=1; j<(res.length+1); j++){
		 createSubmitHandler(res, j);
	}
}


function coordsToPolygon(){
	var latlon =
							[[document.getElementById('searchformbybbox_topLat').value, document.getElementById('searchformbybbox_topLong').value],
							[document.getElementById('searchformbybbox_topLat').value, document.getElementById('searchformbybbox_bottomLong').value],
							[document.getElementById('searchformbybbox_bottomLat').value,document.getElementById('searchformbybbox_bottomLong').value],
							[document.getElementById('searchformbybbox_bottomLat').value , document.getElementById('searchformbybbox_topLong').value]
							]

							var polygon = L.polygon(latlon, {color: 'red'}).addTo(drawnItems);
							map.fitBounds(polygon.getBounds());
}

//<select> <option selected="selected" disabled="disabled">Pick a band</option> <option value="1">Band 1</option> <option value="2">Band 2</option> <option value="3">Band 3</option> <option value="4">Band 4</option> <option value="5">Band 5</option> <option value="6">Band 6</option> <option value="7">Band 7</option> <option value="8">Band 8</option> <option value="8a">Band 8a</option> <option value="9">Band 9</option> <option value="10">Band 10</option> <option value="11">Band 11</option> <option value="12">Band 12</option> </select>

//<li class="dropdown btn btn-default"><span class="glyphicon glyphicon-th-list"> Select <span class="caret"></span></span> <ul class="dropdown-menu dropdown-toggle" data-toggle="dropdown"> <li><a href="#">Band 1</a></li> <li> <a href="#">Band 2</a></li> <li><a href="#">Band 3</a></li> <li> <a href="#">Band 4</a></li> <li><a href="#">Band 5</a></li> <li> <a href="#">Band 6</a></li> <li><a href="#">Band 7</a></li> <li> <a href="#">Band 8</a></li> <li><a href="#">Band 8a</a></li> <li><a href="#">Band 9</a></li> <li> <a href="#">Band 10</a></li> <li><a href="#">Band 11</a></li> <li> <a href="#">Band 12</a></li> </ul> </li>
function radioValue(radios, j){
	for (var i = ((j-1)*2); i < (((j-1)*2)+2); i++)
	{
		if (radios[i].checked)
		{
		  return(radios[i].value);
		}
	}
	return "unknown";
}


function subdataName(res, value, j){
	console.log("Started subdataName.");
	var index = ["B2", "B3", "B4", "B8", "B5", "B6", "B7", "B8a", "B11", "B12", "B1", "B9", "B10"].indexOf(value);
	console.log(index);
	if(index < 0){
		return "";
	}
	if(index < 4){
		return res[j-1].SUBDATASET_1_NAME;
	}
	else if (index > 9) {
		return res[j-1].SUBDATASET_3_NAME;
	}
	else
		return res[j-1].SUBDATASET_2_NAME;
}



function createSubmitHandler(res, j){
	$('#showData'+ j).submit(function(e) {
		spinnerShow(document.getElementById('map'));
		e.preventDefault();
	    //Prüfe ob die Eingabefelder für die Marker nicht leer sind
	    if (
	    (
			((radioValue(document.getElementsByName('rgbbool'),j)) == "true") &&
			($('#rgbselect'+ ((j*3)-2)).val()  !== null) &&
			($('#rgbselect'+ ((j*3)-1)).val() !== null) &&
			($('#rgbselect'+ (j*3)).val()  !== null)
	    ) || (
			((radioValue(document.getElementsByName('rgbbool'),j)) == "false") &&
	        ($('#greyselect'+ j).val() !== null))
		)
	    {
    			var redSDNInput = $('<input type="hidden" name="rcdn" value=' + subdataName(res, $('#rgbselect'+ ((j*3)-2)).val(), j) + '>');
	        var greenSDNInput = $('<input type="hidden" name="gcdn" value=' + subdataName(res, $('#rgbselect'+ ((j*3)-1)).val(), j) + '>');
	        var blueSDNInput = $('<input type="hidden" name="bcdn" value=' + subdataName(res, $('#rgbselect'+ ((j*3))).val(), j) + '>');
	        var greySDNInput = $('<input type="hidden" name="gscdn" value=' + subdataName(res, $('#greyselect'+ j).val(), j) + '>');

	        $(this).append(redSDNInput);
	        $(this).append(greenSDNInput);
	        $(this).append(blueSDNInput);
	        $(this).append(greySDNInput);
	        var that = this;

	        // submit via ajax
	        $.ajax({
	          data: $(that).serialize(),
	          type: $(that).attr('method'),
	          url:  'http://gis-bigdata.uni-muenster.de:14014/generate?',
	          error: function(xhr, status, err) {
	            console.log("Error while loading Data");
							spinnerHide(document.getElementById('map'));
	            alert("Error while loading Data");
	          },
	          success: function(res) {
							removeDatasets();
							spinnerHide(document.getElementById('map'));
	              console.log("Data successfully loaded.");
	              lyr = L.tileLayer(
					'http://gis-bigdata.uni-muenster.de:14014/data/' + res + '/{z}/{x}/{-y}.png',
					{
					  tms: true,
					  continuousWorld: true,
						opacity: 100,
					}

				);
				  layerControl.addOverlay(lyr, "Dataset");
					map.addLayer(lyr);
					zoomToLayer(j);
					$('#dataset'+j).append('<div id="opacitySlider" style="padding: 15px; padding-top: 0px"> <p>Choose your opacity:</p> <input type="range" name="opacity" id="opacityId'+j+'" value="100" min="0" max="100" oninput="showOpacityLevel('+j+')" onchange="opacityChanger('+j+')"/><output name="opacityOutput" id="opacityOutputId'+j+'">Opacity Level: 100%</output> </div>');
				  }
	        });
	        redSDNInput.remove();
	        greenSDNInput.remove();
	        blueSDNInput.remove();
	        greenSDNInput.remove();
	    }
		else
		{
    		//console.log("falseeeee: " + j);
				spinnerHide(document.getElementById('map'));
	    	alert("Please define requested values before clicking the Show this dataset -Button");
		}
	});
		//console.log("Submit overwritten.")
}

function opacityChanger(j){
	lyr.options.opacity = $('#opacityId'+ j ).val()/100;
	updateLyr();
}

function showOpacityLevel(i){
	$('#opacityOutputId'+ i ).html('Opacity Level:' + $('#opacityId'+ i ).val()+'%');
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


function visualizeMetadata(res){
	polyLayer.clearLayers();
	for(i=0; i < res.length; i++){
		$('#resolution' + (i+1)  ).html(
		"<b> Cloud Coverage Assesment: </b>" + res[i].CLOUD_COVERAGE_ASSESSMENT +  "</br>" +
		"<b> Datatake Sensing Start: </b>" + res[i].DATATAKE_1_DATATAKE_SENSING_START + "</br>" +
		"<b> Datatkae Type: </b>" + res[i].DATATAKE_1_DATATAKE_TYPE + "</br>" +
		"<b> Datatake ID: </b>" + res[i].DATATAKE_1_ID + "</br>" +
		"<b> Sensing Orbit Direction: </b>" + res[i].DATATAKE_1_SENSING_ORBIT_DIRECTION + "</br>" +
		"<b> Sensing Orbit Number: </b>" + res[i].DATATAKE_1_SENSING_ORBIT_NUMBER + "</br>" +
		"<b> Spacecraft Name: </b>" + res[i].DATATAKE_1_SPACECRAFT_NAME + "</br>" +
		"<b> Degraded ANC Data Percentage: </b>" + res[i].DEGRADED_ANC_DATA_PERCENTAGE + "</br>" +
		"<b> Degraded MSI Data Percentage: </b>" + res[i].DEGRADED_MSI_DATA_PERCENTAGE + "</br>" +
		"<b> Footprint: </b>" + res[i].FOOTPRINT + "</br>" +
		"<b> Format Correctness Flag: </b>" + res[i].FORMAT_CORRECTNESS_FLAG + "</br>" +
		"<b> General Quality Flag: </b>" + res[i].GENERAL_QUALITY_FLAG + "</br>" +
		"<b> Generation Time: </b>" + res[i].GENERATION_TIME + "</br>" +
		"<b> Geometric Quality Flag: </b>" + res[i].GEOMETRIC_QUALITY_FLAG + "</br>" +
		"<b> Preview Geo Info: </b>" + res[i].PREVIEW_GEO_INFO + "</br>" +
		"<b> Preview Image-Url: </b>" + res[i].PREVIEW_IMAGE_URL +"</br>" +
		"<b> Processing Baseline: </b>" + res[i].PROCESSING_BASELINE + "</br>" +
		"<b> Processing Level: </b>" + res[i].PROCESSING_LEVEL + "</br>" +
		"<b> Product Start Time: </b>" + res[i].PRODUCT_START_TIME + "</br>" +
		"<b> Product Stop Time: </b>" + res[i].PRODUCT_STOP_TIME + "</br>" +
		"<b> PRODUCT_TYPE: </b>" + res[i].PRODUCT_TYPE + "</br>" +
		"<b> PRODUCT_URI: </b>" + res[i].PRODUCT_URI + "</br>" +
		"<b> Quantification Value: </b>" + res[i].QUANTIFICATION_VALUE + "</br>" +
		"<b> Radiometric Quality Flag: </b>" + res[i].RADIOMETRIC_QUALITY_FLAG + "</br>"+
		"<b> Reference Band: </b>" + res[i].REFERENCE_BAND + "</br>" +
		"<b> Reflectance Conversion U: </b>" + res[i].REFLECTANCE_CONVERSION_U + "</br>" +
		"<b> Sensor Quality Flag: </b>" + res[i].SENSOR_QUALITY_FLAG + "</br>" +
		"<b> Special Value Nodata: </b>" + res[i].SPECIAL_VALUE_NODATA + "</br>" +
		"<b> Special Value Saturated: </b>" + res[i].SPECIAL_VALUE_SATURATED + "</br>" +
		"<b> Subdataset 1 Description: </b>" + res[i].SUBDATASET_1_DESC + "</br>" +
		"<b> Subdataset 1 Name: </b>" + res[i].SUBDATASET_1_NAME + "</br>" +
		"<b> Subdataset 2 Description: </b>" + res[i].SUBDATASET_2_DESC + "</br>" +
		"<b> Subdataset 2 Name: </b>" + res[i].SUBDATASET_2_NAME + "</br>" +
		"<b> Subdataset 3 Description: </b>" + res[i].SUBDATASET_3_DESC + "</br>" +
		"<b> Subdataset 3 Name: </b>" + res[i].SUBDATASET_3_NAME + "</br>" +
		"<b> Subdataset 4 Description: </b>" + res[i].SUBDATASET_4_DESC + "</br>" +
		"<b> Subdataset 4 Name: </b>" + res[i].SUBDATASET_4_NAME + "</br>");
		var coordArray = stringToCoordArray(res[i].FOOTPRINT);
		drawPolygon(coordArray, res[i], i, res.length);
	};
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

function drawPolygon(coordArray, info, number, resultLength){
	if(coordArray != null){
		var polygon = L.polygon(coordArray, {color: 'red', number:number, resultLength:resultLength});
		polygon.on('mouseover', showPolygonInfo);
		polygon.on('click', openAccordion);
		polygon.addTo(polyLayer);
	}
}

function showPolygonInfo(e){
	var coords = {lat: e.latlng.lat, lng:correctCoordinates(e.latlng.lng)};
	var popup = L.popup()
    .setLatLng(coords)
    .setContent('<p> Dataset '+(this.options.number+1)+'</p>')
    .openOn(map);
}

function zoomToLayer(j){
	polyLayer.eachLayer(function(layer){
		if(layer.options.number == (j-1)){
			map.fitBounds(layer.getBounds());
			polyLayer.clearLayers();
		}
});
}

function openAccordion(){
  openSearchInSidebar();
	for(var i = 1; i < this.options.resultLength+1; i++){
		if(i == (this.options.number+1)){
			$("#dataset"+(this.options.number+1)).collapse('show');
		}else{
			$("#dataset"+i).collapse('hide');
		}
	}
}

function openSearchInSidebar() {
	$(".sidebar-tabs").find(".active").removeClass("active");
	$("#sidebar").removeClass("collapsed");
	$(".sidebar-content").find(".active").removeClass("active");
	$("#search").addClass("active");
	$("#searchTabButton").addClass("active");
}

function toggleDrop(i,j){
	$('#dropd'+i).show();
	$('#dropd'+j).hide();
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
