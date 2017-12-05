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
        // Prevent default html form handling
        e.preventDefault();
        var that = this;
        console.log("function gets called properly awaiting ajax...");
        var substring = $("#searchformbyname_input").val();
        var startdate = $("#searchformbydate_input").val();
        var enddate="";
        var page = 0;
        var bbox="";
        console.log("searchbox= " + $(searchformbybbox_bottomright).val());
        if ($(searchformbybbox_bottomright).val() != ""){
            bbox=('"' + $(searchformbybbox_bottomright).val()+','+ $(searchformbybbox_bottomleft).val() +','+ $(searchformbybbox_topright).val()+',' +$(searchformbybbox_topleft).val() + '"');
        }
        console.log(bbox);
        var url = "http://10.67.6.112:8080/search?substring="+substring+"&bbox="+bbox+"&startdate="+startdate+"&enddate="+enddate+"&page="+page;
        console.log(url);

        $.ajax({
            type: "GET",
            url: url,
            data:'',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            statusCode: {
                404: function() {
                    console.log("something went wrong(404)");
                }},
            success: function (res) {
            	//console.dir(res);
                createHTML(res);
            	//$('#resultpanel').show();
            	
            	visualizeMetadata(res);
                
            }
        }); //end ajax
    });//end getMetaData()


});
