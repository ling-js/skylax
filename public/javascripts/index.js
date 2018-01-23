/**
* Geosoftware I, SoSe 2017, final
* @author Jan Speckamp (428367)
*/
/**
* Loads all requested Stages. Overwrites all Submit Handlers that are already present,
*/
$(document).ready(function() {
  initMap();
  // Show all Items when initially opening Search Bar
  sidebar.on('content', function(e) {
  });

  initStartup();
  //Keine Ahnung ob wir das hier noch brauchen -> $('#resultpanel').hide();

});

function pageCalculator(allContents){
  if(allContents%8 == 0){
    allContents = allContents/8;
  }else{
    allContents = (Math.floor(allContents/8)+1);
  }
  return allContents;
}

function showSaveBtn(bool){
  if(bool == true){
    if($('#searchTabButton')[0].classList.length > 0){
      for(var i = 0; i < $('#searchTabButton')[0].classList.length; i++){
        if ($('#searchTabButton')[0].classList[i] == "active"){
          $('#saveTabButton')[0].style.display = "none";
          break;
        }
      }
    }else if($('#searchTabButton')[0].classList.length == 0) {
      $('#saveTabButton')[0].style.display = "";
    }
  }else if(bool == false){
    $('#saveTabButton')[0].style.display = "none";
  }
}

function initStartup(){
  initOptions();
  $.when(loadHash()).done(loadSearch());
}
function showPermalink(){
  var str = createPermalink();
  matchTextAreaField(str);
}

function matchTextAreaField(str){
  for(var i = 0; i <$('#sidebar')[0].classList.length;i++){
    if ($('#sidebar')[0].classList[i]  == "collapsed"){
      openTabInSidebar('#search');
    }
  }
  $(".sidebar-content").find(".active").append('<textarea id="permalinkTemp" value=str style="width: 100%"></<textarea>');
  $('#permalinkTemp')[0].value = str;
  var height = $('#permalinkTemp')[0].scrollHeight+2+"px";
  $('#permalinkTemp')[0].parentNode.removeChild($('#permalinkTemp')[0]);
  //$(".sidebar-content").find(".active").remove($('#permalinkTemp'));
  $('#save').html('<h2>save und so</h2><textarea id="permalink" value=str style="width: 100%"></<textarea>');
  $('#permalink')[0].style.height = height;
  $('#permalink')[0].value = str;
}

//check if empty
function createPermalink(){
  var str ="Ich schreibe jetzt ein buch, das ist so wunderschön, nur um zu sehen, dass sich was tut ud ich fände das schän, wenn sich dieses Feld anpassen könnte.";
  var stateobject = createJSONPerma();
  stateobject = createSearchParam(stateobject);
  return addParams(stateobject);
}

function addParams(stateobject){
  var permalink = new URL(window.location.origin);
  for (let p of stateobject) {
    permalink.searchParams.append(p[0],p[1]);
  }
  permalink.hash = "#search";
  return permalink;
}

function createJSONPerma(){
  var st = $("#searchformbyname_input").val();
  var ssd = $("#startyear").val() + "-" + $("#startmonth").val() + "-" + $("#startday").val() + "T" + $("#starthour").val() + ":" + $("#startmin").val() + ":" + $("#startsec").val()+ "Z";    var sed = $("#endyear").val() + "-" + $("#endmonth").val() + "-" + $("#endday").val() + "T" + $("#endhour").val() + ":" + $("#endmin").val() + ":" + $("#endsec").val() + "Z";
  var p = findPage();
  var sbox = ($('#searchformbybbox_bottomLong').val()+','+ $('#searchformbybbox_bottomLat').val() +','+ $('#searchformbybbox_topLong').val()+',' +$('#searchformbybbox_topLat').val());
  var ds = [];
  var calc = [];
  var forEnd = 0;
  try{
    forEnd = $("#resultpanel")[0].children.length;
  }catch(err){

  }
  for(var i = 0; i< forEnd; i++){
    var tempobj = {};
    tempobj.n = jsonForDatasets[i].PRODUCT_URI;
    var opacity;
    if($('#opacityId'+ (i+1) ).val() == undefined){
      opacity = 100;
    }else{
      opacity = $('#opacityId'+ (i+1) ).val();
    }
    tempobj.o = opacity;
    tempobj.vis = isALayerDisplayed(i);
    tempobj.exp = isExpanded(i);
    tempobj.btn = buttonSelected(i);
    tempobj.gscdn = $('#greyselect'+(i+1)).val();
    tempobj.rcdn = $('#rgbselect'+(1+(i*3))).val();
    tempobj.gcdn = $('#rgbselect'+(2+(i*3))).val();
    tempobj.bcdn = $('#rgbselect'+(3+(i*3))).val();
    //tempobj.gsc = $('#greyselect'+(i+1));
    //tempobj.rcn = "d";
    //tempobj.gcn = "d";
    //tempobj.bcn = "d";
    tempobj.greymin =  $('#minGrey'+(i+1)).val();
    tempobj.rcmin = $('#minRed'+(i+1)).val();
    tempobj.gcmin = $('#minGreen'+(i+1)).val();
    tempobj.bcmin = $('#minBlue'+(i+1)).val();
    tempobj.greymax = $('#maxGrey'+(i+1)).val();
    tempobj.rcmax = $('#maxRed'+(i+1)).val();
    tempobj.gcmax = $('#maxGreen'+(i+1)).val();
    tempobj.bcmax = $('#maxBlue'+(i+1)).val();
    for (var j = 0; j < 1; j++) {
      var tempCalc = {};
      tempCalc.name = "a";
      tempCalc.calculation = "a";
      var tempCalcJson = {"name":tempCalc.name,"o":tempCalc.calculation};
      calc.push(tempCalcJson);
      }
    /*if(tempobj.greymin == null){
      tempobj.greymin = 0;
    }
    if(tempobj.rcmin == null){
      tempobj.rcmin = 0;
    }
    if(tempobj.gcmin == null){
      tempobj.gcmin = 0;
    }
    if(tempobj.bcmin == null){
      tempobj.bcmin = 0;
    }
    if(tempobj.greymax == null){
      tempobj.greymax = 0;
    }
    if(tempobj.rcmax == null){
      tempobj.rcmax = 0;
    }
    if(tempobj.gcmax == null){
      tempobj.gcmax = 0;
    }
    if(tempobj.bcmax == null){
      tempobj.bcmax = 0;
    }*/
    var tempJSON = {"n":tempobj.n, "o":tempobj.o,"vis":tempobj.vis,"exp":tempobj.exp,"btn":tempobj.btn,"gscdn":tempobj.gscdn,"rcdn":tempobj.rcdn,"gcdn":tempobj.gcdn,"bcdn":tempobj.bcdn,
      "greymin":tempobj.greymin,"rcmin":tempobj.rcmin,"gcmin":tempobj.gcmin,"bcmin":tempobj.bcmin,"greymax":tempobj.greymax,"rcmax":tempobj.rcmax,"gcmax":tempobj.gcmax,"bcmax":tempobj.bcmax, "calc": calc};
    ds.push(tempJSON);
    calc = [];
  }
  return {"st":st, "sbox":sbox, "ssd":ssd, "sed":sed, "p":p, "ds":ds};
}

function createSearchParam(stateobject){
    var searchParams = new URLSearchParams();

  //check if value is object
  for (var i in stateobject){
    var value = stateobject[i];
    if(i == "ds"){
      for (var k = 0; k<stateobject.ds.length;k++){
        var dsParam = new URLSearchParams();
        for (var j in stateobject.ds[k]) {
          if(j == "calc"){
            for (var l = 0; l<stateobject.ds[0].calc.length;l++){
              var calcParam = new URLSearchParams();
              for (var m in stateobject.ds[0].calc[l]) {
                calcParam.append(m, stateobject.ds[0].calc[l][m]);
              }
              dsParam.append(j, calcParam);
            }
          }else{
          dsParam.append(j, stateobject.ds[k][j]);
          }
        }
        searchParams.append(i, dsParam);
      }
    }else{
      searchParams.append(i,value);
    }
  }
  return searchParams;
}

function loadHash(){
  for (var i = 0; i < $('#sidebar')[0].children[1].children.length; i++) {
    if(window.location.hash == "#"+$('#sidebar')[0].children[1].children[i].id && window.location.hash != "#save"){
      openTabInSidebar(window.location.hash);
      if(window.location.hash == '#search'){
        $('#saveTabButton')[0].style.display = "";
      }
    }
  }
}


function fillDate(i, indi){
    var date =[];
    date.push(i[1].slice(0,10).split("-"));
    date.push(i[1].slice(11, i[1].length-1).split(":"));
    $("#"+indi+"day").val(date[0][2]);
    $("#"+indi+"month").val(date[0][1]);
    $("#"+indi+"year").val(date[0][0]);
    $("#"+indi+"sec").val(date[1][2]);
    $("#"+indi+"min").val(date[1][1]);
    $("#"+indi+"hour").val(date[1][0]);
}

function findPage(){
  if($('#page-selection')["0"].children["0"] != undefined){
    for (var i = 0; i < $('#page-selection')["0"].children["0"].children.length; i++) {
      if ($('#page-selection')["0"].children["0"].children[i].className == "active") {
        return $('#page-selection')["0"].children["0"].children[i].outerText;
      }
    }
  }
  return "";
}

function buttonSelected(i){
  if($('#dropd'+(((i+1)*2)))[0].style.display == "table-cell"){
    return "rgb";
  }else if($('#dropd'+(((i+1)*2)+1))[0].style.display == "table-cell"){
    return "grey";
  }else{
    return "";
  }
}

function addOption(id, startInt, endInt, selectedInt){
  for(var i = startInt; i < endInt+1; i++){
    var val = i;
    if(i<10){
      val="0"+i;
    }
   $("#"+id)[0].options[$("#"+id)[0].options.length] = new Option(i, val);
   if(i == selectedInt){
     $("#"+id)[0].options[$("#"+id)[0].options.length-1].selected = "selected";
   }
  }
}



function initOptions(){
  addOption("startday",1,31,1);
  addOption("startmonth",1,12,1);
  addOption("startyear",2015,2026,1);
  addOption("starthour",0,23,0);
  addOption("startmin",0,59,0);
  addOption("startsec",0,59,0);
  addOption("endday",1,31,31);
  addOption("endmonth",1,12,12);
  addOption("endyear",2015,2026,2017);
  addOption("endhour",0,23,23);
  addOption("endmin",0,59,59);
  addOption("endsec",0,59,59);
}

function compareDates(){
  var startDate = createDate("start");
  var endDate = createDate("end");
  if(startDate < endDate){
    return true;
  }else{
    return false;
  }
}

function isALayerDisplayed(number){
	if (layerControl._layers.length == 4) {
		if(number+1 == layerControl._layers[3].name.slice(layerControl._layers[3].name.length -1)){
      return true;
    }else{
      return false;
    }
	}else{
		return false;
	}
}

function isExpanded(number){
  number++;
  for(var i = 0; i < $('#dataset'+number)[0].classList.length; i++){
    if($('#dataset'+number)[0].classList[i] == "in"){
      return "in";
    }
  }
  return "out";
}


function pagerInit(templateurl, expanded){
  $('#page-selection').bootpag({
    total: 0,
    page: 0,
    maxVisible: 5,
    leaps: true,
    firstLastUse: true,
    first: '←',
    last: '→',
    wrapClass: 'pagination',
    activeClass: 'active',
    disabledClass: 'disabled',
    next: 'next',
    prev: 'prev',
    lastClass: 'last',
    firstClass: 'first'
  }).on("page", function(event, /* page number here */ num){
    spinnerShow(document.getElementById('sidebar'));
    ajaxrequest(templateurl, num); // some ajax content loading...
  });
}
