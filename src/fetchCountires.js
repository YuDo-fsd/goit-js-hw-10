const BASE_URL = 'https://restcountries.com/v3.1/name/';
const options = ['name', 'capital', 'population', 'flags', 'languages'];
const searchParams = new URLSearchParams({
  fields: options.join(','),
});

export default function fetchCountries(name) {
  return fetch(`${BASE_URL}${name}?${searchParams}`)
    .then(response => {
      return response.json();
    })
    .then(response =>
      response.map(item => ({
        name: item['name']['official'],
        capital: item['capital'],
        population: item['population'],
        flags: item['flags']['svg'],
        languages: item['languages'],
      }))
    );
}
