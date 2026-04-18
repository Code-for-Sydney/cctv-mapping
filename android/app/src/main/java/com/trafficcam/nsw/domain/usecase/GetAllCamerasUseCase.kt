package com.trafficcam.nsw.domain.usecase

import com.trafficcam.nsw.domain.model.Camera
import com.trafficcam.nsw.domain.repository.CameraRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class GetAllCamerasUseCase @Inject constructor(
    private val repository: CameraRepository
) {
    operator fun invoke(): Flow<Result<List<Camera>>> {
        return repository.getCameras()
    }
}
