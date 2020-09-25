
import { request } from 'https';
import { mapActions } from 'vuex';
import Axios from 'axios';
import cheerio from 'cheerio';
import getUrls from'get-urls';
import fetch from 'node-fetch';

export const tryScrape = (url) => {
  
  (async () => {
    const body = {a: 1};
  
    const response = await fetch('https://www.reddit.com/r/Python/comments/2xvnic/what_are_some_easy_websites_to_scrape_from/', {
      method: 'get',
      headers: {'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*"}
    });
    const json = await response.data;
  
    console.log(json);
  })();



}

export const getText = (url) => {

/* let api_url = 'https://simplescraper.io/api/ne8OkH0t7yf2v0JTWDRu?apikey=sWQjq2TwLcEB8GuMSPmYWWwasEVnhh4V&offset=0&limit=1&run_now=true&source_url='.concat(encodeURIComponent(url))
    try {
      console.log('Scrapping data')
      console.log('scraping: ' + api_url)
      Axios.get(api_url).then(response => console.log(JSON.stringify(response)))

        return Axios.get(api_url).then(response => response.data.data[0])
        

    } catch (err) {
      return 'Error: ' + err
    } */

  let api_url = 'http://127.0.0.1:5000/scrape?url='.concat(encodeURIComponent(url))
    try {
      console.log('Scrapping data')
      console.log('scraping: ' + api_url)
      Axios.get(api_url).then(response => console.log(JSON.stringify(response)))

        return Axios.get(api_url).then(response => response.data)
        

    } catch (err) {
      return 'Error: ' + err
    } 
  }

  export default { getText, tryScrape }