package com.trafficcam.nsw.data.repository

import com.trafficcam.nsw.data.mapper.CameraMapper
import com.trafficcam.nsw.data.remote.CameraApiService
import com.trafficcam.nsw.domain.model.Camera
import com.trafficcam.nsw.domain.repository.CameraRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CameraRepositoryImpl @Inject constructor(
    private val apiService: CameraApiService
) : CameraRepository {

    private var cachedCameras: List<Camera>? = null

    override fun getCameras(): Flow<Result<List<Camera>>> = flow {
        try {
            val response = apiService.getTrafficCameras()
            val cameras = CameraMapper.mapListToDomain(response.records)
            cachedCameras = cameras
            emit(Result.success(cameras))
        } catch (e: Exception) {
            cachedCameras?.let {
                emit(Result.success(it))
            } ?: emit(Result.failure(e))
        }
    }

    override fun getCameraById(id: String): Flow<Result<Camera>> = flow {
        try {
            val camera = cachedCameras?.find { it.id == id }
                ?: apiService.getTrafficCameras().records
                    .let { CameraMapper.mapListToDomain(it) }
                    .find { it.id == id }
                ?: throw NoSuchElementException("Camera not found: $id")
            emit(Result.success(camera))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
}
