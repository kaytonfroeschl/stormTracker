import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  formControlClasses,
  Typography
} from '@mui/material';
import axios from 'axios';
import Storm from './StormClass';




function App() {
  /* Generate button disabled variable */
  const [generateDisable, setGenerateDisable] = useState(false);

  /* Stores all storm objects */
  const [dataArray, setDataArray] = useState([]);

  const [show, setShow] = useState(false);

 /* 
    PARAMS: latitude and longitude
    ACTION: calls an api that reverse geocodes the coordinates and returns an address
    RETURNS: 
      TRUE: is in florida
      FALSE: not in florida
  */
  const locationAPI = async (latitude, longitude) => {
    //console.log(latitude, longitude)
    try{
      const response = await axios.get(`https://api-bdc.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=bdc_a08c131959d74c26a585d4d5dda912e7`);
      let foo = await response.data;
      if(foo.countryCode === "US"){
        if(foo.principalSubdivision === "Florida"){
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

  /*
    PARAMS: takes in a storm from floridaCallBackOne

    ACTION: loops through the storms data array variable and checks each data coords agaisnt the API 
    to see if that point is actually in florida. If it is then it adds that row of data to an array called coordsInFlordia
    Then at the end it sets storm.data equal to the new array of coords that are actually in flordia.

    RETURNS: 
      TRUE if the coords were in flordia 
      FALSE if they were not

  */

  async function floridaCallBackTwo (storm){
    let coordsInFlorida = await Promise.all(storm.data.map((coords) => locationAPI(coords.latitude, coords.longitude)));
    coordsInFlorida = coordsInFlorida.map((item, index) => { 
      if(item){ 
        return storm.data[index];
      } 
    });

    coordsInFlorida = coordsInFlorida.filter((item) => {
      if(item !== undefined){
        return item
      }
    })

    storm.data = coordsInFlorida;
    return storm;
  }

  /*
    PARAM: takes an array of storm objects that might be in Florida
    ACTION: maps through all the storms and calls FloridaCallbacktwo on each storm
    RETURN: 
  */
  async function floridaCallBackOne(storms){
    let stormsInFlorida = await Promise.all(storms.map((storm) => floridaCallBackTwo(storm)));
    stormsInFlorida = stormsInFlorida.filter((item) => { if(item){ return item }});
    return stormsInFlorida;
  }
  
   /* 
    PARAMS: the row storm we are looking at
    RETURNS: name of storm
  */
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

   /* 
    PARAMS: latitude and longitude
    RETURNS: 
      TRUE: if the latitude and longitude is between the loose coordinates of florida
      FALSE: if its no where near florida
  */
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

  /* 
    PARAMS: type of storm this row is classified as
    RETURNS: 
      TRUE: if its a storm that we want to track
      FALSE: if it is not a storm we want to track
  */
  function stormCheck(stormType)  {
    if(stormType !== 'SD'){
      return true;
    } else { 
      return false;
    }
  }

  /* 
    PARAMS: row of data we are looking at
    RETURNS: int of windSpeed for that row
  */
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
    /*API Call to grab the data */
    const apiUrl = 'https://www.nhc.noaa.gov/data/hurdat/hurdat2-1851-2022-050423.txt';
    const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
    axios.get(corsProxyUrl + apiUrl)
    .then(response => {
      /* Key points to the storms header */
      let key = 0;

      /* Tells us how much row of data this storm has on it */
      let num = 0;

      /* This splits up the data into lines delimitating them on the value of a new line */
      let tempData = response.data.split('\n');

      /* Looping through the whole file of data */
      while(tempData[key] !== ""){
        /* Grabbing number of rows */
        num = parseInt(tempData[key][33] + tempData[key][34] + tempData[key][35]);

        let year = parseInt(tempData[key][4] + tempData[key][5] + tempData[key][6] + tempData[key][7]);

        /* Checking to see if the storm is in the time frame we care about */
        if(year >= 1900){
          /* Getting the storms name */
          let name = getName(tempData[key]);

          /* creating a Storm object */
          const stormObj = new Storm(year, name);
          
          /* Looping through the rows of data on this specfic storm */
          for(let i = 1; i <= num; i++){

            /* Grabbing latitude and longitude */
            let latitude = parseFloat(tempData[key + i][23] + tempData[key + i][24] + tempData[key + i][25] + tempData[key + i][26]);
            let longitude = ((-1) * parseFloat(tempData[key + i][31] + tempData[key + i][32] + tempData[key + i][33] + tempData[key + i][34]));
            
            /* checking to see if its roughly in the Flordia bounds */ 
            if(flordiaBounds(latitude, longitude)){
              /* checking if its a type of storm we need to track */
              if(stormCheck(tempData[key + i][19] + tempData[key + i][20])){
                
                /* Grabbing date */
                let year = tempData[key+i][0] + tempData[key+i][1] + tempData[key+i][2] + tempData[key+i][3];
                let month = tempData[key+i][4] + tempData[key+i][5];
                let day = tempData[key+i][6] + tempData[key+i][7];
                let date = month + "/" + day + "/" + year;

                /* Getting Wind Speed */
                let windSpeed = getWindSpeed(tempData[key+i])

                /* Adding that row of data to the Storms data array */
                stormObj.addToDataArray(date, latitude, longitude, windSpeed);
              } 
            }
          }
          /* adding that storm object to our dataArray which holds all of our storms that are valid */
          if(stormObj.data.length !== 0){
            dataArray.push(stormObj);
          }
        } 
        /* Key points to the next storms header in the data */
        key = key + num + 1;
      }
      console.log(dataArray)
    })
    .catch(error => {
      // Handle errors here
      console.error(error);
    });
  }, []);

  /* This gets called on the button click */
  function generate() {
    /* Disable button */
    setGenerateDisable(true);
    //let testingArray = [...dataArray.slice(0,5)];
    //floridaCallBackOne(testingArray);
    //console.log(testingArray)
    floridaCallBackOne(dataArray);
    console.log("Results ", dataArray);
    setShow(true);
  }

  /* Showing the results list on the screen */
  function ShowList() {
    //return (<Typography>Hi</Typography>)
    const elements = [];
    dataArray.forEach(item => {
      if(item.data.length !== 0){
        elements.push(<Typography sx={{fontWeight:'bold'}}>{item.stormName }</Typography>)

        for(let i = 0; i < item.data.length; i++){
          elements.push(<Typography>{item.data[i].date + " " + item.data[i].windSpeed + "mph"}</Typography>)
        }
      }
    })
    return elements
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 5,
        }}
      >
        <Button onClick={generate} disabled={generateDisable} variant='contained'>Generate</Button>
      </Box>
      <Box>
        {show && <ShowList />}
      </Box>
    </React.Fragment>
  );
}

export default App;

