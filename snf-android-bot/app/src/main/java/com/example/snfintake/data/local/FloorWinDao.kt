package com.example.snfintake.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface FloorWinDao {
    @Query("SELECT * FROM floor_wins ORDER BY timestamp DESC")
    fun getAllWins(): Flow<List<FloorWinEntity>>

    @Insert
    suspend fun insertWin(win: FloorWinEntity)
}
