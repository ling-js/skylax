/*

The MIT License (MIT)

Copyright (c) Sat Jan 27 2018 Benjamin Karic, Jens Seifert, Jasper Buß, Eric Thieme-Garmann, Jan Speckamp

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORTOR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/** Handling of Searchform */
$(document).ready(function() {
  /**
   * Search is conducted, results are returned and processed
   */
  $('#searchform').submit(function(e) {
      spinnerShow(document.getElementById('sidebar'));
      // Prevent default html form handling
      e.preventDefault();
      var that = this;
      // Checks if Enddate is valid (later than startDate)
      if(compareDates() == true){
        // Manual parsing of fields to create Request-URL
        var substring = "";
        if($('#addNameToSearch')[0].checked == true){
          substring = $("#searchformbyname_input").val();
        }
        searchVariables.substring = substring;
        var startdate = "";
        var enddate = "";
        if($('#addDateToSearch')[0].checked == true){
          startdate = $("#startyear").val() + "-" + $("#startmonth").val() + "-" + $("#startday").val() + "T" + $("#starthour").val() + ":" + $("#startmin").val() + ":" + $("#startsec").val()+ "Z";
          enddate = $("#endyear").val() + "-" + $("#endmonth").val() + "-" + $("#endday").val() + "T" + $("#endhour").val() + ":" + $("#endmin").val() + ":" + $("#endsec").val() + "Z";
        }
        searchVariables.startdate = startdate;
        searchVariables.enddate = enddate;
        var page = 0;
        var pagetoview = 1;
        var bbox="";
        if($('#addBboxToSearch')[0].checked == true){
          if ($(searchformbybbox_bottomLong).val() != "" && $(searchformbybbox_bottomLat).val() != "" && $(searchformbybbox_topLong).val() != "" && $(searchformbybbox_topLat).val() != ""){
            bbox=($(searchformbybbox_bottomLong).val()+','+ $(searchformbybbox_bottomLat).val() +','+ $(searchformbybbox_topLong).val()+',' +$(searchformbybbox_topLat).val());
          }
        }
        searchVariables.bbox = bbox;
        searchVariables.page = pagetoview-1;
        var templateurl = apiurl + "/search?substring="+substring+"&bbox="+bbox+"&startdate="+startdate+"&enddate="+enddate+"&page=";
        // Initializing Paginator
        pagerInit(templateurl);
        var expanded = [];
        // Send Ajax Request
        ajaxrequest(templateurl, pagetoview);
    }else{
      // Invalid Input
      alert("Startdate must be before Enddate");
      spinnerHide(document.getElementById('sidebar'));
    }
  });
});


/**
 * Die Suche wird ausgeführt, Ergebnisse werde zurückgegeben und verarbeitet
 *@param templateurl URL for the search. Searchparamter was added
 *@param pagetoview pagenumber that is to view
 *@param expanded For permalink: Is a dataset expanded?
 *@param band For permalink: which band is selected?
 *@param btn For permalink: Which radiobutton is selected?
 *@param bandValues For permalink: which values are entered for the band?
 *@param vis For permalink: which dataset is shown?
 *@param opacity For permalink: Whats the opacity level of the shown dataset?
 */
function ajaxrequest(templateurl, pagetoview, expanded, band, btn, bandValues, vis, opacity){
  spinnerShow(document.getElementById('sidebar'));
  var resultIntroText = "You searched for datasets..."+"<br>";
  var url = new URL(templateurl);
  var searchParams = new URLSearchParams(url.search.slice(1));
  for (let i of searchParams) {
    if(i[1] != ""){
      if(i[0] == "substring"){
        resultIntroText = resultIntroText + "... with the name '" +i[1]+"'."+"<br>";
      }
      if(i[0] == "bbox"){
        var bboxString = i[1].split(",");
        for (var j = 0; j < bboxString.length; j++) {
          bboxString[j] = bboxString[j].slice(0,6);
        }
        resultIntroText = resultIntroText + "... within the coordinates ["+bboxString[0]+","+bboxString[1]+"|"+bboxString[2]+","+bboxString[3]+"]."+"<br>";
      }
      if(i[0] == "startdate"){
        var dateString = i[1].split("T");
        var dayString = dateString[0].split("-");
        var hourString = dateString[1].slice(0,dateString[1].length-1);
        resultIntroText = resultIntroText + "... from "+hourString+"h "+dayString[2]+"."+dayString[1]+"."+dayString[0]+"<br>";
      }
      if(i[0] == "enddate"){
        var dateString = i[1].split("T");
        var dayString = dateString[0].split("-");
        var hourString = dateString[1].slice(0,dateString[1].length-1);
        resultIntroText = resultIntroText + " to "+hourString+"h "+dayString[2]+"."+dayString[1]+"."+dayString[0]+"."+"<br>";
      }
    }else{
      if(i[1] == ""){
        if(i[0] == "substring"){
          resultIntroText = resultIntroText + "... without a name."+"<br>";
        }
        if(i[0] == "bbox"){
          resultIntroText = resultIntroText + "... without coordinates."+"<br>";
        }
        if(i[0] == "startdate"){
          resultIntroText = resultIntroText + "... without a dates."+"<br>";
        }
      }
    }
  }
  $.ajax({
    type: "GET",
    url: templateurl+(pagetoview-1),
    data:'',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    statusCode: {
      404: function() {
        console.log("something went wrong(404)");
          spinnerHide(document.getElementById('sidebar'));
      }},
      success: function (res, status, request) {
        console.log(res);
        resultIntroText = "You have found "+(res.L1C.length+res.L2A.length)+" datasets with your request."+"<br>"+resultIntroText;
        openTabInSidebar('#results');
        $('#resultIntroText')[0].innerHTML = resultIntroText;
        //shows paginator or not
        if(res.length == 0){
          $('#page-selection')[0].style.display = "none";
        }else{
          $('#page-selection')[0].style.display = "";
        }
        //HTML created to the results
        createHTML(res, pagetoview, expanded, band, btn, bandValues, vis, opacity);
        page = pageCalculator(request.getResponseHeader('X-Dataset-Count'));
        //HTML element with Metadaten is created
        visualizeMetadata(res, pagetoview, band, vis);
        //Paginator is edited
        $('#page-selection').bootpag({
          total: page,
          page: pagetoview,
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
        });
        if(page == 0 && $("#page-selection")[0].children.length > 0){
          $("#page-selection")[0].children[0].style.display = "none";
        }else if($("#page-selection")[0].children.length > 0){
          $("#page-selection")[0].children[0].style.display = "";
        }
        spinnerHide(document.getElementById('sidebar'));
      },
      error: function(xhr, status, error) {
        console.log("Achtung:Es gab einen Fehler bei der AJAX-Anfrage der Fehlercode lautet :" + ""+ xhr.responseText);
        //alert(xhr.responseText);
        spinnerHide(document.getElementById('sidebar'));
      }
    }); //end ajax
  }



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
 *created a date from a string
 *@param str Is "end" or "start", depending on the created date
 *@return a date
 */

function createDate(str){
  var dateString = $("#"+str+"year").val() + "-" + $("#"+str+"month").val() + "-" + $("#"+str+"day").val() + "T" + $("#"+str+"hour").val() + ":" + $("#"+str+"min").val() + ":" + $("#"+str+"sec").val();
  var date = new Date(dateString);
  return date;
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
    ajaxrequest(templateurl, num); // some ajax content loading...
  });
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
 *changes the day, if day in that month does not exist example: 31.02.
 *jumps to 01.02.
 *Options removed or added for days
 *@param str Is "end" oder "start", depending on the day to be corrected
 */
function updateDay(str){
  if(lessDayMonth(str) == true){
    if($("#"+str+"day")[0].options.length == 31){
      $("#"+str+"day")[0].options[30].remove();
    }else if($("#"+str+"day")[0].options.length < 30){
      addOption(str+"day", $("#"+str+"day")[0].options.length+1, 30);
    }
  }else if($("#"+str+"month").val() == 2){
    if(feburaryCalc(str) == true){
      if($("#"+str+"day")[0].options.length == 28){
        addOption(str+"day", 29, 29);
      }else{
        for(var i = $("#"+str+"day")[0].options.length; i > 29; i--){
          $("#"+str+"day")[0].options[i-1].remove();
        }
      }
    }else{
      for(var i = $("#"+str+"day")[0].options.length; i > 28; i--){
        $("#"+str+"day")[0].options[i-1].remove();
      }
    }
  }else if($("#"+str+"day")[0].options.length < 31){
    addOption(str+"day", $("#"+str+"day")[0].options.length+1, 31, 1);
  }
}

/**
 *indicates, if a month is a month with less than 31 days (except for february)
 *@param str Is "end" oder "start", depending on the month to be checked
 *@return True for short month, False for long month
 */
function lessDayMonth(str){
  var months = [4, 6, 9, 11];
  for (var i = 0; i < months.length; i++) {
    if(months[i] == $("#"+str+"month").val()){
      return true;
    }
  }
  return false;
}

/**
 * indicated, if the february is in a leap year (29 days)
 *@param str Is "end" oder "start", depending on the month to be checked
 *@return True for short february, False for long february
 */
function feburaryCalc(str){
  if($("#"+str+"year").val() % 4 == 0){
    if($("#"+str+"year").val() % 100 == 0){
      if($("#"+str+"year").val() % 400 == 0){
        return true;
      }else{
        return false;
      }
    }
    return true;
  }
  return false;
}


/**
 *Toggelt the detailed Timesearch fuction of the searchform
 *@param i ID of HTML-element("detailedendtime" or "detailedendtime")
 */
function toggleIt(i){
    var x = document.getElementById(i);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
