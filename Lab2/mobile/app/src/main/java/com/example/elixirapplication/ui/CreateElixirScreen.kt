package com.example.elixirapplication.ui

import androidx.compose.runtime.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import android.util.Log

import com.example.elixirapplication.model.CreateElixirRequest
import com.example.elixirapplication.network.RetrofitClient

@Composable
fun CreateElixirScreen() {
    var name by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    Column(modifier = Modifier.padding(16.dp)) {
        TextField(value = name, onValueChange = { name = it }, label = { Text("Name") })
        TextField(value = description, onValueChange = { description = it }, label = { Text("Description") })
        Button(onClick = {
            scope.launch {
                try {
                    val elixir = CreateElixirRequest(name, description)
                    RetrofitClient.api.createElixir(elixir)
                    name = ""
                    description = ""
                } catch (e: Exception) {
                    Log.e("Create", "Error", e)
                }
            }
        }) {
            Text("Create")
        }
    }
}
