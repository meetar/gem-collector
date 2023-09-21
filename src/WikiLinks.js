import React from 'react';

const people = []

class WikipediaLinksComponent extends React.Component {

  // function to generate Wikipedia links
  generateWikipediaLinks(names) {
    const wikipediaLinks = [];

    names.forEach((name) => {
      const formattedName = encodeURIComponent(name.replace(/ /g, '_'));
      const wikipediaURL = `https://en.wikipedia.org/wiki/${formattedName}`;
      wikipediaLinks.push(wikipediaURL);
    });

    return wikipediaLinks;
  }

  // function to open Wikipedia pages in new tabs
  openWikipediaTabs() {
    const wikipediaLinks = this.generateWikipediaLinks(people);

    wikipediaLinks.forEach((link) => {
      window.open(link, '_blank'); // open each link in a new tab
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