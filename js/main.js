departures()

function departures(){
    const api_key = "1hUmyZTqwRy5yxuakb-EuYtcukE8PzGg81A-BxAYPJo";
    let configData;

    const dataGatheringInterval = setInterval(callApi, 14400000 );
    const removePastDeparturesInterval = setInterval(removeOldDepartures,30000)


    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => loadConfig(position));
    } else{
        configData = getDefaultData()
        callApi()
    }

    function removeOldDepartures() {
        let timer = document.getElementById("currentTime")
        let dataSet = document.getElementById("Bus_departures")
        let children = dataSet.getElementsByClassName("card")
        let currentTime = new Date();
        let timerText = document.createTextNode(currentTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        }))
        timer.innerText = ""
        timer.appendChild(timerText)
        for (let i = 0; i < children.length; i++) {
            let time = new Date(children[i].getAttribute("departure"))

            if (time - currentTime < 0) {
                dataSet.removeChild(children[i]);
                // if(children[i].hasChildNodes()){
                //     children[i].removeChild(children[i].children[0])
            }
            //dataSet.removeChild(children[i]);
        }

        dataSet = document.getElementById("Train_departures")
        children = dataSet.getElementsByClassName("card");
        console.log(children.length)
        for (let i = 0; i < children.length; i++) {
            console.log(children[i])
            let time = new Date(children[i].getAttribute("departure"))
            if (time - currentTime < 0) {
                dataSet.removeChild(children[i]);
                console.log("delete");

            }
        }

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


    function createCard(name,time,headsign,textColor,color){
       
        let card = document.createElement("div")
        let transportNumber = document.createElement("div")
        let cardBody = document.createElement("div")
        let cardTime = document.createElement("p")
        let cardLine = document.createElement("p")
        let transportNumberText = document.createTextNode(name)
        let transportTime = document.createTextNode(time)
        let transportHeadsign = document.createTextNode(headsign)
        
        card.classList.add("card","h-1","flex-row")
        transportNumber.classList.add("card-img-left", "busNumber")
        cardBody.classList.add("card-body")
        cardTime.classList.add("card-text")
        cardLine.classList.add("card-text")

        transportNumber.style.color = textColor;
        transportNumber.style.backgroundColor = color;
        cardTime.style.margin = 0;

        card.appendChild(transportNumber)
        card.appendChild(cardBody)
        cardBody.appendChild(cardTime)
        cardBody.appendChild(cardLine)
        transportNumber.appendChild(transportNumberText)
        cardTime.appendChild(transportTime)
        cardLine.appendChild(transportHeadsign)
        return card
        // <div className="row">
        //     <div className="col">
        //         <div className="card h-1 flex-row">
        //             <div className="card-img-left"
        //                  style="width:40px;height:40px;margin:auto;background:red;text-align:center;line-height:40px;border-radius:10px">333
        //             </div>
        //             <div className="card-body" style="padding:5px">
        //                 <p className="card-text" style="margin:0">11u45</p>
        //                 <p className="card-text">leuven-tremolo</p>
        //
        //             </div>
        //         </div>
        //     </div>
        //     <div className="col-sm">
    }

    function createTable(departureList,transport) {
        let divId = transport+"_departures"
         let divToFill = document.getElementById(divId);
        // table.innerHTML="";
        let trainStopNameHeader = document.getElementById(transport+"StopName")

        for (let i = 0; i < departureList.length; i++)
        {
            let newCard = createCard(departureList[i][0].transport.name,departureList[i][0].time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}),departureList[i][0].transport.headsign,departureList[i][0].transport.textColor,departureList[i][0].transport.color)

            newCard.setAttribute("departure",departureList[i][0].time)
            divToFill.appendChild(newCard)

            // let newRow = document.createElement("tr");
            // let busNumberCell = document.createElement("td");
            // let busNumberText = document.createTextNode(departureList[i][0].transport.name,);
            // let busNumberSpan = document.createElement("span")
            // busNumberSpan.appendChild(busNumberText)
            // let busDepartureTimeCell = document.createElement("td");
            // let busDepartureTimeText = document.createTextNode(departureList[i][0].time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}));
            //
            // let busDestinationText = document.createTextNode(departureList[i][0].transport.headsign);
            // let linebreak = document.createElement("br");
            //
            // busNumberCell.appendChild(busNumberSpan);
            // busNumberSpan.style.color = departureList[i][0].transport.textColor;
            // busNumberSpan.style.backgroundColor = departureList[i][0].transport.color;
            // busDepartureTimeCell.appendChild(busDepartureTimeText);
            // busDepartureTimeCell.appendChild(linebreak);
            // busDepartureTimeCell.appendChild(busDestinationText);
            //
            // newRow.appendChild(busNumberCell);
            // newRow.appendChild(busDepartureTimeCell);
            // table.appendChild(newRow);
        }

    }
}
