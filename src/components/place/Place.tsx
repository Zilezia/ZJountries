import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Place {
    name: string;
    capital: string;
    population: number;
    region: string;
    subregion: string;

    flag: string;
    img_flag: string;
    alt_flag: string;
}

const PlaceInfo: React.FC<{ placeName: string }> = ({ placeName }) => {
    const [place, setPlace] = useState<Place | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchPlaceData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`https://restcountries.com/v3.1/name/${placeName}`); // tbh i might later make my own api this is not well detailed, or some regions are wrong, and there are no cities registered (except capital)
          const data = response.data[0];
          setPlace({
            name: data.name.common,
            capital: data.capital?.[0] || 'N/A',
            population: data.population || 0,
            region: data.region,
            subregion: data.subregion,

            flag: data.flag,
            img_flag: data.flags.png,
            alt_flag: data.flags.alt,
          });
          setLoading(false);
        } catch (error) {
          console.error('Error fetching place data:', error);
          setLoading(false);
        }
      };
      fetchPlaceData();
    }, [placeName]);
  
    if (!place) {
      return <div className='error-text'>?</div>;
    }

    return (
      <>
        {loading ? ( // loads the place
          <div className='loading-text'>Loading place...</div>
        ):(
          <div id={place.name} className='place-container'>
            <h3 className='place-name'>{place.name} {place.flag}</h3>
            <p className='place-continent'>Continent: {place.region}</p>
            {!place.subregion?(''):(<p className="place-region">Region: {place.subregion}</p>)}
            {place.capital=='N/A'?(''):(<p className='place-capital'>Capital: {place.capital}</p>)}
            {place.population==0?(''):(<p className='place-pop'>Population: {place.population}</p>)}
            <img className='place-flag' src={place.img_flag} alt={place.alt_flag} />
          </div>
        )}
      </>
    )
}

export default PlaceInfo;