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

// Global vars;
var map, // Map Object
  layerControl,
  sidebar,
  drawControl,
  editableLayers, //Layer to draw onto
  drawnItems,
  rectangleDrawer,
  spinner,
  polyLayer,
  target;
// API Url
var apiurl = "http://10.67.49.40:8080";
//SpinnerToggler
var toggler = false;
//saves results after loading datasets
var jsonForDatasets =[];
//Save Lookup values for datasets on click
var valueLookUpArray = [];
//Saves search variables
var searchVariables = {substring: "", bbox: "",startdate:"",enddate:"",page:""};
//displey datasetnumber
var visDatasetNumber = 0;

/**
* Loads all requested Stages. Overwrites all Submit Handlers that are already present,
*/
$(document).ready(function() {
  initMap();
  // Show all Items when initially opening Search Bar
  sidebar.on('content', function(e) {
  });

  initStartup();
    $('#bboxbutton').hide();
    $('#deleteDrawing').hide();

    //If clauses that check if the input areas need to be greyed out
  document.getElementById('addNameToSearch').onchange = function() {
        if(this.checked==true){
            document.getElementById("searchformbyname_input").disabled=false;
            document.getElementById("searchformbyname_input").focus();

        }
        else{
            document.getElementById("searchformbyname_input").disabled='disabled'

        }};
    document.getElementById('addDateToSearch').onchange = function() {
        if(this.checked==true){
            document.getElementById("startDate").disabled=false;
            document.getElementById("startDate").focus();
            document.getElementById("endDate").disabled=false;
            document.getElementById("endDate").focus();


        }
        else{
            document.getElementById("startDate").disabled='disabled';
            document.getElementById("endDate").disabled='disabled';

        }};

    document.getElementById('addBboxToSearch').onchange = function() {
        if(this.checked==true){

            document.getElementById("searchformbybbox_topLat").disabled=false;
            document.getElementById("searchformbybbox_topLat").focus();
            document.getElementById("searchformbybbox_topLong").disabled=false;
            document.getElementById("searchformbybbox_topLong").focus();
            document.getElementById("searchformbybbox_bottomLat").disabled=false;
            document.getElementById("searchformbybbox_bottomLat").focus();
            document.getElementById("searchformbybbox_bottomLong").disabled=false;
            document.getElementById("searchformbybbox_bottomLong").focus();
            $('#bboxbutton').show();
        }
        if(this.checked==false){
            document.getElementById("searchformbybbox_topLat").disabled='disabled';
            document.getElementById("searchformbybbox_topLong").disabled='disabled';
            document.getElementById("searchformbybbox_bottomLat").disabled='disabled';
            document.getElementById("searchformbybbox_bottomLong").disabled='disabled';
            $('#bboxbutton').hide();


        }};

});

/**
 * Initialises all required stuff.
 * Adds options to date selector.
 * Load every permalink saved things.
 */
function initStartup(){
  initDate();
  $.when(loadHash()).done(loadPermaSearchParams());
}
