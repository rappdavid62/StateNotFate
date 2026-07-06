package com.example.snfintake.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "onboarding_answers")
data class OnboardingAnswerEntity(
    @PrimaryKey val questionId: String,
    val score: Int,
    val timestamp: Long
)
