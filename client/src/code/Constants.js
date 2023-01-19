export const BASE_URL = 'http://localhost:3001/'

export const URL = Object.freeze({
  local: {
    check: BASE_URL + 'check',
    login: BASE_URL + 'login',
    logout: BASE_URL + 'logout',
    register: BASE_URL + 'register',
    search: BASE_URL + 'countries',
    activities: BASE_URL + 'activities',
    continents: BASE_URL + 'continents',
    upload: BASE_URL + 'upload'
  }
})