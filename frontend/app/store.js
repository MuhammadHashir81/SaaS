import { configureStore } from '@reduxjs/toolkit'
import adminAuthSlice from '../features/auth/authSlice.js'
const store = configureStore({
  reducer: {
    adminAuth:adminAuthSlice
  },
})

export default store