package com.example.elixirapplication.network

import com.example.elixirapplication.model.*
import retrofit2.http.*

interface ApiService {
    @POST("account/login")
    suspend fun login(@Body request: LoginRequest): UserResponse

    @GET("elixirs")
    suspend fun getElixirs(): List<Elixir>

    @POST("elixir/create")
    suspend fun createElixir(@Body request: CreateElixirRequest): Elixir

    @GET("account/me")
    suspend fun getProfile(): UserProfile
}
