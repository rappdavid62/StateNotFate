package com.example.snfintake.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "floor_wins")
data class FloorWinEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val description: String,
    val timestamp: Long
)
