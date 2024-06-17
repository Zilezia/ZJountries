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
          const continent = country.continents?.[0]; // with continents the countries are a bit messier, by region they are more grouped properly (for eg Turkiye with continent[0] is in Asia, with region its in Europe)
          // const continent = country.region;
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

  const [activeContinent, setActiveContinent] = useState('');
  const [activeSubregion, setActiveSubregion] = useState('');

  // const showThisContinent = (event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
  //   const target = event.currentTarget;
  //   const continentId = target.id;
  // setActiveContinent(activeContinent === continentId ? '' : continentId);
  //   setActiveSubregion('');
  // };

  const showThisContinent = (continent: string) => {
    setActiveContinent(activeContinent === continent ? '' : continent);
  }

  const showThisSubregion = (event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
    const target = event.target as HTMLElement;
    const subID = target.id;
    setActiveSubregion(activeSubregion === subID ? '' : subID)
  };

  return (<>
    <div className="earth">
      <div className="btn-container">
        {/* <p>temp. buttons vvv</p> as it reads */}
        {/* <button onClick={continentVis}>Continent</button> */}
        {/* <button onClick={subregionVis}>Subregion</button> */}
      </div>
      {/* <h2 className='earth-text' onClick={continentVis}>Earth:</h2> */}
      {loading?(
        // if it is loading then yeah vvv
        <div className='loading-text'>Loading...</div>
      ):(
        // loads continents (proper continents not like the americas (7 continents are nicer than 6))
        <div className='continents'>
        {Object.keys(placesByArea).map((continent) => (
          <div className={`${!activeContinent && 'PBA-continent'}`}>
            <div className='name-container'>
              {
                activeContinent === continent
                ? <span className='one-back' onClick={() => showThisContinent(continent)}>&lt; </span> : ''
              }
              <h2 key={continent} className='continent-name' id={continent} onClick={() => showThisContinent(continent)}>
                {activeContinent === continent ? `${continent}:` : '.'}
              </h2>
              {/* {activeContinent === continent ? `${continent}:` : 'S'} */}
            </div>
            <div key={continent} id={continent}
              className={`
                continent-container 
                ${activeContinent === continent?'display-subregions':'hidden'}
            `}>
              {/* where sub continents/regions are */}
              {Object.keys(placesByArea[continent]).map((subregion) => (
                <div className={`
                  ${(activeContinent && activeContinent !== 'Antarctica' && activeContinent !== 'South America') && (activeSubregion !== subregion.replace(/ /g, '_')?'PBA-subregion':'')}
                  ${
                    !activeContinent &&
                    !activeSubregion &&
                    activeSubregion !== subregion.replace(/ /g, '_')
                    ?'hidden':''
                }`}>
                {(subregion!=="undefined" && subregion!=="South America")?( // like that cause Antarctica (undefined) and South A. dont have sub areas so auto show all countries of them (icba saying to show countries if theres less than 2))
                  <div className='name-container'>
                    {
                      activeSubregion === subregion.replace(/ /g, '_')
                      ? <span className='one-back' onClick={showThisSubregion}>&lt; </span> : ''
                    }
                    <h3 className='subregion-name' id={subregion.replace(/ /g, '_')} onClick={showThisSubregion}>{subregion}:</h3>
                  </div>
                ):''}
                  <div 
                    key={subregion} 
                    id={subregion.replace(/ /g, '_') ? continent : subregion.replace(/ /g, '_')}
                    className={`subregion-container 
                      ${
                        !activeSubregion &&
                        activeContinent !== 'Antarctica' && activeContinent !== 'South America' &&
                        activeSubregion !== subregion.replace(/ /g, '_')
                        ?'hidden':''
                    }`}>
                    <div className={`
                      countries-container
                      ${
                        activeContinent === 'Antarctica' || activeContinent === 'South America'
                        ? ('display-places') : (activeSubregion === subregion.replace(/ /g, '_')?'display-places':'hidden')
                    }`}>
                      {/* country */}
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