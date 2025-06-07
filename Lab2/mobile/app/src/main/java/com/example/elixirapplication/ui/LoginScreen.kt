package com.example.elixirapplication.ui

import androidx.compose.runtime.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import android.util.Log

import com.example.elixirapplication.network.RetrofitClient
import com.example.elixirapplication.model.LoginRequest

@Composable
fun LoginScreen(onSuccess: () -> Unit) {
    var nickname by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    Column(modifier = Modifier.padding(16.dp)) {
        TextField(value = nickname, onValueChange = { nickname = it }, label = { Text("Nickname") })
        TextField(value = password, onValueChange = { password = it }, label = { Text("Password") })
        Button(onClick = {
            scope.launch {
                try {
                    val user = RetrofitClient.api.login(LoginRequest(nickname, password))
                    // TODO: Save token/user ID in app state
                    onSuccess()
                } catch (e: Exception) {
                    Log.e("Login", "Failed", e)
                }
            }
        }) {
            Text("Login")
        }
    }
}
