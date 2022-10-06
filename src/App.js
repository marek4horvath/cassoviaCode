import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios'
import WeatherInfo from './components/WeatherInfo/index';
import LocationSearch from './components/LocationSearch/index';
import dateFormat from 'dateformat';
import {location} from './location.js'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  //api key openweathermap
  const API_KEY = 'bb25225a11120b81e8151d94c6af202f';
  // THE START use State
  const [daysWeather, setDaysWeather] = useState();
  const [weatherInfo, setWeatherInfo] = useState({
    dt:0,
    temp: 0,
    temp_max: 0,
    temp_min: 0,
    pressure: 0,
    humidity: 0,
    main: "",
    icon: "",
    sunrise: 0,
    sunset: 0,
    windSpeed: 0,
  });
  const [city, setCity] = useState("Košice");
  const [pathName, setPathName] = useState("");
  // THE END use State

  //default location for the first data loading
  const defaultLocation = "kosice";



  //collback function. return pathName and cityName from the component LocationSearch
  const callbackFunction = (pathName, cityName) => {
    setCity(cityName);
    setPathName(pathName);
  };

  // function return pathCity for loading data from the location
  const getURL = (city)=>{
      var pathCity ="";
      if(city === "" ){
        pathCity = defaultLocation;
      }else{
        pathCity = city;
      }
      return pathCity;
  };

  // function return next dey
  const getNextDay = (dey)=>{
    var nexDey = "";
    var dt = new Date();
    nexDey = dt.setDate(dt.getDate() + dey);
    return nexDey !== "" ? nexDey : null;
  };

  const getTime =()=>{
    var date = new Date();
    var actualHours = date.getHours();
    const closestHours = [0,3,6,9,12,15,18,21].reduce((a, b) => {
      return Math.abs(b - actualHours) < Math.abs(a - actualHours) ? b : a;
    });
      return  String(Math.abs(closestHours)).charAt(0) == closestHours ? "0"+closestHours.toString() : closestHours.toString();
  }
  function getWeatherDey(groupedData){
    var dayAndTimeWeather = [];
    for(let i=1; i <= 3; i++){
      dayAndTimeWeather.push(groupedData[dateFormat(getNextDay(i), "yyyy-mm-dd")]);
    }
    setDaysWeather(getDaysWeather(dayAndTimeWeather));
  }

  function weatherForToday(groupedData,city){
    var dt = new Date();
    for(let i of Object.keys(groupedData)){
      if(dateFormat(dt, "yyyy-mm-dd") === i){
          groupedData[i].map((item) =>{
              if( item  !== undefined){
                const date = item.dt_txt.split(' ');
                const horse = date[1].split(':');
                if(date[0] === dateFormat(getNextDay(i), "yyyy-mm-dd") && horse[0] === getTime()){
                  console.log(item);
                    setWeatherInfo({...weatherInfo,
                      'dt': new Date,//item.dt,
                      'temp': item.main.temp,
                      'temp_max': item.main.temp_max,
                      'temp_min': item.main.temp_min,
                      'pressure': item.main.pressure,
                      'humidity': item.main.humidity,
                      'main': item.weather[0].main,
                      'icon': item.weather[0].icon,
                      'sunrise': city.sunrise,
                      'sunset': city.sunset,
                    'wind_speed': item.wind.speed,
                    });
                }
            }
            return null;
          });
        }
    }
  }

  function getDaysWeather(dayAndTimeWeather){
    var arrayDeysWeather = [];
      for(let i=1; i <= 3; i++){
        dayAndTimeWeather.map((item) =>{
            if( item  !== undefined){
              item.filter((element) =>{
                const date = element.dt_txt.split(' ');
                const horse = date[1].split(':');
                if(date[0] === dateFormat(getNextDay(i), "yyyy-mm-dd") && horse[0] === getTime()){
                  arrayDeysWeather.push(element);
                }
            });
          }
        });
      }
      return arrayDeysWeather;
  }

  //function returns the weather for other days
  function getWeatherForDays(){

      axios.get('http://api.openweathermap.org/data/2.5/forecast?q=' + `${getURL(pathName)}` + ',sk&units=metric&APPID=' + `${API_KEY}`)
      .then(function (res) {
        const groupedData = res.data.list.reduce((days, row) => {
          const date = row.dt_txt.split(' ')[0];
          days[date] = [...(days[date] ? days[date]: []), row];
          return days;
        }, {});
      weatherForToday(groupedData,res.data.city)
      getWeatherDey(groupedData);
      });
  };

  //function returns the temperature for the given location
  function getTempLocation() {
      location.forEach((item) =>
        axios.get('http://api.openweathermap.org/data/2.5/weather?q=' + `${item.path}` + ',sk&units=metric&APPID=' + `${API_KEY}`)
          .then(function (res) {
              item.temp = res.data.main.temp;
          })
          .catch(function (error) {
            console.log(error);
          })
      );
    }

  // THE START use Effect
  // Runs only on the first render


  //Runs on the first render

  //And any time any dependency value changes
  useEffect(()=>{
    getWeatherForDays();
    getTempLocation();
   const update= setInterval(()=>{
     console.log(getTime());
     getWeatherForDays();
     getTempLocation();
    },60000) //10800000
    return ()=>{clearInterval(update);}
  },[pathName]);

  // THE END use Effect

 return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path="/search" element={<LocationSearch onParentCallback={callbackFunction} onLocation={location}/>} />
      <Route path="/" element={<WeatherInfo onInfoWeather={weatherInfo}  cityName ={city} onDeysWeather= {daysWeather} />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;