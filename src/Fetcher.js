export default function fetcher(url) {
  return fetch(url)
  .then(response => response.text())
  .then(data => {
    return(data);
  })
  .catch(error => console.error('Error fetching:', error));
};
