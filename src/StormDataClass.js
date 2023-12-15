
export default class StormData {
    //assuming already close to flordia has been checked
    constructor(date, latitude, longitude, windSpeed){
        this.setDate(date)
        this.setLatitude(latitude);
        this.setLongitude(longitude);
        this.setWindSpeed(windSpeed);
    }

    setDate(newDate){
        this.date = newDate;
    }

    setLatitude(newLatitude){
        this.latitude = newLatitude;
    }

    setLongitude(newLongitude){
        this.longitude = newLongitude;
    }

    setWindSpeed(newWindSpeed){
        this.windSpeed = newWindSpeed;
    }

    getDate(){
        return(this.date);
    }

    getLatitude(){
        return(this.latitude);
    }

    getLongitude(){
        return(this.longitude);
    }

    getWindSpeed(){
        return(this.windSpeed);
    }
}