import cheerio from 'cheerio'
import { request } from 'https';
import { mapActions } from 'vuex';
import Axios from 'axios';

export const getText = () => {


    try {

        Axios.get('https://simplescraper.io/api/ne8OkH0t7yf2v0JTWDRu?apikey=sWQjq2TwLcEB8GuMSPmYWWwasEVnhh4V&run_now=true&offset=0&limit=1&source_url=https://www.rightmove.co.uk/properties/97618259#/').then(response => {
            console.log(JSON.stringify(response))
        })
        

    } catch (err) {
      return 'Error: ' + err
    }
  }

  export default { getText }