package com.example.elixirapplication.ui

import androidx.compose.runtime.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import kotlinx.coroutines.launch
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.material3.Divider

import com.example.elixirapplication.model.Elixir
import com.example.elixirapplication.network.RetrofitClient

@Composable
fun ElixirListScreen() {
    var elixirs by remember { mutableStateOf<List<Elixir>>(emptyList()) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(true) {
        scope.launch {
            elixirs = RetrofitClient.api.getElixirs()
        }
    }

    LazyColumn {
        items(elixirs) { elixir ->
            Text(text = elixir.name, fontWeight = FontWeight.Bold)
            Text(text = elixir.description)
            Divider()
        }
    }
}
