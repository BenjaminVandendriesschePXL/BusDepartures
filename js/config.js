const config = {
    Leuven : {
        lat : "50.888",
        long : "4.706",
        busStopIds : ["211014019","211014018"],
        trainStopIds : ["211014005","211014006","211014007","211014008",
                        "211014009","211014010","211014011","211014012",
                        "211014013","211032507","211032513","211006560",
                        "211008800","211025156","211008808"],
        BusStopName : "Leuven Vaartvest",
        TrainStopName : "Leuven Station"
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