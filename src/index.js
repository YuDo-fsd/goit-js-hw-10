import './css/styles.css';
import { fetchCountries } from '../src/fetchCountires';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfoContainer = document.querySelector('.country-info-container');

const renderCountryList = countries => {
  countryList.innerHTML = '';

  countries.forEach(country => {
    const { name, flags } = country;
    const flagImg = document.createElement('img');
    flagImg.src = flags.svg;
    flagImg.alt = `${name.official} flag`;
    const countryName = document.createElement('span');
    countryName.textContent = name.official;
    const listItem = document.createElement('li');
    listItem.append(flagImg, countryName);
    countryList.append(listItem);

    listItem.addEventListener('click', () => {
      renderCountryInfo(country);
    });
  });
};

const renderCountryInfo = country => {
  const {
    name: { official },
    capital,
    population,
    flags,
    languages,
  } = country;

  const languagesArr = Object.values(languages)
    .map(language => language.name)
    .join(', ');

  const countryInfo = `
      <div class="country-info">
        <img src="${flags.svg}" alt="${official} flag" />
        <h2>${official}</h2>
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Population:</strong> ${population}</p>
        <p><strong>Languages:</strong> ${languagesArr}</p>
      </div>
    `;

  countryInfoContainer.innerHTML = countryInfo;
};

const searchCountries = event => {
  const searchQuery = event.target.value.trim();

  if (!searchQuery) {
    countryList.innerHTML = '';
    countryInfoContainer.innerHTML = '';
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length > 1 && countries.length <= 10) {
        renderCountryList(countries);
        countryInfoContainer.innerHTML = '';
      } else if (countries.length === 1) {
        renderCountryInfo(countries[0]);
        countryList.innerHTML = '';
      } else {
        Notiflix.Notify.failure(
          'Oops! No country found. Please enter a valid name.'
        );
        countryList.innerHTML = '';
        countryInfoContainer.innerHTML = '';
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong. Please try again later.'
      );
      console.error(error);
    });
};

searchBox.addEventListener('input', debounce(searchCountries, DEBOUNCE_DELAY));
