import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/api'


// Thunk
export const fetchAdmin = createAsyncThunk(
  'users/fetchByIdStatus',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/admin/login`, data, {
        withCredentials: true
      })
      console.log(response)

      return {
        success: response.success,
        role: response.role
      }

    } catch (error) {
      return rejectWithValue(error.response?.data.error)
    }
  }
)


// check auth- check if the user is logged in or not 

const checkingAuth = createAsyncThunk('users/checkingAuth', async ({ rejectWithValue }) => {
  try {
    const response = await api.get('/api/admin/check')
    return response
    console.log(response)
  } catch (error) {
    return error

  }

})

// Slice
const adminAuthSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: null,
    loading: false,
    isAuthenticated: false,
    checkingAuth: false,
    checkAuth: false,
    success: null,
    error: null,
    role: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
      state.success = null
    }
  },

  extraReducers: (builder) => {


    builder
      .addCase(fetchAdmin.pending, (state) => {
        state.admin = false
        state.loading = true
        state.error = null
        state.isAuthenticated = false
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.admin = true
        state.loading = false
        state.success = action.payload.success
        state.isAuthenticated = true
        state.role = action.payload.role
      })
      .addCase(fetchAdmin.rejected, (state, action) => {
        state.admin = false
        state.loading = false
        state.error = action.payload
      })
      // checking if the user is logged in or not 

      .addCase(checkingAuth.pending, (state, action) => {
        state.admin = false,
          state.loading = true,
          state.checkAuth = true

      })
      .addCase(checkingAuth.fulfilled, (state, action) => {
        state.admin = true,
          state.loading = false,
          state.checkAuth = false
        state.success = action.payload

      })
      .addCase(checkingAuth.rejected, (state, action) => {
        state.admin = false,
          state.error = action.payload

      })
  },
})
export const { clearError } = adminAuthSlice.actions

export default adminAuthSlice.reducer
