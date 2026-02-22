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
      console.log(response)
      
      return {
        success:response.success,
        role:response.role
      }

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
    isAuthenticated:false,
    checkingAdminAuth: false,
    success: null,
    error: null,
    role:null
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
        state.isAuthenticated = false
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.admin = true
        state.loading = false
        state.checkingAdminAuth = false
        state.success = action.payload.success
        state.isAuthenticated = true
        state.role = action.payload.role
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
