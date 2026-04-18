package com.trafficcam.nsw.di

import com.trafficcam.nsw.data.repository.CameraRepositoryImpl
import com.trafficcam.nsw.domain.repository.CameraRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindCameraRepository(
        impl: CameraRepositoryImpl
    ): CameraRepository
}
