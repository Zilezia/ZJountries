import { useEffect, useState } from 'react';
import axios from 'axios';

import './styles';
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
            continents: { 0: any; };
            region: any;
            subregion: any; 
            name: { common: any; }; 
        }) => {
          // const continent = country.continents?.[0]; // with continents the countries are a bit messier, by region they are more grouped properly (for eg Turkiye with continent[0] is in Asia, with region its in Europe)
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

  // appear / disappear things (temp.)
  // const [contIsActive, setContIsActive] = useState(false);
  // const continentVis = () => {
  //   setContIsActive(current => !current);
  // };

  // const [subIsActive, setSubIsActive] = useState(false);
  // const subregionVis = () => {
  //   setSubIsActive(current => !current);
  // };


  // test
  // its pretty ok atm, .css needs to be updated doing animations cuz its still pretty ass staticy
  const [activeContinent, setActiveContinent] = useState('');
  const [activeSubregion, setActiveSubregion] = useState('');

  const showThisContinent = (event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
    const target = event.target as HTMLElement;
    if (activeContinent === target.id) {
      setActiveContinent('');
      setActiveSubregion('');
    } else {
      setActiveContinent(target.id);
      setActiveSubregion('');
    }
  };

  const showThisSubregion = (event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
    const target = event.target as HTMLElement;
    if (activeSubregion === target.id) {
      setActiveSubregion('');
    } else {
      setActiveSubregion(target.id);
    }
  };

  return (<>
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
          <div className={`
            ${!activeContinent && 'PBA-continent'} 
            ${activeContinent !== '' && activeContinent !== continent?'hidden':''}
          `}>
            <div className='name-container'>
              {activeContinent && <span className='one-back' onClick={showThisContinent}>&lt; </span>}
              <h2 className='continent-name' id={continent} onClick={showThisContinent}>{continent}:</h2>
            </div>
            <div 
              key={continent} 
              id={continent}
              className={`
                continent-container 
                ${activeContinent === continent?'display-subregions':'hidden'}
              `}
            >
              {Object.keys(placesByArea[continent]).map((subregion) => (
                <div className={`
                  ${(activeContinent && activeContinent !== 'Antarctic') && (activeSubregion !== subregion.replace(/ /g, '_')?'PBA-subregion':'')}
                  ${
                    !activeContinent &&
                    !activeSubregion &&
                    activeSubregion !== subregion.replace(/ /g, '_')
                    ?'hidden':''
                  }
                `}>
                {subregion!=="undefined"?(
                  <div>
                    {activeSubregion === subregion.replace(/ /g, '_')?<span className='one-back' onClick={showThisSubregion}>&lt; </span>:''}
                    <h3 className='subregion-name' id={subregion.replace(/ /g, '_')} onClick={showThisSubregion}>{subregion}:</h3>
                  </div>
                ):''}
                  <div 
                    key={subregion} 
                    id={subregion.replace(/ /g, '_')}
                    className={`subregion-container 
                      ${
                        !activeSubregion &&
                        activeContinent === 'Antartic' &&
                        activeSubregion !== subregion.replace(/ /g, '_')?'hidden':''
                      }
                    `}
                  >
                    <div className={`
                      countries-container
                      ${activeContinent === 'Antarctic' ? ('display-places') : (activeSubregion === subregion.replace(/ /g, '_')?'display-places':'hidden')}
                    `}>
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
  </>)
}
export default AllPlaces;

// taken out the notes cuz looks tbh messy for me

// todo - 
  // in readme give the notes
  // actually im not sure about that ^^^
  // yeah not the readme but the wiki tab (i just discovered that recently lol)