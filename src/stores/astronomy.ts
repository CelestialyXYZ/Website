import { defineStore } from 'pinia'

import * as moon from '../stores/lib/moon'
import * as utils from '../stores/lib/utils'

export const useAstronomyStore = defineStore('astronomy', () => {
  
  

  return {
    moon,
    utils
  }
})
