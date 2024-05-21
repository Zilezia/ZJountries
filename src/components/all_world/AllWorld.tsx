import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './AllWorld.css'
import PlaceInfo from '../place/Place';

interface placesByArea {
  [key: string]: {
    [key: string]: string[];
  };
}

function AllWorld() {
  const [placesByArea, setPlacesByArea] = useState<placesByArea>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllPlaces = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://restcountries.com/v3.1/all`);
        const countries = response.data;
        const categorisedCountries = countries.reduce((acc: { [x: string]: any[]; }, country: { region: any; subregion: any; name: { common: any; }; }) => {
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

  return (
    <div className="earth">
      <h2>Earth:</h2>
      <div className='continents'>
        {/* basically checks if its loading */}
        {loading?(
          // if it is loading then yeah vvv
          <div className='loading-text'>Loading...</div>
        ):(// and when it has stopped loading then give out all of the countries
          // starting with by making continent containers
          Object.keys(placesByArea).map((continent) => (
            <div key={continent} id={continent.toLowerCase()} className='continent-container'>
              <h2>{continent}:</h2>
              {/* then inside the continent containers, regions inside the continent are made 
                (e.g.: eastern, northern ... europe in Europe continent) */}
              {Object.keys(placesByArea[continent]).map((subregion) => (
                <div key={subregion} id={subregion.toLowerCase()} className='subregion-container'>
                  {/* and if yeah there is no subregion show nothing */}
                  {subregion=="undefined"?(''):(<h3>{subregion}</h3>)}
                  {/* and finally countries loaded, the way its loaded is:
                          continent > subregion > country, e.g.:
                            Europe  >  Central  > Poland
                                       Europe*/}
                  <div className="countries-container">
                    {placesByArea[continent][subregion].map((placeName: string) => (
                      <PlaceInfo key={placeName} placeName={placeName}/>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
export default AllWorld;