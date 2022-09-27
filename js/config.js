const config = {
    Leuven : {
        busStopIds: ["204039703", "204017678"],
        trainStopIds: ["204039966"],
        BusStopName: "Issy-Val de Seine",
        TrainStopName: "Mairie d'Issy"
    }

}

function getConfigData(geolocation){
    //do something with geolocation
    return config.Leuven;
}

function getDefaultData(){
    //Fallback logic if no position is given
    return config.Leuven
}