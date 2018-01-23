

$(document).ready(function() {

  $('#searchform').submit(function(e) {
      spinnerShow(document.getElementById('sidebar'));
      // Prevent default html form handling
      e.preventDefault();
      var that = this;
      if(compareDates() == true){
        console.log("function gets called properly awaiting ajax...");
        var substring = $("#searchformbyname_input").val();
        var startdate = $("#startyear").val() + "-" + $("#startmonth").val() + "-" + $("#startday").val() + "T" + $("#starthour").val() + ":" + $("#startmin").val() + ":" + $("#startsec").val()+ "Z";
        var enddate = $("#endyear").val() + "-" + $("#endmonth").val() + "-" + $("#endday").val() + "T" + $("#endhour").val() + ":" + $("#endmin").val() + ":" + $("#endsec").val() + "Z";
        var page = 0;
        var pagetoview = 1;
        var bbox="";
        if ($(searchformbybbox_bottomLong).val() != "" && $(searchformbybbox_bottomLat).val() != "" && $(searchformbybbox_topLong).val() != "" && $(searchformbybbox_topLat).val() != ""){
          bbox=($(searchformbybbox_bottomLong).val()+','+ $(searchformbybbox_bottomLat).val() +','+ $(searchformbybbox_topLong).val()+',' +$(searchformbybbox_topLat).val());
        }
        console.log(bbox);
        var templateurl = "http://gis-bigdata.uni-muenster.de:14014/search?substring="+substring+"&bbox="+bbox+"&startdate="+startdate+"&enddate="+enddate+"&page=";
        pagerInit(templateurl);
        var expanded = [];
        ajaxrequest(templateurl, pagetoview);
    }else{
      alert("Startdate must be before Enddate");
      spinnerHide(document.getElementById('sidebar'));
    }
  });//end getMetaData()
});


function ajaxrequest(templateurl, pagetoview, expanded, band, btn, bandValues, vis, opacity){
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
        if(res.length == 0){
          $('#page-selection')[0].style.display = "none";
        }else{
          $('#page-selection')[0].style.display = "";
        }
        createHTML(res, pagetoview, expanded, band, btn, bandValues, vis, opacity);
        page = pageCalculator(request.getResponseHeader('X-Dataset-Count'));
        //$('#resultpanel').show();
        visualizeMetadata(res, pagetoview);
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
      },
      error: function(xhr, status, error) {
        console.log("Achtung:Es gab einen Fehler bei der AJAX-Anfrage der Fehlercode lautet :" + ""+ xhr.responseText);
        //alert(xhr.responseText);
        spinnerHide(document.getElementById('sidebar'));
      }
    }); //end ajax
  }