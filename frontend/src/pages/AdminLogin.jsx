import React from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux'
import { fetchAdmin } from "../../features/auth/authSlice";
import { useState } from "react";
const AdminLogin = () => {

    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.adminAuth)

    //   handle change for input 
    const handleChange = (e) => {
        console.log(e.target)
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    }
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        dispatch(fetchAdmin(data))
        };

    return (
        <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
            <div className="w-[420px] bg-white shadow-md rounded-sm border border-gray-200">

                {/* Header */}
                <div className="bg-[#3f6f85] px-6 py-4 rounded-t-sm flex items-center justify-between">
                    <h2 className="text-[#f7f7a1] text-xl font-medium">
                        Django administration
                    </h2>
                    <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center text-white text-xs">
                        i
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

                    {/* Username */}
                    <div>
                        <label className="block text-sm mb-1 text-gray-700">
                            Username:
                        </label>
                        <input
                            type="text"
                            {...register("username", { required: "Username is required" })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-[#f9f9f9] focus:outline-none focus:ring-1 focus:ring-[#3f6f85]"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm mb-1 text-gray-700">
                            Password:
                        </label>
                        <input
                            type="password"
                            {...register("password", { required: "Password is required" })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-[#f9f9f9] focus:outline-none focus:ring-1 focus:ring-[#3f6f85]"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="bg-[#3f6f85] hover:bg-[#355e70] text-white px-6 py-2 rounded-sm text-sm font-medium transition"
                        >
                            Log in
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default AdminLogin;
