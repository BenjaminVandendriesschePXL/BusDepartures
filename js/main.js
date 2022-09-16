window.addEventListener("load",departures)


function departures(){
    const api_key = "Zju4uas3VQBnJ2r2BGY2kMGXAYg6pj0SxNyRpIKjDxk";

    let configData;
    const dataGatheringInterval = setInterval(callApi, 1000 );
    const removePastDeparturesInterval = setInterval(removeOldDepartures,60000)
    let busStopName
    let trainStopName

    function removeOldDepartures() {
        let dataSet = document.getElementById("Bus_departures")
        let children = dataSet.getElementsByTagName("tr");
        let currentTime = new Date();
        console.log(currentTime)
        for (let i = 0; i<children.length;i++){
            let time = new Date(children[i].getAttribute("departure"))
            if(time - currentTime < 0){
                console.log("delete")
                if(children[i].hasChildNodes()){
                    children[i].removeChild(children[i].children[0])
                }
                dataSet.removeChild(children[i]);
            }
            console.log("negative")
        }
        dataSet = document.getElementById("Train_departures")
        children = dataSet.getElementsByTagName("tr");

        for (let i = 0; i<children.length;i++){
            let time = new Date(children[i].getAttribute("departure"))
            if(time - currentTime < 0){
                console.log("delete")
                if(children[i].hasChildNodes()){
                    children[i].removeChild(children[i].children[0])
                }
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
        busStopName = configData.BusStopName;
        trainStopName = configData.TrainStopName;
        callApi();
    }


    function callApi() {
        console.log("GetData");
        fetch(`https://transit.hereapi.com/v8/departures?ids=${configData.busStopIds}&maxPerBoard=50&apikey=${api_key}`)
            .then((response)=>{ return response.json()})
            .then((data)=>prepareData((data.boards),"Bus"));
        console.log("GetData");
        fetch(`https://transit.hereapi.com/v8/departures?ids=${configData.trainStopIds}&maxPerBoard=50&apikey=${api_key}`)
            .then((response)=>{ return response.json()})
            .then((data)=>prepareData((data.boards),"Train"));


    }

    function prepareData(data,transport){

        let departureList = [];
        console.log(data);
        let list = document.getElementById(transport+"_departures");
        for(let i = 0;i<data.length;i++){
            for(let j = 0;j<data[i].departures.length;j++){
                departureList.push([data[i].departures[j],transport+"stop: "+ data[i].place.code]);
            }
        }
        departureList.sort(function(a,b){
            a[0].time = new Date(a[0].time);
            b[0].time = new Date(b[0].time);
            return a[0].time - b[0].time;
        })
        createTable(departureList,transport);

    }




    function createTable(departureList,transport) {
        let tableId = transport+"_departures"
        console.log(tableId)
        let table = document.getElementById(tableId);
        table.innerHTML="";
        let trainStopNameHeader = document.getElementById(transport+"StopName")
        let headerText
        if(transport === "Bus") {
            headerText = document.createTextNode(busStopName)
        }else if(transport === "Train") {
            headerText = document.createTextNode(trainStopName)
        }
        trainStopNameHeader.appendChild(headerText)
        for (let i = 0; i < departureList.length; i++)
        {
            console.log(departureList[i]);
            let newRow = document.createElement("tr");
            let secondRow = document.createElement("tr");
            let busNumberCell = document.createElement("td");
            let busNumberText = document.createTextNode(departureList[i][0].transport.name);
            let busNumberSpan = document.createElement("span")
            busNumberSpan.appendChild(busNumberText)
            let busDepartureTimeCell = document.createElement("td");
            let busDepartureTimeText = document.createTextNode(departureList[i][0].time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}));
            if(departureList[i][0].delay > 0 ){
                busDepartureTimeCell.style.color = "red";
            }
            let busDestinationCell = document.createElement("td");
            let busDestinationText = document.createTextNode(departureList[i][0].transport.headsign);
            let linebreak = document.createElement("br");

            busNumberCell.appendChild(busNumberSpan);
            busNumberSpan.style.color = departureList[i][0].transport.textColor;
            //busNumberCell.setAttribute("rowspan",2)
            busNumberCell.classList.add("busNumber","spacingUnder")
            busNumberSpan.style.backgroundColor = departureList[i][0].transport.color;
            busDepartureTimeCell.appendChild(busDepartureTimeText);
            busDepartureTimeCell.appendChild(linebreak);
            busDepartureTimeCell.appendChild(busDestinationText);
            busDepartureTimeCell.classList.add("spacingUnder")

            newRow.setAttribute("departure",departureList[i][0].time);
            secondRow.setAttribute("departure",departureList[i][0].time);

            newRow.appendChild(busNumberCell);
            newRow.appendChild(busDepartureTimeCell);
            //secondRow.appendChild(busDestinationCell);
            table.appendChild(newRow);
            //table.appendChild(secondRow);
        }
    }
}
