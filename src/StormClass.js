import StormData from './StormDataClass';

/* 
    PARAMS: name and year
    VARIABLES: 
        name - string
        year - int
        data - array of StormData objects
*/

export default class Storm {
    constructor(stormYear, stormName) {
        this.setStormYear(stormYear)
        this.setStormName(stormName);
        this.data = [];
    }

    addToDataArray(date, latitude, longitude, windSpeed){
        const stormDataObj = new StormData(date, latitude, longitude, windSpeed);
        this.data.push(stormDataObj);
    }

    setData(newData){
        this.data = newData;
    }

    setStormYear(newYear){
        this.stormYear = newYear;
    }

    setStormName(newName){
        this.stormName = newName;
    }

    getData(){
        return(this.data);
    }

    getStormYear(){
        return(this.year);
    }

    getStormName(){
        return(this.name);
    }
}