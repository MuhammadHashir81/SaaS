import { configureStore } from '@reduxjs/toolkit'
import adminAuthSlice from '../features/auth/authSlice.js'
const store = configureStore({
  reducer: {
    auth:adminAuthSlice
  },
})

export default store