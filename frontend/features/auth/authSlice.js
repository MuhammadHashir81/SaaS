import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/api'


// Thunk
export const fetchAdmin = createAsyncThunk(
  'users/fetchByIdStatus',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/admin/login`, data,{
        withCredentials:true
      })
      console.log(response.success)
      
      return response.success
    } catch (error) {
      return rejectWithValue(error.response?.data.error )
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
  reducers:{
      clearError:(state)=>{
        state.error = null
        state.success = null
      }
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
export const { clearError } = adminAuthSlice.actions

export default adminAuthSlice.reducer
