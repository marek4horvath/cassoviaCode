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
  const [daysWeather, setDaysWeather] = useState([{}]);
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

  function getWeatherDey(groupedData){

    var dayAndTimeWeather = [];
    for(let i=1; i <= 3; i++){
      dayAndTimeWeather.push(groupedData[dateFormat(getNextDay(i), "yyyy-mm-dd")]);
    }
    setDaysWeather(getDaysWeather(dayAndTimeWeather));
  }

  function getDaysWeather(dayAndTimeWeather){
    var arrayDeysWeather = [];
      for(let i=1; i <= 3; i++){
        dayAndTimeWeather.map((item) =>{
            if( item  !== undefined){
              item.filter((element) =>{
                const date = element.dt_txt.split(' ');
                const horse = date[1].split(':');
                if(date[0] === dateFormat(getNextDay(i), "yyyy-mm-dd") && horse[0] === "12"){
                  arrayDeysWeather.push(element);
                }
            });
          }
        });
      }
      return arrayDeysWeather;
  }


  // THE START use Effect
  // Runs only on the first render
  useEffect(()=>{
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
    getTempLocation();
  },[]);

  //Runs on the first render

  //And any time any dependency value changes
  useEffect(()=>{
    //function returns the weather for the given day
    function getData() {
      axios.get('http://api.openweathermap.org/data/2.5/weather?q=' + `${getURL(pathName)}` + ',sk&units=metric&APPID=' + `${API_KEY}`)
      .then(function (res) {
            setWeatherInfo({...weatherInfo,
              'dt':res.data.dt,
              'temp': res.data.main.temp,
              'temp_max': res.data.main.temp_max,
              'temp_min': res.data.main.temp_min,
              'pressure': res.data.main.pressure,
              'humidity': res.data.main.humidity,
              'main': res.data.weather[0].main,
              'icon': res.data.weather[0].icon,
              'sunrise': res.data.sys.sunrise,
              'sunset': res.data.sys.sunset,
            'wind_speed': res.data.wind.speed,
            });
      })
      .catch(function (error) {
        console.log(error);
      });
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
       getWeatherDey(groupedData);
      });
    };
    getWeatherForDays();
    getData();
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
