departures()

function departures() {
    const api_key = "B4H5cMf3uGI8mEZEeGJTvruQsrx_ozLLVJ7ifTWo6zU";
    let configData;
    function init_widget(config) {
        if (!config) {
            console.log("no config")
            return;
        }
        let auth_token = config.player_params['auth_token']
        console.log("auth token" + auth_token)
    }

    const dataGatheringInterval = setInterval(function e() {
        getBusData()
    }, 14400000);
    const removePastDeparturesInterval = setInterval(removeOldDepartures, 30000)

    configData = getDefaultData()
    let busname = document.getElementById("BusStopName")
    let trainname = document.getElementById("TrainStopName")
    busname.appendChild(document.createTextNode(configData.BusStopName))
    trainname.appendChild(document.createTextNode(configData.TrainStopName))
    getBusData();


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
            }

        }

        dataSet = document.getElementById("Train_departures")
        children = dataSet.getElementsByClassName("card");

        for (let i = 0; i < children.length; i++) {
            let time = new Date(children[i].getAttribute("departure"))
            if (time - currentTime < 0) {
                dataSet.removeChild(children[i]);

            }
        }

    }


    function loadConfig(position) {
        configData = getConfigData(position);
        let busname = document.getElementById("BusStopName")
        let trainname = document.getElementById("TrainStopName")
        busname.appendChild(document.createTextNode(configData.BusStopName))
        trainname.appendChild(document.createTextNode(configData.TrainStopName))
        getBusData()
    }

    // function getDataViaPlayer(){
    //     const data = {
    //         "url":`https://transit.hereapi.com/v8/departures?ids=${configData.busStopIds}&maxPerBoard=50&apikey=${api_key}`,
    //         "method":"GET",
    //         "cache":"0"
    //     }
    //     fetch("http://localhost:9999/request",{
    //         "method":"POST",
    //         headers:{
    //             "Authorization":"widget "+auth_token
    //         },
    //         body:JSON.stringify(data)
    //     })
    //         .then((response)=>{
    //             if(response.status == 200){
    //                 return response.json();
    //             }else{
    //
    //
    //             }
    //         })
    //         .then((data)=>console.log(data));
    // }

    function getBusData() {

        let bussesUrl = `https://transit.hereapi.com/v8/departures?ids=${configData.busStopIds}&maxPerBoard=50&apikey=${api_key}`
        fetch(bussesUrl, {
            'method': 'GET',
            'Cache-Control': 'no-cache',
            'redirect': 'follow'
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => prepareData((data.boards), "Bus"))
            .then((data) => getTrainData())
    }

    function getTrainData() {

        let trainsUrl = `https://transit.hereapi.com/v8/departures?ids=${configData.trainStopIds}&maxPerBoard=50&apikey=${api_key}`
        fetch(trainsUrl, {
            'method': 'GET',
            'Cache-Control': 'no-cache',
            'redirect': 'follow'
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => prepareData((data.boards), "Train"));

    }

    function prepareData(data, transport) {
        let departureList = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].departures.length; j++) {
                departureList.push([data[i].departures[j], transport + "stop: " + data[i].place.code]);
            }
        }
        departureList.sort(function (a, b) {
            a[0].time = new Date(a[0].time);
            b[0].time = new Date(b[0].time);
            return a[0].time - b[0].time;
        })
        createTable(departureList, transport);

    }


    function createCard(name, time, headsign, textColor, color) {

        let card = document.createElement("div")
        let transportNumber = document.createElement("div")
        let cardBody = document.createElement("div")
        let cardTime = document.createElement("p")
        let cardLine = document.createElement("p")
        let transportNumberText = document.createTextNode(name)
        let transportTime = document.createTextNode(time)
        let transportHeadsign = document.createTextNode(headsign)

        card.classList.add("card", "h-1", "flex-row")
        transportNumber.classList.add("card-img-left", "busNumber")
        cardBody.classList.add("card-body")
        cardTime.classList.add("card-text")
        cardLine.classList.add("card-text")

        cardTime.style.margin = 0;

        card.appendChild(transportNumber)
        card.appendChild(cardBody)
        cardBody.appendChild(cardTime)
        cardBody.appendChild(cardLine)
        transportNumber.appendChild(transportNumberText)
        cardTime.appendChild(transportTime)
        cardLine.appendChild(transportHeadsign)
        return card

    }

    function createTable(departureList, transport) {
        let divId = transport + "_departures"
        let divToFill = document.getElementById(divId);


        for (let i = 0; i < departureList.length; i++) {
            let newCard = createCard(departureList[i][0].transport.name, departureList[i][0].time.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            }), departureList[i][0].transport.headsign, departureList[i][0].transport.textColor, departureList[i][0].transport.color)

            newCard.setAttribute("departure", departureList[i][0].time)
            divToFill.appendChild(newCard)

        }

    }
}
