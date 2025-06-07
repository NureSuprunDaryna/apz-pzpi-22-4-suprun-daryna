package com.example.elixirapplication.model

data class UserProfile(
    val id: String,
    val userName: String,
    val email: String,
    val role: String,
    val firstName: String?,
    val lastName: String?,
    val bio: String?
)
