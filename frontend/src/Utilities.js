// Given bounds, gets radius.
export const getBoundsRadius = (bounds) => {
    // r = radius of the earth in km
    var r = 6378.8
    // degrees to radians (divide by 57.2958)
    var ne_lat = bounds.getNorthEast().lat() / 57.2958
    var ne_lng = bounds.getNorthEast().lng() / 57.2958
    var c_lat = bounds.getCenter().lat() / 57.2958
    var c_lng = bounds.getCenter().lng() / 57.2958
    // distance = circle radius from center to Northeast corner of bounds
    var r_km = r * Math.acos(
    Math.sin(c_lat) * Math.sin(ne_lat) + 
    Math.cos(c_lat) * Math.cos(ne_lat) * Math.cos(ne_lng - c_lng)
    )
    return r_km *1000 // radius in meters
}

export const formatDate = (date) => {
    date = new Date(date)
    var hours = date.getHours();
    var minutes = date.getMinutes();

    var ampm = hours >= 12 ? ' PM' : ' AM'
    hours = hours % 12;
    hours = hours ? hours : 12;

    minutes = minutes < 10 ? '0'+minutes : minutes;

    var strTime = hours + ':' + minutes + ampm;

    return strTime;

}

export const getFormattedDate = (input) => {
    var pattern = /(.*?)-(.*?)-(.*?)$/;
    var result = input.replace(pattern,function(match,p1,p2,p3){
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return p3 + " " + months[(p2-1)];
    });

    return (result);
}