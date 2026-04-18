package com.trafficcam.nsw.data.remote

import retrofit2.http.GET
import retrofit2.http.Query

interface CameraApiService {

    @GET("api/records/1.0/search/")
    suspend fun getTrafficCameras(
        @Query("dataset") dataset: String = "live-traffic-cameras-sydney-metro",
        @Query("rows") rows: Int = 100,
        @Query("refine") region: String? = null
    ): CameraResponse

    companion object {
        const val BASE_URL = "https://nsw-bayside.opendatasoft.com/"
    }
}
