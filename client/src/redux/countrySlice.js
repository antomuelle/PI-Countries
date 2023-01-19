import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  authenticated: false,
  user: null,
  countries: {
    data: [],
    cols: 5,
    rows: 3,
    current: 1,
    total: 250,
    f_continent: '',
    f_activity: '',
    f_order: '',
  },
  continents: [],
  activities: [],
  languages: [],
  currencies: [],
  errors: [],
  toast: '',
}

export const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    setCountries(state, action) { state.countries = action.payload },
    setCountriesData(state, action) {
      state.countries.data = action.payload[0]
      state.countries.total = action.payload[1]
    },
    setCurrentPage(state, action) { state.countries.current = action.payload },
    setContinents(state, action) { state.continents = action.payload},
    setActivities(state, action) { state.activities = action.payload},
    addActivity(state, action) { state.activities.push(action.payload)},
    setLanguages(state, action) { state.languages = action.payload},
    setCurrencies(state, action) { state.currencies = action.payload},
    setErrors: (state, action) => {
      state.errors = action.payload
    },
    setToast: (state, action) => {
      state.toast = action.payload
    },
    setAuth(state, action) {
      state.authenticated = action.payload.authenticated
      state.user = action.payload.user
    },
  }
})

export const { setCountries, setErrors, setToast, setAuthenticated } = countrySlice.actions
export const Actions = countrySlice.actions

export default countrySlice.reducer