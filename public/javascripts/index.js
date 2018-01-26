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

/**
 * Calculats the pages needed to show all datasets
 * @param allContents Number of dataset results
 * @return Number of pages needed
 */
function pageCalculator(allContents){
  if(allContents%8 == 0){
    allContents = allContents/8;
  }else{
    allContents = (Math.floor(allContents/8)+1);
  }
  return allContents;
}

/**
 * Checks the active page tab of the sidebbar
 * @return The hash of the tab or false for save
 */
function checkActiveTab(){
  for (var i = 0; i < $('#topTabs')[0].children.length; i++) {
    if($('#topTabs')[0].children[i].className == "active" && $('#topTabs')[0].children[i].id != "searchTabButton"){
      const url = new URL($('#topTabs')[0].children[i].children[0].href);
      return window.location.origin +"/"+ url.hash;
    }else if($('#topTabs')[0].children[i].className == "active" && $('#topTabs')[0].children[i].id == "searchTabButton"){
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
 * Initialises all required stuff.
 * Adds options to date selector.
 * Load every permalink saved things.
 */
function initStartup(){
  initOptions();
  $.when(loadHash()).done(loadSearch());
}

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
      openTabInSidebar('#search');
    }
  }
  $(".sidebar-content").find(".active").append('<textarea id="permalinkTemp" value=str style="width: 100%"></<textarea>');
  $('#permalinkTemp')[0].value = str;
  var height = $('#permalinkTemp')[0].scrollHeight+2+"px";
  $('#permalinkTemp')[0].parentNode.removeChild($('#permalinkTemp')[0]);
  //$(".sidebar-content").find(".active").remove($('#permalinkTemp'));
  $('#save').html('<h2>Save</h2><textarea id="permalink" value=str style="width: 100%"></<textarea>');
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
  permalink.hash = "#search";
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
  return {"st":st, "sbox":sbox, "ssd":ssd, "sed":sed, "p":p, "ds":ds};
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
 * Adds options to the date slector
 *@param id ID of the date field
 *@param startInt First Option Value
 *@param endInt Last Option Value
 *@param selectedInt Value that should be selcted on creation
 */
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

/**
 * Adds all options to the date slector on start up
 */
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

/**
 * Compares the 2 date to make sure, the startdate is before the enddate
 *@return Bool value, true means startdate is before enddate
 */
function compareDates(){
  var startDate = createDate("start");
  var endDate = createDate("end");
  if(startDate < endDate){
    return true;
  }else{
    return false;
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
 * Initialises the Paginator.
 *@param templateurl URL for the Ajax request
 */
function pagerInit(templateurl){
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
