
function visualizeMetadata(res){
  for(i=0; i < 8; i++){
  	console.log(i)
$('#resolution' + (i+1)  ).html(
"<b> Cloud Coverage Assesment: </b>" + res[i].CLOUD_COVERAGE_ASSESSMENT +  "</br>" +
"<b> Datatake Sensing Start: </b>" + res[i].DATATAKE_1_DATATAKE_SENSING_START + "</br>" +
"<b> Datatkae Type: </b>" + res[i].DATATAKE_1_DATATAKE_TYPE + "</br>" +
"<b> Datatake ID: </b>" + res[i].DATATAKE_1_ID + "</br>" +
"<b> Sensing Orbit Direction: </b>" + res[i].DATATAKE_1_SENSING_ORBIT_DIRECTION + "</br>" +
"<b> Sensing Orbit Number: </b>" + res[i].DATATAKE_1_SENSING_ORBIT_NUMBER + "</br>" +
"<b> Spacecraft Name: </b>" + res[i].DATATAKE_1_SPACECRAFT_NAME + "</br>" +
"<b> Degraded ANC Data Percentage: </b>" + res[i].DEGRADED_ANC_DATA_PERCENTAGE + "</br>" +
"<b> Degraded MSI Data Percentage: </b>" + res[i].DEGRADED_MSI_DATA_PERCENTAGE + "</br>" +
"<b> Footprint: </b>" + res[i].FOOTPRINT + "</br>" +
"<b> Format Correctness Flag: </b>" + res[i].FORMAT_CORRECTNESS_FLAG + "</br>" +
"<b> General Quality Flag: </b>" + res[i].GENERAL_QUALITY_FLAG + "</br>" +
"<b> Generation Time: </b>" + res[i].GENERATION_TIME + "</br>" +
"<b> Geometric Quality Flag: </b>" + res[i].GEOMETRIC_QUALITY_FLAG + "</br>" +
"<b> Preview Geo Info: </b>" + res[i].PREVIEW_GEO_INFO + "</br>" +
"<b> Preview Image-Url: </b>" + res[i].PREVIEW_IMAGE_URL +"</br>" +
"<b> Processing Baseline: </b>" + res[i].PROCESSING_BASELINE + "</br>" +
"<b> Processing Level: </b>" + res[i].PROCESSING_LEVEL + "</br>" +
"<b> Product Start Time: </b>" + res[i].PRODUCT_START_TIME + "</br>" +
"<b> Product Stop Time: </b>" + res[i].PRODUCT_STOP_TIME + "</br>" +
"<b> PRODUCT_TYPE: </b>" + res[i].PRODUCT_TYPE + "</br>" +
"<b> PRODUCT_URI: </b>" + res[i].PRODUCT_URI + "</br>" +
"<b> Quantification Value: </b>" + res[i].QUANTIFICATION_VALUE + "</br>" +
"<b> Radiometric Quality Flag: </b>" + res[i].RADIOMETRIC_QUALITY_FLAG + "</br>"+
"<b> Reference Band: </b>" + res[i].REFERENCE_BAND + "</br>" +
"<b> Reflectance Conversion U: </b>" + res[i].REFLECTANCE_CONVERSION_U + "</br>" +
"<b> Sensor Quality Flag: </b>" + res[i].SENSOR_QUALITY_FLAG + "</br>" +
"<b> Special Value Nodata: </b>" + res[i].SPECIAL_VALUE_NODATA + "</br>" +
"<b> Special Value Saturated: </b>" + res[i].SPECIAL_VALUE_SATURATED + "</br>" +
"<b> Subdataset 1 Describtion: </b>" + res[i].SUBDATASET_1_DESC + "</br>" +
"<b> Subdataset 1 Name: </b>" + res[i].SUBDATASET_1_NAME + "</br>" +
"<b> Subdataset 2 Describtion: </b>" + res[i].SUBDATASET_2_DESC + "</br>" +
"<b> Subdataset 2 Name: </b>" + res[i].SUBDATASET_2_NAME + "</br>" +
"<b> Subdataset 3 Describtion: </b>" + res[i].SUBDATASET_3_DESC + "</br>" +
"<b> Subdataset 3 Name: </b>" + res[i].SUBDATASET_3_NAME + "</br>" +
"<b> Subdataset 4 Describtion: </b>" + res[i].SUBDATASET_4_DESC + "</br>" +
"<b> Subdataset 4 Name: </b>" + res[i].SUBDATASET_4_NAME + "</br>");
};

}


function toggleDrop(){
	$('#dropd1').toggle();
}

function toggleDrop2(){
	$('#dropd2').toggle();
}
/*function detectLong(output){
    var vorzeichen;
  if(output< 0){
    vorzeichen = -1;
  }
  else{
    vorzeichen = 1;
  }

  output=Math.abs(output);
  var zahl = Math.floor(output/180)%2;
  console.log(zahl);
  output= output%180;
  if(zahl === 0){
    output = output*vorzeichen;
  }
  else {
    console.log(output);
    output = output - (output*vorzeichen);
  }
  console.log('output= ' +  output); 
  return output; 

  }*/



