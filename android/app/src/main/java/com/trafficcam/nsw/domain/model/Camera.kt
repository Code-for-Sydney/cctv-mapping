package com.trafficcam.nsw.domain.model

data class Camera(
    val id: String,
    val title: String,
    val latitude: Double,
    val longitude: Double,
    val description: String,
    val direction: String,
    val imageUrl: String,
    val region: String
)
