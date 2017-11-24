var locations = {};
var uluru = {lat: 25.053031, lng: 121.54882};
var map
var markers = {};
var marker,merge;
// var bounds = new google.maps.LatLngBounds();
//console.log(center);

d3.csv('/data/parcoords/data/vd_gps.csv',function(data){
    var value;
    for( value in data )
    {
        var key = data[value].VD_Name;
        locations[key] = {lat: parseFloat(data[value].latitude), lng: parseFloat(data[value].longitude)};
    }
})

google.maps.event.addDomListener(window, 'load', initMap);
function initMap() {
    console.log(1);
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: uluru
    });   
    //var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    for(var key in locations ){
        marker = new google.maps.Marker({
            position: {lat:locations[key].lat,lng:locations[key].lng,},
            map: map,
            icon : '/data/parcoords/pic/road.png',
            title:key
        });
        markers[key]=marker;
        //bounds.extend(marker.position);
        marker.addListener('mousemove', function() {
            map_highlight(this.title);
        });
        marker.addListener('mouseout', function() {
            map_unhighlight(this.title);
        });
    }
}  
function newLocation()
{
	map.setCenter({
		lat : locations[center].lat,
		lng : locations[center].lng
    });
    map.setZoom(18);
    //console.log(merge);
    markers[center].setAnimation(google.maps.Animation.BOUNCE);
}
