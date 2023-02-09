import { configureStore } from '@reduxjs/toolkit'
import { adminApi } from './state/api'
import { setupListeners } from '@reduxjs/toolkit/query'
import globalReducer from 'state'

const store = configureStore({
  reducer: {
    global: globalReducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  // Loads the adminApi
  middleware: (getDefault) => 
  getDefault().concat(adminApi.middleware),
})
setupListeners(store.dispatch)


export default store