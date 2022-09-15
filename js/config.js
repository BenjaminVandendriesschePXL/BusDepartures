const config = {
    Leuven : {
        lat : "50.888",
        long : "4.706",
        busStopIds : ["211014019","211014018"]
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