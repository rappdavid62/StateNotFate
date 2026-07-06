package com.example.snfintake.data

import android.content.Context
import com.example.snfintake.data.local.AppDatabase
import com.example.snfintake.data.local.FloorWinEntity
import com.example.snfintake.data.local.OnboardingAnswerEntity
import kotlinx.coroutines.flow.Flow

interface DataRepository {
    val wins: Flow<List<FloorWinEntity>>
    suspend fun insertWin(win: FloorWinEntity)
    
    val answers: Flow<List<OnboardingAnswerEntity>>
    suspend fun insertAnswer(answer: OnboardingAnswerEntity)
    suspend fun clearAnswers()
}

class DefaultDataRepository(context: Context) : DataRepository {
    private val db = AppDatabase.getDatabase(context)
    private val winDao = db.floorWinDao()
    private val answerDao = db.onboardingAnswerDao()

    override val wins: Flow<List<FloorWinEntity>> = winDao.getAllWins()

    override suspend fun insertWin(win: FloorWinEntity) {
        winDao.insertWin(win)
    }

    override val answers: Flow<List<OnboardingAnswerEntity>> = answerDao.getAllAnswers()

    override suspend fun insertAnswer(answer: OnboardingAnswerEntity) {
        answerDao.insertAnswer(answer)
    }

    override suspend fun clearAnswers() {
        answerDao.clearAllAnswers()
    }
}
