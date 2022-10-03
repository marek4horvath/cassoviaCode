import React, { useEffect, useState } from "react";
import '../../assets/css/weatherInfo.css';
import { Link } from 'react-router-dom';
import {MdLocationOn,MdOutlineHourglassEmpty} from 'react-icons/md';
import {FiWind} from 'react-icons/fi';
import { WiHumidity, WiHorizonAlt,WiHorizon} from 'react-icons/wi'
import {TbGauge} from 'react-icons/tb'
import dateFormat from 'dateformat';



function WeatherInfo(props) {
  //PROPS data from the parent
  const {onInfoWeather,cityName, onDeysWeather} = props;

  const sizeIcone = 50;
  const date = dateFormat(Date(onInfoWeather.dt*1000), "dddd, d mmm yyyy | h:MM TT");
  const tempMax = Math.round(onInfoWeather.temp_max);
  const tempMin = Math.round(onInfoWeather.temp_min);
  const temp = Math.round(onInfoWeather.temp);
  const sunrise = new Date(onInfoWeather.sunrise * 1000).toLocaleTimeString('en-IN',{ hour: '2-digit', minute: '2-digit' }).toLocaleUpperCase();
  const sunset = new Date(onInfoWeather.sunset * 1000).toLocaleTimeString('en-IN',{ hour: '2-digit', minute: '2-digit' }).toLocaleUpperCase();
  const nf = new Intl.NumberFormat();

  // displays the weather data for three days ahead
  const listDeyWeather = onDeysWeather && onDeysWeather.length > 0 &&  onDeysWeather.map((item, index) => {
      if(item.main !== undefined){
        return(
          <div className="col-md-4 col centerBox shadowBox"  key= {index}>
              <p> <img src= {"http://openweathermap.org/img/wn/" + `${item.weather[0].icon}` + "@2x.png"} alt={item.weather[0].icon} /></p>
              <p className="value">{dateFormat(item.dt_txt, "ddd, dd")}</p>
              <p className="title">{Math.round(item.main.temp_max)}°C↑  {Math.round(item.main.temp_min)}°C↓</p>
          </div>
        )
      }

  });


    return (
      <div className="wrapper">

          <div className="row">
              <div className="col-md-6 col " style={{padding : "15px 15px"}}>
                  <span className="font">{date}</span>
              </div>
              <div className="col-md-6 col-5">
                <div className="button ">
                    <Link to="/search">{cityName},Slovakia <MdLocationOn /></Link>
                </div>
              </div>
          </div>

          <div className="container">
              <div className="row centerElements">
                  <div className="col-md-4 col centerBox">
                      <p style={{position: "absolute"}}>
                          <img src= {"http://openweathermap.org/img/wn/" + `${onInfoWeather.icon}` + "@2x.png"} alt={onInfoWeather.icon} />
                      </p>
                      <p style={{fontSize: "20px", top: "75px", position: "relative", height: "30%", }}>
                         {onInfoWeather.main}
                      </p>
                  </div>
                  <div className="col-md-4 col centerBox">
                  <p id="temperature">
                      <span >{temp}</span>
                      <sup color="#999">°C</sup>
                    </p>
                  </div>
                  <div className="col-md-4 col centerBox">
                      <p className="tempMax title" >{tempMax}°C↑</p>
                      <p className="tempMin title" >{tempMin}°C↓</p>
                  </div>
              </div>

              <div className="row centerElements">
                  <div className="col-md-4 col centerBox">
                        <p><WiHumidity size={sizeIcone} color="#999"/></p>
                        <p className="value">{onInfoWeather.humidity}%</p>
                        <p className="title">Humidity</p>
                  </div>
                  <div className="col-md-4 col centerBox">
                    <p><TbGauge size={sizeIcone} color="#999"/></p>
                    <p className="value">{nf.format(onInfoWeather.pressure)}mBar</p>
                    <p className="title">Pressure</p>
                  </div>
                  <div className="col-md-4 col centerBox">
                    <p><FiWind size={sizeIcone} color="#999" /></p>
                    <p className="value">{onInfoWeather.wind_speed}km/h</p>
                    <p className="title">Wind</p>
                  </div>
              </div>

              <div className="row centerElements">
                  <div className="col-md-4 col centerBox">
                    <p><WiHorizonAlt size={sizeIcone} color="#999"/></p>
                    <p className="value">{sunrise}</p>
                    <p className="title">Sunrise</p>
                  </div>
                  <div className="col-md-4 col centerBox">
                    <p><WiHorizon size={sizeIcone} color="#999"/></p>
                    <p className="value">{sunset}</p>
                    <p className="title">Sunset</p>
                  </div>
                  <div className="col-md-4 col centerBox">
                    <p><MdOutlineHourglassEmpty size={sizeIcone} color="#999" /></p>
                    <p className="value">13h 1m</p>
                    <p className="title">Daytime</p>
                  </div>
              </div>

              <div className="row centerElements">
                    {listDeyWeather}
              </div>
          </div>

      </div>
    );
  }
export default WeatherInfo;


