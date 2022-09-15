const api_key = "Zju4uas3VQBnJ2r2BGY2kMGXAYg6pj0SxNyRpIKjDxk";
let configData;
const dataGatheringInterval = setInterval(callApi, 600000);
const removePastDeparturesInterval = setInterval(removeOldDepartures,1000)
let busStopName

function removeOldDepartures() {
  let dataSet = document.getElementById("bus_departures")
  let children = dataSet.getElementsByTagName("tr");
  let currentTime = new Date();
  console.log(currentTime)
  for (let i = 0; i<children.length;i++){
    let time = new Date(children[i].getAttribute("departure"))
    if(time - currentTime < 0){
      console.log("delete")
      if(children[i].hasChildNodes()){
        children[i].removeChild(children[i].children[0])
      };
      dataSet.removeChild(children[i]);
    }
    console.log("negative")
  }
}

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => loadConfig(position));
} else{
  configData = getDefaultData()
  callApi()
}

function loadConfig(position) {
  configData = getConfigData(position);
  callApi();
}


function callApi() {
  console.log("GetData");
  fetch(`https://transit.hereapi.com/v8/departures?ids=${configData.busStopIds}&maxPerBoard=10&apikey=${api_key}`)
    .then((response)=>{ return response.json()})
    .then((data)=>prepareData(data.boards));
}

function prepareData(data){
  busStopName = data[0].place.name
  let busDepartures = [];
  console.log(data);
  let list = document.getElementById("bus_departures");
  for(let i = 0;i<data.length;i++){
    for(let j = 0;j<data[i].departures.length;j++){
      busDepartures.push([data[i].departures[j],"Busstop: "+ data[i].place.code]);
    }
  }
  busDepartures.sort(function(a,b){
    a[0].time = new Date(a[0].time);
    b[0].time = new Date(b[0].time);
    return a[0].time - b[0].time;
  })
  createTable(busDepartures);

}




function createTable(busDepartures) {
  let table = document.getElementById("bus_departures");
  table.innerHTML="";
  let tableHeader = document.createElement("thead")
  let headerText = document.createTextNode(busStopName)
  for (let i = 0; i < busDepartures.length; i++)
  {
    console.log(busDepartures[i]);
    let newRow = document.createElement("tr");
    let secondRow = document.createElement("tr");
    let busNumberCell = document.createElement("td");
    let busNumberText = document.createTextNode(busDepartures[i][0].transport.name);
    let busNumberSpan = document.createElement("span")
    busNumberSpan.appendChild(busNumberText)
    let busDepartureTimeCell = document.createElement("td");
    let busDepartureTimeText = document.createTextNode(busDepartures[i][0].time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}));
    if(busDepartures[i][0].delay > 0 ){
      busDepartureTimeCell.style.color = "red";
    }
    let busDestinationCell = document.createElement("td");
    let busDestinationText = document.createTextNode(busDepartures[i][0].transport.headsign);
    let linebreak = document.createElement("br");

    busNumberCell.appendChild(busNumberSpan);
    busNumberSpan.style.color = busDepartures[i][0].transport.textColor;
    //busNumberCell.setAttribute("rowspan",2)
    busNumberCell.classList.add("busNumber","spacingUnder")
    busNumberSpan.style.backgroundColor = busDepartures[i][0].transport.color;
    busDepartureTimeCell.appendChild(busDepartureTimeText);
    busDepartureTimeCell.appendChild(linebreak);
    busDepartureTimeCell.appendChild(busDestinationText);
    busDepartureTimeCell.classList.add("spacingUnder")

    newRow.setAttribute("departure",busDepartures[i][0].time);
    secondRow.setAttribute("departure",busDepartures[i][0].time);

    newRow.appendChild(busNumberCell);
    newRow.appendChild(busDepartureTimeCell);
    //secondRow.appendChild(busDestinationCell);
    table.appendChild(newRow);
    //table.appendChild(secondRow);
  }
}


