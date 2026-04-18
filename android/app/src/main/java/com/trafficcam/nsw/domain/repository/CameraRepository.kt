package com.trafficcam.nsw.domain.repository

import com.trafficcam.nsw.domain.model.Camera
import kotlinx.coroutines.flow.Flow

interface CameraRepository {
    fun getCameras(): Flow<Result<List<Camera>>>
    fun getCameraById(id: String): Flow<Result<Camera>>
}
