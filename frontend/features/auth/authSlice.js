import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

// Thunk
export const fetchAdmin = createAsyncThunk(
  'users/fetchByIdStatus',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/api/admin/login`, data)
      console.log(response)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Slice
const adminAuthSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: null,
    loading: false,
    checkingAdminAuth: false,
    success: null,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmin.pending, (state) => {
        state.admin = false
        state.loading = true
        state.checkingAdminAuth = true
        state.error = null
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.admin = true
        state.loading = false
        state.checkingAdminAuth = false
        state.success = action.payload
      })
      .addCase(fetchAdmin.rejected, (state, action) => {
        state.admin = false
        state.loading = false
        state.checkingAdminAuth = false
        state.error = action.payload
      })
  },
})

export default adminAuthSlice.reducer
