import React, {useState,useEffect} from "react";
import { Link } from 'react-router-dom';
import '../../assets/css/locationSearch.css'



function LocationSearch(props){

    //PROPS data from the parent
    const {onParentCallback,onLocation} = props;

    // THE START use State
    const [query, setQuery] = useState("");
    const [listLocation, setListLocation] = useState([]);
    // THE END use State


    // THE START use Effect

     //Runs on the first render

    //And any time any dependency value changes
    useEffect(() => {
        //function for searching places location
        const newListLocation = onLocation.filter(citys => citys.city.toLowerCase().includes(query.toLowerCase()));
        setListLocation(newListLocation)
    }, [query])
    // THE END use Effect

    // function to set the parameters (pathName, cityName) after clicking on the <Link>
    const togglePathName = (pathName, cityName) => {
        onParentCallback(pathName, cityName);
    };

    // function to display the location list
    const cityList = listLocation.map((item)=>{
        return(

              <Link to= "/"  onClick={event => togglePathName(item.path, item.city)} key={item.id}>
                <li key={item.id}  className="list-group-item d-flex justify-content-between align-items-center">
                    {item.city}
                    <span className="badge badge-primary badge-pill">{Math.round(item.temp)}</span>
                </li>
              </Link>
        );
    });

    return(
        <>
        <div className="wrapper">
            <div className="container">
                <div className="row g-2 pt-4">
                    <h4>Location</h4>
                        <input  type="text" placeholder="Search city ..."  onChange={event => setQuery(event.target.value)}/>
                </div>
                <div className="row">
                <ul className="list-group">
                    {cityList }
                </ul>
                </div>
            </div>
        </div>
        </>
    );

}
export default LocationSearch