package com.example.elixirapplication

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.tooling.preview.Preview
import com.example.elixirapplication.ui.*
import com.example.elixirapplication.ui.theme.ElixirApplicationTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ElixirApplicationTheme {
                var loggedIn by remember { mutableStateOf(false) }

                if (!loggedIn) {
                    LoginScreen { loggedIn = true }
                } else {
                    var screen by remember { mutableStateOf(0) }

                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Button(onClick = { screen = 0 }) { Text("Elixirs") }
                            Button(onClick = { screen = 1 }) { Text("Create") }
                            Button(onClick = { screen = 2 }) { Text("Profile") }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        when (screen) {
                            0 -> ElixirListScreen()
                            1 -> CreateElixirScreen()
                            2 -> ProfileScreen { loggedIn = false }
                        }
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    ElixirApplicationTheme {
        Text("Hello Android!")
    }
}
