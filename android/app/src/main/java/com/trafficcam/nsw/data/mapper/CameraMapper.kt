package com.trafficcam.nsw.data.mapper

import com.trafficcam.nsw.data.remote.CameraRecord
import com.trafficcam.nsw.domain.model.Camera

object CameraMapper {

    fun mapToDomain(record: CameraRecord): Camera {
        val lat = record.fields.geoPoint2d?.get(0)
            ?: record.geometry.coordinates.getOrNull(1)
            ?: 0.0
        val lon = record.fields.geoPoint2d?.getOrNull(1)
            ?: record.geometry.coordinates.getOrNull(0)
            ?: 0.0

        return Camera(
            id = record.recordid,
            title = record.fields.title,
            latitude = lat,
            longitude = lon,
            description = record.fields.view,
            direction = record.fields.direction ?: "Unknown",
            imageUrl = record.fields.href ?: "",
            region = record.fields.region ?: "SYD_MET"
        )
    }

    fun mapListToDomain(records: List<CameraRecord>): List<Camera> {
        return records.map { mapToDomain(it) }
    }
}
