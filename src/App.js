import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  formControlClasses
} from '@mui/material';
import axios from 'axios';
import Storm from './StormClass';
import { isCompositeComponent } from 'react-dom/test-utils';



function App() {
  /* Generate button disabled variable */
  const [generateDisable, setGenerateDisable] = useState(false);

  const [dataArray, setDataArray] = useState([]);

  const [newDataArray, setNewDataArray] = useState([]);

  const locationAPI = async (latitude, longitude) => {
    //console.log(latitude, longitude)
    try{
      const response = await axios.get(`https://api-bdc.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=bdc_37ebfa18e020429aa9c3d0babcc04a4b`);
      let foo = await response.data;
      //console.log(response.data);
      if(foo.countryCode === "US"){
        if(foo.principalSubdivision === "Florida"){
          //console.log("this is a valid dataentry: ",foo)
          return(true)
        } else{
          return(false)
        }
      } else {
        return(false)
      }
    } catch(errors){
      console.log(errors)
    }
  }

  async function flordiaCallBack(testingArray){
    //console.log("Beginning array: ", testingArray);
    for(let i = 0; i < testingArray.length; i++){
      let newDataArray = [];
      for(let j = 0; j < testingArray[i].data.length; j++){
        const result = await locationAPI(testingArray[i].data[j].latitude, testingArray[i].data[j].longitude)
        if(result){
          //console.log("This point stays: ", testingArray[i].data[j])
          newDataArray.push(testingArray[i].data[j]);
          //newDataArray[i].data.push(dataArray[i].data[j]);
        }
      }
      //console.log("New Data Array: ", newDataArray)
      testingArray[i].data = newDataArray;
      //console.log("New Results: ", testingArray);
    }
    
  }

 /*function isStormInFlorida(storm){
    let newStormData = storm.data.filter( stormData => {
       locationAPI(stormData.latitude, stormData.longitude).then((result) => {
        console.log("Result: ", result)
      })
    })
  }*/


      /*let results = locationAPI(stormData.latitude, stormData.longitude);
      console.log("Results: ", results)
      if(results){
        return true;
      } else {
        return false;
      }
    })*/
    /*console.log("Here is newStormData: ", newStormData)
    storm.setData(newStormData);
    if(storm.data.length !== 0){
      return true;
    } else {
      return false;
    }*/
  
  
  
 
  function getName(tempData){
    //18-27 28 = ,
    let name = "";
    for(let i = 18; i <= 28; i++){
      if((tempData[i] !== " ") && (tempData[i] !== ",")){
        name += tempData[i];
      }
    }
    return name;
  }

  function flordiaBounds(latitude, longitude){
    const FB = {
      latMin: 24.39,
      latMax: 31,
      longMin: -87.6,
      longMax: -79.9
    };
    /* Checking Latitude */
    if((latitude >= FB.latMin) && (latitude <= FB.latMax)){
      /* Checking Longitude */
      if((longitude >= FB.longMin) && (longitude <= FB.longMax)){
        return true;
      } else {
        return false
      }
    } else {
      return false
    }
  }

  function stormCheck(stormType)  {
    if(stormType !== 'SD'){
      return true;
    } else { 
      return false;
    }
  }

  function getWindSpeed(tempData){
    let tempWind = "";
    for(let i = 38; i < 41; i++){
      if((tempData[i] !== ",") || (tempData[i] !== " ")){
        tempWind += tempData[i];
      }
    }
    return(parseInt(tempWind));
  }


  useEffect(() => {
    //setDataArray([]);
    const apiUrl = 'https://www.nhc.noaa.gov/data/hurdat/hurdat2-1851-2022-050423.txt';
    const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
    axios.get(corsProxyUrl + apiUrl)
    .then(response => {
      console.log("Test: ", response.data.split('\n').length)
      /* This loops through the whole file */
      let key = 0;
      let num = 0;
      let numofStorms = 0;
      let tempData = response.data.split('\n');
      while(tempData[key] !== ""){
        //console.log(tempData[key]);
        num = parseInt(tempData[key][33] + tempData[key][34] + tempData[key][35]);
        let year = parseInt(tempData[key][4] + tempData[key][5] + tempData[key][6] + tempData[key][7]);

        if(year >= 1900){
          //get storm name
          let name = getName(tempData[key]);
          //create a new storm object
          const stormObj = new Storm(year, name);
          //console.log(stormObj)
          //at 1581 storms
          for(let i = 1; i <= num; i++){

            /* Grabbing latitude and longitude */
            let latitude = parseFloat(tempData[key + i][23] + tempData[key + i][24] + tempData[key + i][25] + tempData[key + i][26]);
            let longitude = ((-1) * parseFloat(tempData[key + i][31] + tempData[key + i][32] + tempData[key + i][33] + tempData[key + i][34]));
            
            /* checking to see if its roughly in the Flordia bounds */ 
            if(flordiaBounds(latitude, longitude)){
              /* checking if its an actual storm we need to track */
              if(stormCheck(tempData[key + i][19] + tempData[key + i][20])){
                
                /* Grabbing date */
                let year = tempData[key+i][0] + tempData[key+i][1] + tempData[key+i][2] + tempData[key+i][3];
                let month = tempData[key+i][4] + tempData[key+i][5];
                let day = tempData[key+i][6] + tempData[key+i][7];
                let date = month + "/" + day + "/" + year;

                /* Getting Wind Speed */
                let windSpeed = getWindSpeed(tempData[key+i])

                stormObj.addToDataArray(date, latitude, longitude, windSpeed);
              } 
            }
          }
          if(stormObj.data.length !== 0){
            dataArray.push(stormObj);
          }
        } 
        key = key + num + 1;
      }
      console.log(dataArray)
    })
    .catch(error => {
      // Handle errors here
      console.error(error);
    });
  }, []);


  function generate() {
    setGenerateDisable(true);
    //let testingArray = [...dataArray.slice(0,15)];
    //console.log("Before callback array: ", testingArray);
    flordiaCallBack(dataArray);
    console.log("Results ", dataArray);
    //console.log("Line after callback")
    /*for(let i = 0; i < testingArray.length; i++){
      let answer = isStormInFlorida(dataArray[i])
      console.log("Generate answer: ", answer);
    }*/
  }
    /*let stormsInFlorida = testingArray.filter(storm => {
      let answer = isStormInFlorida(storm);
      console.log("Answer: ", answer)
      /*if(isStormInFlorida(storm) === true){
        return true;
      } else {
        return false;
      }*/
    //console.log("Storms in Florida: ", stormsInFlorida)


  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 5
        }}
      >
        <Button onClick={generate} disabled={generateDisable} variant='contained'>Generate</Button>
      </Box>
    </React.Fragment>
  );
}

export default App;


/*

  stormsInFlorida = dataArray.flatmap(storm => {
    validPoints = storm.data.flatmap(stormData => {
      return isPointInFlorida(stormData.latitude, stormData.longitude)
    })
    if(validPoints.length > 0){
      storm.data = validPoints
      return true
    } else {

    }
  })


*/