import './css/styles.css';
import './css/country-styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { fetchCountries } from './fetchCountries.js';

const URL = 'https://restcountries.com/v3.1/name/';
const OPT = ['name', 'capital', 'population', 'flags', 'languages'];

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('input#search-box');
const countriesListContainer = document.querySelector('.country-list');
const countryInfoContainer = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const countryName = e.target.value.trim();
  const inputLength = countryName.length;

  countriesListContainer.innerHTML = '';
  countryInfoContainer.innerHTML = '';

  if (inputLength) fetchCountries(countryName);
}

function fetchCountries(name) {
  // console.log(URL + name + `?fields=${OPT.join(',')}`);
  fetch(URL + name + `?fields=${OPT.join(',')}`)
    .then(responce => {
      return responce.json();
    })
    .then(countriesData => {
      console.log('countriesData.length:', countriesData.length);
      if (countriesData.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.',
          {
            timeout: 2000,
          }
        );
      } else if (countriesData.length === 1) {
        drawCountryInfo(countriesData);
      } else {
        drawCountryList(countriesData);
      }
    })
    .catch(() => {
      Notify.failure('Oops, there is no country with that name', {
        timeout: 2000,
      });
    });
}

function drawCountryList(countriesData) {
  const countriesItems = countriesData
    .map(
      countryData =>
        `
        <li class="country-list__item">
            <img  class="country-list__img" width="30px" 
                src="${countryData.flags.svg}"
                alt="${countryData.name.official} flag">
            <span class="country-list__name">${countryData.name.official}</span>
        </li>
        `
    )
    .join('');
  countriesListContainer.innerHTML = countriesItems;
}

function drawCountryInfo([countryData]) {
  // const { [countryData.flags.svg: countryFlag ]} = countryData;
  const countryItem = `
    <img  class="country-info__img" width="30px"
                  src="${countryData.flags.svg}"
                  alt="${countryData.name.official} flag">
    <span class="country-info__name">${countryData.name.official}</span>
    <p class="country-info__capital">${countryData.capital}</p>
    <p class="country-info__population">${countryData.population}</p>
    <p class="country-info__languages">${Object.values(
      countryData.languages
    ).join(', ')}</p>
  `;
  countryInfoContainer.innerHTML = countryItem;
}
