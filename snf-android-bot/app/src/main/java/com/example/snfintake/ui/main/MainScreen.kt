package com.example.snfintake.ui.main

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation3.runtime.NavKey
import com.example.snfintake.theme.SNFIntakeTheme

data class ChatMessage(val text: String, val isUser: Boolean)

@Composable
fun MainScreen(
  onItemClick: (NavKey) -> Unit,
  modifier: Modifier = Modifier
) {
    val haptic = LocalHapticFeedback.current
    var messages by remember { mutableStateOf(listOf(ChatMessage("Welcome to your sanctuary. What's a win you've had today?", false))) }
    var inputText by remember { mutableStateOf(TextFieldValue("")) }

    Column(modifier = modifier.fillMaxSize().padding(16.dp)) {
        Text(
            text = "SNF Intake Bot",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        LazyColumn(modifier = Modifier.weight(1f)) {
            items(messages) { message ->
                MessageBubble(message)
            }
        }
        
        Row(
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = inputText,
                onValueChange = { inputText = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Log a floor win...") }
            )
            Spacer(modifier = Modifier.width(8.dp))
            Button(onClick = {
                if (inputText.text.isNotBlank()) {
                    // Trigger Haptic Feedback
                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    
                    messages = messages + ChatMessage(inputText.text, true)
                    inputText = TextFieldValue("")
                    
                    // Mock Bot Reply
                    messages = messages + ChatMessage("Incredible! That's a huge proof point.", false)
                }
            }) {
                Text("Send")
            }
        }
    }
}

@Composable
fun MessageBubble(message: ChatMessage) {
    val backgroundColor = if (message.isUser) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.secondaryContainer
    val alignment = if (message.isUser) Alignment.CenterEnd else Alignment.CenterStart

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        contentAlignment = alignment
    ) {
        Text(
            text = message.text,
            modifier = Modifier
                .background(backgroundColor, shape = RoundedCornerShape(8.dp))
                .padding(12.dp)
        )
    }
}

@Preview(showBackground = true)
@Composable
fun MainScreenPreview() {
  SNFIntakeTheme { MainScreen(onItemClick = {}) }
}
