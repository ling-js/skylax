


//<select> <option selected="selected" disabled="disabled">Pick a band</option> <option value="1">Band 1</option> <option value="2">Band 2</option> <option value="3">Band 3</option> <option value="4">Band 4</option> <option value="5">Band 5</option> <option value="6">Band 6</option> <option value="7">Band 7</option> <option value="8">Band 8</option> <option value="8a">Band 8a</option> <option value="9">Band 9</option> <option value="10">Band 10</option> <option value="11">Band 11</option> <option value="12">Band 12</option> </select>

//<li class="dropdown btn btn-default"><span class="glyphicon glyphicon-th-list"> Select <span class="caret"></span></span> <ul class="dropdown-menu dropdown-toggle" data-toggle="dropdown"> <li><a href="#">Band 1</a></li> <li> <a href="#">Band 2</a></li> <li><a href="#">Band 3</a></li> <li> <a href="#">Band 4</a></li> <li><a href="#">Band 5</a></li> <li> <a href="#">Band 6</a></li> <li><a href="#">Band 7</a></li> <li> <a href="#">Band 8</a></li> <li><a href="#">Band 8a</a></li> <li><a href="#">Band 9</a></li> <li> <a href="#">Band 10</a></li> <li><a href="#">Band 11</a></li> <li> <a href="#">Band 12</a></li> </ul> </li>



function loadSearch(){
  var searchParams = new URLSearchParams(window.location.search.slice(1));
  var counter = 0;
  var ds = false;
  for (let i of searchParams) {
    counter++;
    if(i[0] == "ds"){
      ds = true;
    }
  }
  if(counter > 4){
    var dsNumber = 0;
    var calcNumber = 0;
    var dsOpacity = [];
    var dsExpanded =[];
    var dsVis = [];
    var dsBand =[];
    var dsBandValues = [];
    var dsBtn = [];
    var pagetoview = 1;
    for (let i of searchParams) {
      if(i[0] == "ds"){
        var dsRgbBandTemp = [];
        var dsValuesTemp = [];
        var dsMinValuesTemp = [];
        var dsMaxValuesTemp = [];
        var dsParams = new URLSearchParams(i[1]);
        for (let j of dsParams) {
          if(j[0] == "calc"){
            var calcParams = new URLSearchParams(j[1]);
            for (let k of calcParams) {
              //hier kommt was mit calculated hin, aber nichts genaues weiß man nicht
            }
          }else{
            switch(j[0]) {
                case "n":
                  console.log("Was soll  ich denn damit?" + j[1]);
                  break;
                case "o":
                  dsOpacity.push(j[1]);
                  break;
                case "vis":
                  dsVis.push(j[1])
                  break;
                case "exp":
                  dsExpanded.push(j[1]);
                  break;
                case "btn":
                  if(j[1] == "rgb"){
                    dsBtn.push(["true","false"]);
                  }else if(j[1] == "grey"){
                    dsBtn.push(["false","true"]);
                  }else{
                    dsBtn.push(["false","false"]);
                  }
                  break;
                case "gscdn":
                  dsRgbBandTemp.push(j[1]);
                  break;
                case "rcdn":
                  dsRgbBandTemp.push(j[1]);
                  break;
                case "gcdn":
                  dsRgbBandTemp.push(j[1]);
                  break;
                case "bcdn":
                  dsRgbBandTemp.push(j[1]);
                  break;
                case "greymin":
                  dsMinValuesTemp.push(j[1]);
                  break;
                case "rcmin":
                  dsMinValuesTemp.push(j[1]);
                  break;
                case "gcmin":
                  dsMinValuesTemp.push(j[1]);
                  break;
                case "bcmin":
                  dsMinValuesTemp.push(j[1]);
                  break;
                case "greymax":
                  dsMaxValuesTemp.push(j[1]);
                  break;
                case "rcmax":
                  dsMaxValuesTemp.push(j[1]);
                  break;
                case "gcmax":
                  dsMaxValuesTemp.push(j[1]);
                  break;
                case "bcmax":
                  dsMaxValuesTemp.push(j[1]);
                  break;
            }
          }
        }
        dsBand.push(dsRgbBandTemp);
        dsRgbBandTemp = [];
        dsValuesTemp.push(dsMinValuesTemp);
        dsValuesTemp.push(dsMaxValuesTemp);
        dsBandValues.push(dsValuesTemp);
        dsValuesTemp = [];
        dsMinValuesTemp = [];
        dsMaxValuesTemp = [];
      }else{
        switch(i[0]) {
            case "st":
              $("#searchformbyname_input").val(i[1]);
              break;
            case "ssd":
              fillDate(i,"start");
              break;
            case "sed":
              fillDate(i,"end");
              break;
            case "p":
              pagetoview = i[1];
              break;
            case "sbox":
              var sbox = i[1].split(",");
              $("#searchformbybbox_bottomLat").val(sbox[1]);
              $("#searchformbybbox_bottomLong").val(sbox[0]);
              $("#searchformbybbox_topLat").val(sbox[3]);
              $("#searchformbybbox_topLong").val(sbox[2]);
              coordsToPolygon("true");
              break;
        }
      }
    }
    if(ds == true){
      var substring = $("#searchformbyname_input").val();
      var startdate = $("#startyear").val() + "-" + $("#startmonth").val() + "-" + $("#startday").val() + "T" + $("#starthour").val() + ":" + $("#startmin").val() + ":" + $("#startsec").val()+ "Z";
      var enddate = $("#endyear").val() + "-" + $("#endmonth").val() + "-" + $("#endday").val() + "T" + $("#endhour").val() + ":" + $("#endmin").val() + ":" + $("#endsec").val() + "Z";
      //var enddate= "";
      var page = 0;
      var bbox="";
      if ($(searchformbybbox_bottomLong).val() != "" && $(searchformbybbox_bottomLat).val() != "" && $(searchformbybbox_topLong).val() != "" && $(searchformbybbox_topLat).val() != ""){
        bbox=($(searchformbybbox_bottomLong).val()+','+ $(searchformbybbox_bottomLat).val() +','+ $(searchformbybbox_topLong).val()+',' +$(searchformbybbox_topLat).val());
      }
      var templateurl = "http://gis-bigdata.uni-muenster.de:14014/search?substring="+substring+"&bbox="+bbox+"&startdate="+startdate+"&enddate="+enddate+"&page=";
      pagerInit(templateurl);
      console.log(pagetoview);
      ajaxrequest(templateurl, pagetoview, dsExpanded, dsBand, dsBtn, dsBandValues, dsVis, dsOpacity);
    }
  }else{
    $('#bboxbutton').show();
    $('#deleteDrawing').hide();
  }
}






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
