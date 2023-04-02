const BASE_URL = 'https://restcountries.com/v2';

function fetchCountries(name) {
  const url = `${BASE_URL}/name/${name}?fields=name,flags,capital,population,languages`;

  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
  });
}

export { fetchCountries };
