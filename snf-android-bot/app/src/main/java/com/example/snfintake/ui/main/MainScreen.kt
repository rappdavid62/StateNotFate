package com.example.snfintake.ui.main

import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithCache
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation3.runtime.NavKey
import com.example.snfintake.data.local.FloorWinEntity
import com.example.snfintake.theme.*
import java.text.SimpleDateFormat
import java.util.*

enum class AppTab {
    Intake, Polaris, Wins, Safety
}

@Composable
fun MainScreen(
    onItemClick: (NavKey) -> Unit,
    modifier: Modifier = Modifier
) {
    val viewModel: MainViewModel = viewModel()
    var currentTab by remember { mutableStateOf(AppTab.Intake) }
    val haptic = LocalHapticFeedback.current

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = BgSecondary,
                tonalElevation = 8.dp,
                modifier = Modifier.hudBorder(t = 1.dp, brush = Brush.horizontalGradient(listOf(AccentTealDim, AccentLavenderDim)))
            ) {
                NavigationBarItem(
                    selected = currentTab == AppTab.Intake,
                    onClick = {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        currentTab = AppTab.Intake
                    },
                    icon = { Text("💬", fontSize = 20.sp) },
                    label = { Text("Intake Bot", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = AccentTeal,
                        selectedTextColor = AccentTeal,
                        indicatorColor = AccentTealDim.copy(alpha = 0.3f),
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted
                    )
                )
                NavigationBarItem(
                    selected = currentTab == AppTab.Polaris,
                    onClick = {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        currentTab = AppTab.Polaris
                    },
                    icon = { Text("☀️", fontSize = 20.sp) },
                    label = { Text("Polaris", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = AccentOrange,
                        selectedTextColor = AccentOrange,
                        indicatorColor = AccentOrangeDim.copy(alpha = 0.3f),
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted
                    )
                )
                NavigationBarItem(
                    selected = currentTab == AppTab.Wins,
                    onClick = {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        currentTab = AppTab.Wins
                    },
                    icon = { Text("🏆", fontSize = 20.sp) },
                    label = { Text("Floor Wins", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = AccentLavender,
                        selectedTextColor = AccentLavender,
                        indicatorColor = AccentLavenderDim.copy(alpha = 0.3f),
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted
                    )
                )
                NavigationBarItem(
                    selected = currentTab == AppTab.Safety,
                    onClick = {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        currentTab = AppTab.Safety
                    },
                    icon = { Text("⚠️", fontSize = 20.sp) },
                    label = { Text("Safety", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = AccentRed,
                        selectedTextColor = AccentRed,
                        indicatorColor = AccentRed.copy(alpha = 0.2f),
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted
                    )
                )
            }
        },
        containerColor = BgPrimary
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(BgPrimary)
        ) {
            // Cyber HUD top bar
            HUDHeader(viewModel.streakCount, viewModel.totalPoints)

            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
            ) {
                when (currentTab) {
                    AppTab.Intake -> IntakeTab(viewModel, haptic)
                    AppTab.Polaris -> PolarisTab(viewModel, haptic)
                    AppTab.Wins -> WinsTab(viewModel, haptic)
                    AppTab.Safety -> SafetyTab(haptic)
                }
            }
        }
    }
}

@Composable
fun HUDHeader(streak: Int, points: Int) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(BgSecondary)
            .padding(horizontal = 16.dp, vertical = 12.dp)
            .hudBorder(b = 1.dp, color = AccentTealDim.copy(alpha = 0.3f)),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(
                text = "STATE NOT FATE",
                color = AccentTeal,
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp,
                letterSpacing = 2.sp
            )
            Text(
                text = "SECURE PORTABLE SANCTUARY",
                color = TextSecondary,
                fontSize = 8.sp,
                letterSpacing = 1.sp
            )
        }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            // Streak badge
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(4.dp))
                    .background(AccentOrangeDim.copy(alpha = 0.3f))
                    .hudBorder(t = 1.dp, b = 1.dp, color = AccentOrange)
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "STREAK: $streak D",
                    color = AccentOrange,
                    fontWeight = FontWeight.Bold,
                    fontSize = 10.sp
                )
            }

            // Points badge
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(4.dp))
                    .background(AccentLavenderDim.copy(alpha = 0.3f))
                    .hudBorder(t = 1.dp, b = 1.dp, color = AccentLavender)
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "PROOF: $points PTS",
                    color = AccentLavender,
                    fontWeight = FontWeight.Bold,
                    fontSize = 10.sp
                )
            }
        }
    }
}

@OptIn(ExperimentalAnimationApi::class)
@Composable
fun IntakeTab(viewModel: MainViewModel, haptic: androidx.compose.ui.hapticfeedback.HapticFeedback) {
    Column(modifier = Modifier.fillMaxSize().padding(vertical = 8.dp)) {
        Text(
            text = "Evolving Intake Bot",
            color = AccentTeal,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .clip(RoundedCornerShape(8.dp))
                .background(CardBg)
                .hudBorder(t = 1.dp, b = 1.dp, color = AccentTealDim.copy(alpha = 0.2f))
                .padding(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(viewModel.messages) { message ->
                ChatBubble(message)
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Contextual buttons based on onboarding state
        AnimatedContent(
            targetState = viewModel.chatState,
            transitionSpec = {
                fadeIn() with fadeOut()
            }
        ) { state ->
            when (state) {
                is ChatState.Welcome -> {
                    Button(
                        onClick = {
                            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                            viewModel.startIntake()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = AccentTeal, contentColor = BgPrimary),
                        shape = RoundedCornerShape(4.dp),
                        modifier = Modifier.fillMaxWidth().height(48.dp)
                    ) {
                        Text("START FUNCTIONAL MAPPING ➔", fontWeight = FontWeight.Bold)
                    }
                }
                is ChatState.Questioning -> {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = "Score this item based on your daily reality:",
                            color = TextSecondary,
                            fontSize = 11.sp,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth()
                        )
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            val options = listOf("0", "1", "2", "3", "4")
                            options.forEachIndexed { index, option ->
                                OutlinedButton(
                                    onClick = {
                                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                        viewModel.submitAnswer(index)
                                    },
                                    modifier = Modifier.weight(1f).padding(horizontal = 2.dp),
                                    shape = RoundedCornerShape(4.dp),
                                    border = BorderStroke(1.dp, AccentTeal),
                                    colors = ButtonDefaults.outlinedButtonColors(contentColor = AccentTeal)
                                ) {
                                    Text(option, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
                is ChatState.Completed -> {
                    Button(
                        onClick = {
                            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                            viewModel.resetIntake()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = AccentRed, contentColor = Color.White),
                        shape = RoundedCornerShape(4.dp),
                        modifier = Modifier.fillMaxWidth().height(48.dp)
                    ) {
                        Text("RESET INTAKE DATABASE ↺", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun ChatBubble(message: ChatMessage) {
    val alignment = if (message.isUser) Alignment.End else Alignment.Start
    val bg = if (message.isUser) {
        Brush.horizontalGradient(listOf(AccentTealDim, AccentTeal.copy(alpha = 0.3f)))
    } else {
        Brush.horizontalGradient(listOf(BgSecondary, CardBg))
    }
    val borderCol = if (message.isUser) AccentTeal else AccentTealDim.copy(alpha = 0.4f)
    val textCol = if (message.isUser) TextPrimary else TextPrimary

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalAlignment = alignment
    ) {
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(BgSecondary)
                .hudBorder(t = 1.dp, b = 1.dp, color = borderCol)
                .background(brush = bg)
                .padding(12.dp)
                .widthIn(max = 280.dp)
        ) {
            Text(
                text = message.text,
                color = textCol,
                fontSize = 13.sp
            )
        }
    }
}

@Composable
fun PolarisTab(viewModel: MainViewModel, haptic: androidx.compose.ui.hapticfeedback.HapticFeedback) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(vertical = 8.dp)
    ) {
        Text(
            text = "Polaris Circadian Anchors",
            color = AccentOrange,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Text(
            text = "Tighten your timing engine. Complete anchors to gain proof points and extend your streak.",
            color = TextSecondary,
            fontSize = 11.sp,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        Column(
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            AnchorRow(
                title = "Morning Sunlight (10m)",
                desc = "Stop cortisol delay. Synchronize master clock.",
                checked = viewModel.sunlightChecked,
                accentColor = AccentOrange,
                onCheckedChange = {
                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    viewModel.toggleSunlight(it)
                }
            )

            AnchorRow(
                title = "Out of Bed Checkin",
                desc = "Avoid hiding under sheets. Establish wake boundaries.",
                checked = viewModel.outOfBedChecked,
                accentColor = AccentTeal,
                onCheckedChange = {
                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    viewModel.toggleOutOfBed(it)
                }
            )

            AnchorRow(
                title = "Graded Movement",
                desc = "Physical activation. Break the emotional freeze.",
                checked = viewModel.movementChecked,
                accentColor = AccentLavender,
                onCheckedChange = {
                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    viewModel.toggleMovement(it)
                }
            )

            AnchorRow(
                title = "Night Wind-Down",
                desc = "Protect the wind-down window. Shut off screens.",
                checked = viewModel.windDownChecked,
                accentColor = AccentRed,
                onCheckedChange = {
                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    viewModel.toggleWindDown(it)
                }
            )
        }
    }
}

@Composable
fun AnchorRow(
    title: String,
    desc: String,
    checked: Boolean,
    accentColor: Color,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(CardBg)
            .hudBorder(t = 1.dp, b = 1.dp, color = accentColor.copy(alpha = 0.2f))
            .padding(16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(title, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Text(desc, color = TextSecondary, fontSize = 11.sp)
        }

        Checkbox(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = CheckboxDefaults.colors(
                checkedColor = accentColor,
                uncheckedColor = TextMuted,
                checkmarkColor = BgPrimary
            )
        )
    }
}

@Composable
fun WinsTab(viewModel: MainViewModel, haptic: androidx.compose.ui.hapticfeedback.HapticFeedback) {
    var winInput by remember { mutableStateOf("") }
    val winsList by viewModel.wins.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(vertical = 8.dp)) {
        Text(
            text = "Floor Wins Logger",
            color = AccentLavender,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = winInput,
                onValueChange = { winInput = it },
                placeholder = { Text("Log a modest floor win...", color = TextMuted) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary,
                    focusedBorderColor = AccentLavender,
                    unfocusedBorderColor = AccentLavenderDim.copy(alpha = 0.5f),
                    focusedContainerColor = BgSecondary,
                    unfocusedContainerColor = BgSecondary
                ),
                shape = RoundedCornerShape(4.dp),
                modifier = Modifier.weight(1f)
            )

            Spacer(modifier = Modifier.width(8.dp))

            Button(
                onClick = {
                    if (winInput.isNotBlank()) {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        viewModel.logFloorWin(winInput)
                        winInput = ""
                    }
                },
                shape = RoundedCornerShape(4.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AccentLavender, contentColor = BgPrimary),
                modifier = Modifier.height(56.dp)
            ) {
                Text("LOG", fontWeight = FontWeight.Bold)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text("WIN TIMELINE (DATABASE PERSISTED)", color = TextSecondary, fontSize = 11.sp, modifier = Modifier.padding(bottom = 8.dp))

        LazyColumn(
            modifier = Modifier.weight(1f).fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(winsList) { win ->
                WinItem(win)
            }
        }
    }
}

@Composable
fun WinItem(win: FloorWinEntity) {
    val date = remember(win.timestamp) {
        val sdf = SimpleDateFormat("MMM dd, yyyy HH:mm", Locale.getDefault())
        sdf.format(Date(win.timestamp))
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(6.dp))
            .background(CardBg)
            .hudBorder(t = 1.dp, b = 1.dp, color = AccentLavenderDim.copy(alpha = 0.2f))
            .padding(12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(win.description, color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Medium)
            Text(date, color = TextMuted, fontSize = 10.sp)
        }
        Text("✓", color = AccentLavender, fontWeight = FontWeight.Bold, fontSize = 16.sp)
    }
}

@Composable
fun SafetyTab(haptic: androidx.compose.ui.hapticfeedback.HapticFeedback) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(vertical = 8.dp)
    ) {
        Text(
            text = "Safety & Crisis Help",
            color = AccentRed,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Text(
            text = "If you are in immediate danger or unable to maintain basic safety, please use these direct resources.",
            color = TextSecondary,
            fontSize = 11.sp,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        Card(
            colors = CardDefaults.cardColors(containerColor = CardBg),
            border = BorderStroke(1.dp, AccentRed.copy(alpha = 0.3f)),
            shape = RoundedCornerShape(8.dp),
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "CRISIS INTERVENTION",
                    color = AccentRed,
                    fontWeight = FontWeight.Bold,
                    fontSize = 12.sp,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Call or text 988 to connect directly with the Suicide & Crisis Lifeline. Free, confidential, and 24/7.",
                    color = TextPrimary,
                    fontSize = 12.sp
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = AccentRed),
                    shape = RoundedCornerShape(4.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("📞 DIAL 988 LIFELINE", fontWeight = FontWeight.Bold)
                }
            }
        }

        // Recovery anchors guidance
        Card(
            colors = CardDefaults.cardColors(containerColor = CardBg),
            border = BorderStroke(1.dp, AccentTealDim.copy(alpha = 0.3f)),
            shape = RoundedCornerShape(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "THE RECOVERY SANCTUARY PHILOSOPHY",
                    color = AccentTeal,
                    fontWeight = FontWeight.Bold,
                    fontSize = 12.sp,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "- Safety Plan is first. Define reasons to live and safe contacts.\n" +
                            "- Scale daily inputs to actual capacity. If energy is 0, timing is the target.\n" +
                            "- Track wins in Room. Build a secure archive of proof points.\n" +
                            "- Trust repetition. Small actions, repeated, alter the chemical state.",
                    color = TextPrimary,
                    fontSize = 12.sp,
                    lineHeight = 18.sp
                )
            }
        }
    }
}

// Custom border modifier helper to build cyber HUD lines
fun Modifier.hudBorder(
    t: androidx.compose.ui.unit.Dp = 0.dp,
    b: androidx.compose.ui.unit.Dp = 0.dp,
    color: Color = Color.Transparent,
    brush: Brush? = null
): Modifier = this.drawWithCache {
    onDrawWithContent {
        drawContent()
        val borderBrush = brush ?: SolidColor(color)
        if (t > 0.dp) {
            drawLine(
                brush = borderBrush,
                start = androidx.compose.ui.geometry.Offset(0f, 0f),
                end = androidx.compose.ui.geometry.Offset(size.width, 0f),
                strokeWidth = t.toPx()
            )
        }
        if (b > 0.dp) {
            drawLine(
                brush = borderBrush,
                start = androidx.compose.ui.geometry.Offset(0f, size.height),
                end = androidx.compose.ui.geometry.Offset(size.width, size.height),
                strokeWidth = b.toPx()
            )
        }
    }
}
