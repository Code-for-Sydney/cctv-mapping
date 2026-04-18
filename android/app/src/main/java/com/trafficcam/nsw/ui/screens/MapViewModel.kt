package com.trafficcam.nsw.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trafficcam.nsw.domain.model.Camera
import com.trafficcam.nsw.domain.usecase.GetAllCamerasUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class MapUiState(
    val cameras: List<Camera> = emptyList(),
    val selectedCamera: Camera? = null,
    val isLoading: Boolean = false,
    val error: String? = null,
    val searchQuery: String = ""
)

@HiltViewModel
class MapViewModel @Inject constructor(
    private val getAllCamerasUseCase: GetAllCamerasUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(MapUiState())
    val uiState: StateFlow<MapUiState> = _uiState.asStateFlow()

    init {
        loadCameras()
    }

    fun loadCameras() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            getAllCamerasUseCase().collect { result ->
                result.fold(
                    onSuccess = { cameras ->
                        _uiState.update {
                            it.copy(
                                cameras = cameras,
                                isLoading = false,
                                error = null
                            )
                        }
                    },
                    onFailure = { throwable ->
                        _uiState.update {
                            it.copy(
                                isLoading = false,
                                error = throwable.message ?: "Failed to load cameras"
                            )
                        }
                    }
                )
            }
        }
    }

    fun selectCamera(camera: Camera) {
        _uiState.update { it.copy(selectedCamera = camera) }
    }

    fun clearSelectedCamera() {
        _uiState.update { it.copy(selectedCamera = null) }
    }

    fun updateSearchQuery(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
    }

    fun getFilteredCameras(): List<Camera> {
        val query = _uiState.value.searchQuery
        val cameras = _uiState.value.cameras

        return if (query.isBlank()) {
            cameras
        } else {
            cameras.filter { camera ->
                camera.title.contains(query, ignoreCase = true) ||
                        camera.description.contains(query, ignoreCase = true)
            }
        }
    }
}