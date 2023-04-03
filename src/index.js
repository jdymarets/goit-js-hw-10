import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputCountry: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputCountry.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(e) {
  const nameCountry = e.target.value.trim();

  if (nameCountry === '') {
    resetMarkup();
    return;
  }

  fetchCountries(nameCountry).then(chooseMarkup).catch(showError);
}

function chooseMarkup(countries) {
  resetMarkup();
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }

  if (countries.length > 1 && countries.length <= 10) {
    refs.countryList.innerHTML = createMarkupList(countries);
  }

  if (countries.length === 1) {
    refs.countryInfo.innerHTML = createMarkupCountryInfo(countries[0]);
  }
}

function resetMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function showError() {
  resetMarkup();
  Notify.failure('Oops, there is no country with that name');
}

function createMarkupList(countries) {
  return countries
    .map(({ name, flags }) => {
      return `
      <li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" alt="Flag of ${name.official}">
        <span>${name.official}</span>
      </li>
      `;
    })
    .join('');
}

function createMarkupCountryInfo({ name, capital, population, flags, languages }) {
  return `
      <p>
        <img class="country-list__img" src="${flags.svg}" alt="Flag of ${name.official}">
        <span class="country-list__name">${name.official}</span>
      </p>
      <p>
        <span class="country-list__label">Capital: </span>
        ${capital}
      </p>
      <p>
        <span class="country-list__label">Population: </span>
        ${population}
      </p>
      <p>
        <span class="country-list__label">Languages: </span>
        ${Object.values(languages).join(', ')}
      </p>
      `;
}