import { useEffect, useState } from 'react';
import axios from 'axios';

import './main.css'
import './screen_width.css'
import PlaceInfo from './Place';

interface PlacesByArea {
  [key: string]: {
    [key: string]: string[];
  };
}

function AllPlaces() {
  // All the loading part, thinking about seperating this code with 
  // the lower one that just hides or displays the countries
  const [placesByArea, setPlacesByArea] = useState<PlacesByArea>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPlaces = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://restcountries.com/v3.1/all`);
        const countries = response.data;
        const categorisedCountries = countries.reduce((
          acc: { [x: string]: any[]; }, 
          country: { 
            region: any; 
            subregion: any; 
            name: { common: any; }; 
        }) => {
          const continent = country.region;
          const subregion = country.subregion;
          if (!acc[continent]) {
            acc[continent] = [];
          }
          if (!acc[continent][subregion]) {
            acc[continent][subregion] = [];
          }
          acc[continent][subregion].push(country.name.common);
          return acc;
        }, {});
        setPlacesByArea(categorisedCountries);
        setLoading(false);
      } catch (error){
        setLoading(false);
      }
    };
    fetchAllPlaces();
  }, []);

  // test
  const [activeContinent, setActiveContinent] = useState('');
  const tellTheId = (event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
    const target = event.target as HTMLElement;
    setActiveContinent(target.id);
  };

  // appear / disappear things (temp.)
  // const [contIsActive, setContIsActive] = useState(false);
  // const continentVis = () => {
  //   setContIsActive(current => !current);
  // };

  // const [subIsActive, setSubIsActive] = useState(false);
  // const subregionVis = () => {
  //   setSubIsActive(current => !current);
  // };

  return (
    <>
      <div className="earth">
        <div className="btn-container">
          <p>temp. buttons vvv</p> {/* as it reads */}
          {/* <button onClick={continentVis}>Continent</button> */}
          {/* <button onClick={subregionVis}>Subregion</button> */}
        </div>
        {/* <h2 className='earth-text' onClick={continentVis}>Earth:</h2> */}
        {loading?(
          // if it is loading then yeah vvv
          <div className='loading-text'>Loading...</div>
        ):(
          // actual loaded countries:
          <div className='continents'>
          {Object.keys(placesByArea).map((continent) => (
            <div className='PBA-continent'>
              <h2 
                className='continent-name'
                id={continent.toLowerCase()}
                onClick={tellTheId}
              >
                {continent}:
              </h2>
              <div 
                className={`
                  continent-container
                  ${activeContinent !== continent.toLowerCase()?'hidden':''}
                `} 
                key={continent}
                id={continent.toLowerCase()}
              >
                {Object.keys(placesByArea[continent]).map((subregion) => (
                  <div className='PBA-subregion'>
                    {subregion=="undefined"?(''):(
                    <h3 
                      className='subregion-name'
                      id={subregion.toLowerCase()}
                      onClick={tellTheId}
                    >
                      {subregion}:
                    </h3>)}
                    <div 
                      key={subregion} 
                      className={`subregion-container`}
                      id={subregion.toLowerCase()}
                    >
                      <div className="countries-container">
                        {placesByArea[continent][subregion].map((placeName: string) => (
                          <PlaceInfo key={placeName} placeName={placeName}/>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </>
  )
}
export default AllPlaces;

// taken out the notes cuz looks tbh messy for me

// todo - in readme give the notes