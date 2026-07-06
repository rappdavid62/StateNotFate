package com.example.snfintake.ui.main

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.snfintake.data.DefaultDataRepository
import com.example.snfintake.data.local.FloorWinEntity
import com.example.snfintake.data.local.OnboardingAnswerEntity
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class ChatMessage(val text: String, val isUser: Boolean)

data class OnboardingQuestion(
    val id: String,
    val text: String,
    val category: String,
    val options: List<String> = listOf("Not at all", "Rare / mild", "Sometimes / moderate", "Often / significant", "Almost always / severe")
)

sealed interface ChatState {
    object Welcome : ChatState
    data class Questioning(val questionIndex: Int) : ChatState
    data class Completed(val summary: String) : ChatState
}

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = DefaultDataRepository(application)

    // Flow of wins from Room Database
    val wins: StateFlow<List<FloorWinEntity>> = repository.wins.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    // Onboarding Answers
    val answersFlow: StateFlow<List<OnboardingAnswerEntity>> = repository.answers.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    // Onboarding Questions definitions
    val questions = listOf(
        OnboardingQuestion("q1", "My day feels harder to start than it should.", "Present State & Functional Damage"),
        OnboardingQuestion("q2", "I feel sad, flat, empty, or emotionally blunted.", "Mood, Anhedonia & Despair"),
        OnboardingQuestion("q3", "I mistake depressed thoughts for objective truth.", "Cognition, Self-Attack & Rumination"),
        OnboardingQuestion("q4", "My sleep schedule is drifting later or becoming irregular.", "Sleep & Circadian Disruption"),
        OnboardingQuestion("q5", "I have trouble telling the difference between exhaustion and avoidance.", "Avoidance & Routine Failure"),
        OnboardingQuestion("q6", "My room, home, or daily environment makes functioning harder.", "Environment & Admin Friction"),
        OnboardingQuestion("q7", "I withdraw from people when I am low.", "Social Shrinkage & Relationships"),
        OnboardingQuestion("q8", "I need a plan that fits real life better, not a theoretically perfect one.", "Treatment Fit & Medical Complexity"),
        OnboardingQuestion("q9", "It is hard to believe effort will lead to improvement.", "Hope Signal & Agency"),
        OnboardingQuestion("q10", "I struggle to keep testing small repeated changes when immediate payoff is low.", "Plan Fit & Continuity")
    )

    // Chat Conversation messages
    var messages by mutableStateOf<List<ChatMessage>>(
        listOf(
            ChatMessage("Welcome to State Not Fate. I am your recovery companion bot.", false),
            ChatMessage("To personalize your sanctuary, let's complete a short 10-question functional mapping.", false)
        )
    )
        private set

    // Chat bot current state
    var chatState by mutableStateOf<ChatState>(ChatState.Welcome)
        private set

    // Polaris Daily Checklist items state (persisted locally via SharedPreferences)
    private val prefs = application.getSharedPreferences("polaris_prefs", Application.MODE_PRIVATE)

    var sunlightChecked by mutableStateOf(prefs.getBoolean("sunlight", false))
        private set
    var outOfBedChecked by mutableStateOf(prefs.getBoolean("outOfBed", false))
        private set
    var movementChecked by mutableStateOf(prefs.getBoolean("movement", false))
        private set
    var windDownChecked by mutableStateOf(prefs.getBoolean("windDown", false))
        private set

    // Proof Points & Streaks
    var totalPoints by mutableStateOf(prefs.getInt("total_points", 0))
        private set
    var streakCount by mutableStateOf(prefs.getInt("streak_count", 0))
        private set

    fun startIntake() {
        chatState = ChatState.Questioning(0)
        askCurrentQuestion()
    }

    private fun askCurrentQuestion() {
        val state = chatState as? ChatState.Questioning ?: return
        val question = questions[state.questionIndex]
        addBotMessage("(${question.category}) ${question.text}")
    }

    fun submitAnswer(score: Int) {
        val state = chatState as? ChatState.Questioning ?: return
        val currentQuestion = questions[state.questionIndex]

        // Add user response to chat messages
        addUserMessage(currentQuestion.options[score])

        // Save answer to Room
        viewModelScope.launch {
            repository.insertAnswer(
                OnboardingAnswerEntity(
                    questionId = currentQuestion.id,
                    score = score,
                    timestamp = System.currentTimeMillis()
                )
            )
        }

        // Proceed to next question or complete
        if (state.questionIndex < questions.size - 1) {
            chatState = ChatState.Questioning(state.questionIndex + 1)
            askCurrentQuestion()
        } else {
            completeOnboarding()
        }
    }

    private fun completeOnboarding() {
        viewModelScope.launch {
            // Analyze scores
            val answers = answersFlow.value
            var highestScore = -1
            var primaryConstraint = "General"
            
            // Map highest loaded category
            answers.forEach { ans ->
                val q = questions.find { it.id == ans.questionId }
                if (q != null && ans.score > highestScore) {
                    highestScore = ans.score
                    primaryConstraint = q.category
                }
            }

            val recommendation = when (primaryConstraint) {
                "Sleep & Circadian Disruption" -> "circadian stability via the Polaris checklist. Focus on getting 10 minutes of morning sunlight."
                "Avoidance & Routine Failure" -> "reducing activation energy. Keep task blocks under 15 minutes."
                "Hope Signal & Agency" -> "hope repair. Focus on recording one modest floor win every single day to rebuild trust."
                else -> "establishing core daily anchors. Start with the morning sunlight and out-of-bed checkins."
            }

            val summaryText = "Functional Mapping Complete.\n\n" +
                    "Your dominant constraint load appears to be: **$primaryConstraint**.\n\n" +
                    "Recommended Strategy: We suggest starting with $recommendation"

            chatState = ChatState.Completed(summaryText)
            addBotMessage(summaryText)
            addBotMessage("You are now fully set up in the sanctuary database. Explore the Polaris tab to start tracking anchors, and log your daily floor wins to stack proof points!")
        }
    }

    fun logFloorWin(text: String) {
        if (text.isBlank()) return
        addUserMessage(text)
        
        viewModelScope.launch {
            repository.insertWin(
                FloorWinEntity(
                    description = text,
                    timestamp = System.currentTimeMillis()
                )
            )
            addBotMessage("Floor win logged to secure local database: \"$text\". +10 Proof Points!")
            awardPoints(10)
        }
    }

    // Polaris triggers
    fun toggleSunlight(checked: Boolean) {
        sunlightChecked = checked
        prefs.edit().putBoolean("sunlight", checked).apply()
        if (checked) {
            awardPoints(5)
            checkStreakTrigger()
        }
    }

    fun toggleOutOfBed(checked: Boolean) {
        outOfBedChecked = checked
        prefs.edit().putBoolean("outOfBed", checked).apply()
        if (checked) {
            awardPoints(5)
            checkStreakTrigger()
        }
    }

    fun toggleMovement(checked: Boolean) {
        movementChecked = checked
        prefs.edit().putBoolean("movement", checked).apply()
        if (checked) {
            awardPoints(5)
            checkStreakTrigger()
        }
    }

    fun toggleWindDown(checked: Boolean) {
        windDownChecked = checked
        prefs.edit().putBoolean("windDown", checked).apply()
        if (checked) {
            awardPoints(5)
            checkStreakTrigger()
        }
    }

    private fun checkStreakTrigger() {
        if (sunlightChecked && outOfBedChecked && movementChecked && windDownChecked) {
            // Complete daily anchors bonus
            awardPoints(15)
            streakCount++
            prefs.edit().putInt("streak_count", streakCount).apply()
            addBotMessage("Incredible! You completed all 4 circadian anchors today! Daily Streak bonus +15 Proof Points! Current Streak: $streakCount days.")
        }
    }

    private fun awardPoints(points: Int) {
        totalPoints += points
        prefs.edit().putInt("total_points", totalPoints).apply()
    }

    fun resetIntake() {
        viewModelScope.launch {
            repository.clearAnswers()
            chatState = ChatState.Welcome
            messages = listOf(
                ChatMessage("Intake data has been securely cleared.", false),
                ChatMessage("Let's restart the functional mapping when you are ready.", false)
            )
        }
    }

    private fun addBotMessage(text: String) {
        messages = messages + ChatMessage(text, false)
    }

    private fun addUserMessage(text: String) {
        messages = messages + ChatMessage(text, true)
    }
}
