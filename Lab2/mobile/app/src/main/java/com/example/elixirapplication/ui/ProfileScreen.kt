package com.example.elixirapplication.ui

import android.util.Log
import androidx.compose.runtime.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import com.example.elixirapplication.model.UserProfile
import com.example.elixirapplication.network.RetrofitClient

@Composable
fun ProfileScreen(onLogout: () -> Unit) {
    var profile by remember { mutableStateOf<UserProfile?>(null) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        scope.launch {
            try {
                profile = RetrofitClient.api.getProfile()
            } catch (e: Exception) {
                Log.e("Profile", "Failed to load profile", e)
            }
        }
    }

    Column(modifier = Modifier.padding(16.dp)) {
        profile?.let {
            Text("Username: ${it.userName}", style = MaterialTheme.typography.titleLarge)
            Text("Email: ${it.email}")
            Text("Role: ${it.role}")
            it.firstName?.let { fn -> Text("First Name: $fn") }
            it.lastName?.let { ln -> Text("Last Name: $ln") }
            it.bio?.let { b -> Text("Bio: $b") }

            Spacer(modifier = Modifier.height(16.dp))

            Button(onClick = {
                // TODO: Clear token/session if implemented
                onLogout()
            }) {
                Text("Logout")
            }
        } ?: Text("Loading...")
    }
}
