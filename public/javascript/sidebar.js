function openNav() {

    document.getElementById("mySidenav").style.width = document.documentElement.clientWidth<426 ? "100%" : "320px";
    // document.body.style.backgroundColor = "rgba(0,0,0,0.4)";

    // document.getElementById("mySidenav").style.width = "250px";
    // document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    // document.body.style.backgroundColor = "white";
    // document.getElementById("main").style.marginLeft= "0";
} 


function allOff(arr){
  for(var i=0; i<arr.length; i++){
    light(arr[i],'off');
  }
}


function x10(unit, command){
  httpGet('lights/?unit='+unit+'&command='+command);
}


function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}