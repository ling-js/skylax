


//<select> <option selected="selected" disabled="disabled">Pick a band</option> <option value="1">Band 1</option> <option value="2">Band 2</option> <option value="3">Band 3</option> <option value="4">Band 4</option> <option value="5">Band 5</option> <option value="6">Band 6</option> <option value="7">Band 7</option> <option value="8">Band 8</option> <option value="8a">Band 8a</option> <option value="9">Band 9</option> <option value="10">Band 10</option> <option value="11">Band 11</option> <option value="12">Band 12</option> </select>

//<li class="dropdown btn btn-default"><span class="glyphicon glyphicon-th-list"> Select <span class="caret"></span></span> <ul class="dropdown-menu dropdown-toggle" data-toggle="dropdown"> <li><a href="#">Band 1</a></li> <li> <a href="#">Band 2</a></li> <li><a href="#">Band 3</a></li> <li> <a href="#">Band 4</a></li> <li><a href="#">Band 5</a></li> <li> <a href="#">Band 6</a></li> <li><a href="#">Band 7</a></li> <li> <a href="#">Band 8</a></li> <li><a href="#">Band 8a</a></li> <li><a href="#">Band 9</a></li> <li> <a href="#">Band 10</a></li> <li><a href="#">Band 11</a></li> <li> <a href="#">Band 12</a></li> </ul> </li>

function showOpacityLevel(i){
	$('#opacityOutputId'+ i ).html('Opacity Level:' + $('#opacityId'+ i ).val()+'%');
}


function opacityChanger(j){
	lyr.options.opacity = $('#opacityId'+ j ).val()/100;
	updateLyr();
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
