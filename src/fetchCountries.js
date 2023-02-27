const BASE_URL = 'https://restcountries.com/v3.1/name/';
const CONF = ['name', 'capital', 'population', 'flags', 'languages'];

function fetchCountries(countryName) {
  const QUERY = `?fields=${CONF.join(',')}`;
  return fetch(BASE_URL + countryName + QUERY).then(responce => {
    return responce.json();
  });
}

export { fetchCountries };
