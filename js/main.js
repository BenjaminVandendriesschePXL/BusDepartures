window.addEventListener("load",departures)


function departures(){
    const api_key = "1hUmyZTqwRy5yxuakb-EuYtcukE8PzGg81A-BxAYPJo";

    let configData;
    const dataGatheringInterval = setInterval(callApi, 14400000 );
    const removePastDeparturesInterval = setInterval(removeOldDepartures,60000)


    function removeOldDepartures() {

        let dataSet = document.getElementById("Bus_departures")
        let children = dataSet.getElementsByTagName("tr");
        let currentTime = new Date();
        for (let i = 0; i<children.length;i++){
            let time = new Date(children[i].getAttribute("departure"))
            if(time - currentTime < 0){
                if(children[i].hasChildNodes()){
                    children[i].removeChild(children[i].children[0])
                }
                dataSet.removeChild(children[i]);
            }
        }
        dataSet = document.getElementById("Train_departures")
        children = dataSet.getElementsByTagName("tr");

        for (let i = 0; i<children.length;i++){
            let time = new Date(children[i].getAttribute("departure"))
            if(time - currentTime < 0){
                if(children[i].hasChildNodes()){
                    children[i].removeChild(children[i].children[0])
                }
                dataSet.removeChild(children[i]);
            }
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
        let busname = document.getElementById("BusStopName")
        let trainname = document.getElementById("TrainStopName")
        busname.appendChild(document.createTextNode(configData.BusStopName))
        trainname.appendChild(document.createTextNode(configData.TrainStopName))

        callApi();
    }


    function callApi() {


        fetch(`https://transit.hereapi.com/v8/departures?ids=${configData.busStopIds}&maxPerBoard=50&apikey=${api_key}`)
            .then((response)=>{ return response.json()})
            .then((data)=>prepareData((data.boards),"Bus"));

        fetch(`https://transit.hereapi.com/v8/departures?ids=${configData.trainStopIds}&maxPerBoard=50&apikey=${api_key}`)
            .then((response)=>{ return response.json()})
            .then((data)=>prepareData((data.boards),"Train"));


    }

    function prepareData(data,transport){

        let departureList = [];
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
        let table = document.getElementById(tableId);
        table.innerHTML="";
        let trainStopNameHeader = document.getElementById(transport+"StopName")

        for (let i = 0; i < departureList.length; i++)
        {
            let newRow = document.createElement("tr");
            let busNumberCell = document.createElement("td");
            let busNumberText = document.createTextNode(departureList[i][0].transport.name);
            let busNumberSpan = document.createElement("span")
            busNumberSpan.appendChild(busNumberText)
            let busDepartureTimeCell = document.createElement("td");
            let busDepartureTimeText = document.createTextNode(departureList[i][0].time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}));

            let busDestinationText = document.createTextNode(departureList[i][0].transport.headsign);
            let linebreak = document.createElement("br");

            busNumberCell.appendChild(busNumberSpan);
            busNumberSpan.style.color = departureList[i][0].transport.textColor;
            busNumberSpan.style.backgroundColor = departureList[i][0].transport.color;
            busDepartureTimeCell.appendChild(busDepartureTimeText);
            busDepartureTimeCell.appendChild(linebreak);
            busDepartureTimeCell.appendChild(busDestinationText);

            newRow.setAttribute("departure",departureList[i][0].time);
            newRow.appendChild(busNumberCell);
            newRow.appendChild(busDepartureTimeCell);
            table.appendChild(newRow);
        }
    }
}
