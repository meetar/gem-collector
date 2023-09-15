import React from 'react';

const people = [
  'Atahualpa',
  'Dom Pedro II',
 'Shaka Zulu',
 'Menelik II',
 'Osei Kofi Tutu I',
 'Ahmad al-Mansur',
 'Simón Bolívar',
 'Haile Selassie',
 'José de San Martín',
 "Bernardo O'Higgins",
 'Tupac Amaru II',
 'Dom João VI',
 'Yaa Asantewaa',
 'Cetshwayo kaMpande',
 'Tewodros II',
 'Tiradentes',
 'Emperor Pedro I'

]


class WikipediaLinksComponent extends React.Component {
  // Define your list of names here

  // Function to generate Wikipedia links
  generateWikipediaLinks(names) {
    const wikipediaLinks = [];

    names.forEach((name) => {
      const formattedName = encodeURIComponent(name.replace(/ /g, '_'));
      const wikipediaURL = `https://en.wikipedia.org/wiki/${formattedName}`;
      wikipediaLinks.push(wikipediaURL);
    });

    return wikipediaLinks;
  }

  // Function to open Wikipedia pages in new tabs
  openWikipediaTabs() {
    const wikipediaLinks = this.generateWikipediaLinks(people);

    wikipediaLinks.forEach((link) => {
      window.open(link, '_blank'); // Open each link in a new tab
    });
  }

  render() {
    return (
      <div>
        <button onClick={() => this.openWikipediaTabs()}>Open Wikipedia Pages</button>
      </div>
    );
  }
}

export default WikipediaLinksComponent;