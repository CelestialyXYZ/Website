import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import axios from 'axios'

const storeName = 'session'

export const useSessionStore = defineStore(storeName, {
  state: () => {
    return useStorage(storeName, {
      location: {
        lat: 0,
        lon: 0,
        cityName: '',
        countryName: '',
        label: '',
        cca3: ''
      }
    })
  },
  actions: {
    setLocation(
      lat: number,
      lon: number,
      cityName: string,
      countryName: string,
      label: string,
      cca3: string
    ) {
      this.location = {
        lat: lat || 0,
        lon: lon || 0,
        cityName: cityName || '',
        countryName: countryName || '',
        label: label || '',
        cca3: cca3 || ''
      }
    },
    checkLocation() {
      if (this.location.lat === 0 && this.location.lon === 0) {
        axios.get("https://api.ipify.org/?format=json")
          .then(ipResponse => {
            return axios.get(`https://ipapi.co/${ipResponse.data.ip}/json/`);
          })
          .then(response => {
            console.log("🌍 Got location from IP geolocation");
            this.setLocation(
              response.data.latitude,
              response.data.longitude,
              response.data.city,
              response.data.country_name,
              response.data.city,
              response.data.country_code
            );
          })
          .catch(error => {
            console.log(error);
            
            //Setting default location to Paris
            this.setLocation(48.864716, 2.349014, 'Paris', 'France', 'Paris', 'FRA');
          });
      }
    }
  }
})
