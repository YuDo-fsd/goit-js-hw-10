import './css/styles.css';
import fetchCountries from './fetchCountires';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const listItemTemp = ({ name, flags }) => {
  return `
        <li class="country-list__item">
          <img class="country-list__image" src="${flags}" alt="Country flag of ${name}" width="30" height="30" />
          <p class="country-list__offname">${name}</p>
        </li>
      `;
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const inputValue = e.target.value.trim();

  removeChildren(refs.countryList);
  removeChildren(refs.countryInfo);

  if (inputValue === '') {
    return;
  }

  function removeChildren(e) {
    while (e.firstChild) {
      e.removeChild(e.firstChild);
    }
  }

  const data = fetchCountries(inputValue);

  data
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (countries.length === 1) {
        renderCard(countries[0]);
        return;
      }

      renderList(countries);
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderList(countries) {
  refs.countryList.innerHTML = countries
    .map(({ name, flags }) => listItemTemp({ name, flags }))
    .join('');
}

function renderCard(country) {
  const { name, capital, population, flags, languages } = country;
  const cardOfCountry = `
    <p class="country-info__field">
      <img class="country-info__img" src="${flags}" alt="Country flag of ${name}" width="40" height="40"/>
      ${name}
    </p>
    <p class="country-info__field">
      <b>Capital:</b> ${capital.join(', ')}
    </p>
    <p class="country-info__field">
      <b>Population:</b> ${population}
    </p>
    <p class="country-info__field">
      <b>Languages:</b> ${Object.values(languages).join(', ')}
    </p>
  `;
  refs.countryInfo.innerHTML = cardOfCountry;
}
