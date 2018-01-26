/**
 * Creates permalink and matches the box it is shown in.
 */
function showPermalink(){
  var str = "";
  if(checkActiveTab() == true){
    str = createPermalink();
  }else if(checkActiveTab() == false){
    str = window.location.origin +"/"+ '#hide';
  }else{
    str = checkActiveTab();
  }
  matchTextAreaField(str);
}

/**
 * Matches the box it is shown in.
 * Adds the field to the currently active tab.
 * Creates the field in save tab with needed height.
 *@param str The permalink
 */
function matchTextAreaField(str){
  for(var i = 0; i <$('#sidebar')[0].classList.length;i++){
    if ($('#sidebar')[0].classList[i]  == "collapsed"){
      openTabInSidebar('#reults');
    }
  }
  $(".sidebar-content").find(".active").append('<textarea id="permalinkTemp" value=str style="width: 100%"></<textarea>');
  $('#permalinkTemp')[0].value = str;
  var height = $('#permalinkTemp')[0].scrollHeight+2+"px";
  $('#permalinkTemp')[0].parentNode.removeChild($('#permalinkTemp')[0]);
  //$(".sidebar-content").find(".active").remove($('#permalinkTemp'));
  $('#save').html('<div id="sideName"><h2>Save</h2> </div><textarea id="permalink" value=str style="width: 100%"></<textarea>');
  $('#permalink')[0].style.height = height;
  $('#permalink')[0].value = str;
}

/**
 * Creates the permalink
 *@return The permalink
 */
function createPermalink(){
  var stateobject = createJSONPerma();
  stateobject = createSearchParam(stateobject);
  return addParams(stateobject);
}

/**
 * Adds the options from the JSON object to the link and adds the hash
 *@param stateobject Json Object with all permalink Options
 *@return The permalink
 */
function addParams(stateobject){
  var permalink = new URL(window.location.origin);
  for (let p of stateobject) {
    permalink.searchParams.append(p[0],p[1]);
  }
  //TESTEREN
  permalink.hash = "#results";
  return permalink;
}

/**
 * Creates a JSON Object with all needed options for the permalink.
 * Gets the values, form the search and the datasets.
 *@return JSON Object with all the needed options for the Permalink
 */
function createJSONPerma(){
  var st = $("#searchformbyname_input").val();
  var ssd = $("#startyear").val() + "-" + $("#startmonth").val() + "-" + $("#startday").val() + "T" + $("#starthour").val() + ":" + $("#startmin").val() + ":" + $("#startsec").val()+ "Z";    var sed = $("#endyear").val() + "-" + $("#endmonth").val() + "-" + $("#endday").val() + "T" + $("#endhour").val() + ":" + $("#endmin").val() + ":" + $("#endsec").val() + "Z";
  var p = findPage();
  var sbox = ($('#searchformbybbox_bottomLong').val()+','+ $('#searchformbybbox_bottomLat').val() +','+ $('#searchformbybbox_topLong').val()+',' +$('#searchformbybbox_topLat').val());
  var searched = false;
  if($('#resultIntroText')[0].innerHTML != "Currently there are no results."){
    searched = true;
  }
  var ds = [];
  var calc = [];
  var forEnd = 0;
  try{
    forEnd = $("#resultpanel")[0].children.length;
  }catch(err){

  }
  for(var i = 0; i< forEnd; i++){
    var tempobj = {};
    //tempobj.n = jsonForDatasets[i].PRODUCT_URI;
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
    var tempJSON = {/*"n":tempobj.n,*/ "o":tempobj.o,"vis":tempobj.vis,"exp":tempobj.exp,"btn":tempobj.btn,"gscdn":tempobj.gscdn,"rcdn":tempobj.rcdn,"gcdn":tempobj.gcdn,"bcdn":tempobj.bcdn,
      "greymin":tempobj.greymin,"rcmin":tempobj.rcmin,"gcmin":tempobj.gcmin,"bcmin":tempobj.bcmin,"greymax":tempobj.greymax,"rcmax":tempobj.rcmax,"gcmax":tempobj.gcmax,"bcmax":tempobj.bcmax, "calc": calc};
    ds.push(tempJSON);
    calc = [];
  }
  return {"st":st, "sbox":sbox, "ssd":ssd, "sed":sed, "p":p, "ser":searched,"ds":ds};
}

/**
 * Creates the Searchparameters for the permalin with all needed options
 *@param stateobject JSON Object with all needed option
 *@return Searchparamters with needed options
 */
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

/**
 * Detects the Hash in the given URL and opens the corresponding tab.
 */
function loadHash(){
  for (var i = 0; i < $('#sidebar')[0].children[1].children.length; i++) {
    if(window.location.hash == "#"+$('#sidebar')[0].children[1].children[i].id && window.location.hash != "#save"){
      openTabInSidebar(window.location.hash);
      $('#saveTabButton')[0].style.display = "";
    }
  }
  if(window.location.hash == "#hide"){
    sidebar.close('home');
  }
}




/**
* Lädt aus dem Permalink die Suchparameter, fügt diese ein ud führt ggf. Suche aus
*/
function loadPermaSearchParams(){
  //lädt Suchparameter
  var searchParams = new URLSearchParams(window.location.search.slice(1));
  //Gibt an, wie viele Suchparameter angegeben sind und ob gesucht worden ist
  var counter = 0;
  var search = false;
  for (let i of searchParams) {
    counter++;
    if(i[0] == "ser"){
      if(i[1] == "true"){
        search = true;
      }
    }
  }
  //Wenn Datasets vorhanden sind
  if(counter > 4){
    //Initalisiert Variablen zum befüllen aus Permalink
    var dsNumber = 0;
    var calcNumber = 0;
    var dsOpacity = [];
    var dsExpanded =[];
    var dsVis = [];
    var dsBand =[];
    var dsBandValues = [];
    var dsBtn = [];
    var pagetoview = 1;
    //Durchläuft alle Suchparameter und lädt Variablen
    for (let i of searchParams) {
      if(i[0] == "ds"){
        var dsRgbBandTemp = [];
        var dsValuesTemp = [];
        var dsMinValuesTemp = [];
        var dsMaxValuesTemp = [];
        var dsParams = new URLSearchParams(i[1]);
        for (let j of dsParams) {
          if(j[0] == "calc"){
            //Lädt alle Variablen, die es in Calc gibt
            var calcParams = new URLSearchParams(j[1]);
            for (let k of calcParams) {
              //hier kommt was mit calculated hin, aber nichts genaues weiß man nicht
            }
          }else{
            //Lädt alle Variablen, die es in Datasets gibt
            switch(j[0]) {
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
        //Daten werden in Temparrays gespeichert, um dem Format zu entsprechen
        //Temparray werden in die "richitgen" geschrieben und geleert
        dsBand.push(dsRgbBandTemp);
        dsRgbBandTemp = [];
        dsValuesTemp.push(dsMinValuesTemp);
        dsValuesTemp.push(dsMaxValuesTemp);
        dsBandValues.push(dsValuesTemp);
        dsValuesTemp = [];
        dsMinValuesTemp = [];
        dsMaxValuesTemp = [];
      }else{
        //Lädt Suchparamter der Suche und Seite, die angezeigt werden soll
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
    if(search == true){
      //Wenn Datasets vorhanden sind, wird hier die Ajax request ausgeführt, um diese erneut zu suchen
      var substring = $("#searchformbyname_input").val();
      var startdate = $("#startyear").val() + "-" + $("#startmonth").val() + "-" + $("#startday").val() + "T" + $("#starthour").val() + ":" + $("#startmin").val() + ":" + $("#startsec").val()+ "Z";
      var enddate = $("#endyear").val() + "-" + $("#endmonth").val() + "-" + $("#endday").val() + "T" + $("#endhour").val() + ":" + $("#endmin").val() + ":" + $("#endsec").val() + "Z";
      var page = 0;
      var bbox="";
      if ($(searchformbybbox_bottomLong).val() != "" && $(searchformbybbox_bottomLat).val() != "" && $(searchformbybbox_topLong).val() != "" && $(searchformbybbox_topLat).val() != ""){
        bbox=($(searchformbybbox_bottomLong).val()+','+ $(searchformbybbox_bottomLat).val() +','+ $(searchformbybbox_topLong).val()+',' +$(searchformbybbox_topLat).val());
      }
      var templateurl = "http://gis-bigdata.uni-muenster.de:14014/search?substring="+substring+"&bbox="+bbox+"&startdate="+startdate+"&enddate="+enddate+"&page=";
      pagerInit(templateurl);
      ajaxrequest(templateurl, pagetoview, dsExpanded, dsBand, dsBtn, dsBandValues, dsVis, dsOpacity);
    }
  }else{
    //Versteckt Button entsprechend der Such
    $('#bboxbutton').show();
    $('#deleteDrawing').hide();
  }
}


/**
  * The date form the permalink will be selected on load.
  *@param i The date as a string
  *@param indi Either "start" or "end" for the date
  */
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


/**
 * Retruns the page number that is active when creating the permalink
 *@return The current page number or "", when no search was started yet
 */
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

/**
 * Seltects the currently slected radio button
 *@param i Number of the Dataset with the radio buttons
 *@return A string for the selected button or "" if no button is selected
 */
function buttonSelected(i){
  if($('#dropd'+(((i+1)*2)))[0].style.display == "table-cell"){
    return "rgb";
  }else if($('#dropd'+(((i+1)*2)+1))[0].style.display == "table-cell"){
    return "grey";
  }else{
    return "";
  }
}


/**
 * Checks, if a layer cuurently displayed
 *@param number Number of the dataset to look for as a layer
 *@return Bool value, true means the layer with the given number is shown
 */
 //NEEDS TO BE CHECKED, WHEN SERVER IS UP AGAIN
function isALayerDisplayed(number){
  if (layerControl._layers.length == 4) {
    number ++;
    if (number <= 9) {
      number = " "+number;
    }
    if(number == layerControl._layers[3].name.slice(layerControl._layers[3].name.length -2)){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}

/**
 * Checks, if a dataset accordion is expanded or not
 *@param number Number of the dataset to look for as a accordion
 *@return String with "in" or "out"
 */
function isExpanded(number){
  number++;
  for(var i = 0; i < $('#dataset'+number)[0].classList.length; i++){
    if($('#dataset'+number)[0].classList[i] == "in"){
      return "in";
    }
  }
  return "out";
}


/**
 * Checks the active page tab of the sidebbar
 * @return The hash of the tab or false for save
 */
function checkActiveTab(){
  for (var i = 0; i < $('#topTabs')[0].children.length; i++) {
    if($('#topTabs')[0].children[i].className == "active" && $('#topTabs')[0].children[i].id != "resultsTabButton" && $('#topTabs')[0].children[i].id != "searchTabButton"){
      const url = new URL($('#topTabs')[0].children[i].children[0].href);
      return window.location.origin +"/"+ url.hash;
    }else if($('#topTabs')[0].children[i].className == "active" && ($('#topTabs')[0].children[i].id == "resultsTabButton" || $('#topTabs')[0].children[i].id == "searchTabButton")){
      return true;
    }
  }
  for (var i = 0; i < $('#bottomTabs')[0].children.length; i++) {
    if($('#bottomTabs')[0].children[i].className == "active"){
      const url = new URL($('#bottomTabs')[0].children[i].children[0].href);
      return window.location.origin +"/"+ url.hash;
    }
  }
  return false;
}


/**
 *Gibt die Stelle im Array zurück, in welcher das angegebene Band steht
 *@param bandArray Array, das durchsucht werden soll
 *@param band Eintrag, nach dem gesucht werden soll
 *@return Die Stelle im Array mit dem gesuchten Eintrag
*/
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
