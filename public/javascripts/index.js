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

  $('#resultpanel').hide();


  $('#searchform').submit(function(e) {
    spinnerShow(document.getElementById('sidebar'));
    // Prevent default html form handling
    e.preventDefault();
    var that = this;
    console.log("function gets called properly awaiting ajax...");
    var substring = $("#searchformbyname_input").val();
    var startdate = $("#startyear").val() + "-" + $("#startmonth").val() + "-" + $("#startday").val() + "T" + $("#starthour").val() + ":" + $("#startmin").val() + ":" + $("#startsec").val()+ "Z";
    //var enddate= $("#endyear").val() + "-" + $("#endmonth").val() + "-" + $("#endday").val() + "T" + $("#endhour").val() + ":" + $("#endmin").val() + ":" + $("#endsec").val() + "Z";
    var enddate= "";
    console.log( $("#startyear").val() + " value "+ startdate + " starttime and endtime " + enddate);
    var page = 0;
    var pagetoview = 1;
    var bbox="";
    console.log("searchbox= " + $(searchformbybbox_bottomright).val());
    if ($(searchformbybbox_bottomright).val() != ""){
      bbox=('"' + $(searchformbybbox_bottomright).val()+','+ $(searchformbybbox_bottomleft).val() +','+ $(searchformbybbox_topright).val()+',' +$(searchformbybbox_topleft).val() + '"');
    }
    console.log(bbox);
    var templateurl = "http://gis-bigdata.uni-muenster.de:14014/search?substring="+substring+"&bbox="+bbox+"&startdate="+startdate+"&enddate="+enddate+"&page=";
    pagerInit(templateurl);
    ajaxrequest(templateurl, pagetoview);
  });//end getMetaData()
});

function pageCalculator(allContents){
  if(allContents%8 == 0){
    allContents = allContents/8;
  }else{
    allContents = (Math.floor(allContents/8)+1);
  }
  return allContents;
}

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
  console.log($('#page-selection'));
}
function ajaxrequest(templateurl, pagetoview){
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
        createHTML(res, pagetoview);
        page = pageCalculator(request.getResponseHeader('X-Dataset-Count'));
        //$('#resultpanel').show();
        visualizeMetadata(res);
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
        spinnerHide(document.getElementById('sidebar'));
        displayBoundingBox(res[0].FOOTPRINT);
      },
      error: function(xhr, status, error) {
        alert(xhr.responseText);
        spinnerHide(document.getElementById('sidebar'));
      }
    }); //end ajax
  }
