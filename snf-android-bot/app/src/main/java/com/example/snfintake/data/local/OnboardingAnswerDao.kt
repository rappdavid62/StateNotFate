package com.example.snfintake.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface OnboardingAnswerDao {
    @Query("SELECT * FROM onboarding_answers")
    fun getAllAnswers(): Flow<List<OnboardingAnswerEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAnswer(answer: OnboardingAnswerEntity)

    @Query("DELETE FROM onboarding_answers")
    suspend fun clearAllAnswers()
}
