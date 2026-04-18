package com.trafficcam.nsw.data.remote

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class CameraResponse(
    @Json(name = "nhits") val nhits: Int,
    @Json(name = "parameters") val parameters: Parameters,
    @Json(name = "records") val records: List<CameraRecord>
)

@JsonClass(generateAdapter = true)
data class Parameters(
    @Json(name = "dataset") val dataset: List<String>,
    @Json(name = "rows") val rows: Int,
    @Json(name = "start") val start: Int,
    @Json(name = "format") val format: String,
    @Json(name = "timezone") val timezone: String
)

@JsonClass(generateAdapter = true)
data class CameraRecord(
    @Json(name = "datasetid") val datasetid: String,
    @Json(name = "recordid") val recordid: String,
    @Json(name = "fields") val fields: CameraFields,
    @Json(name = "geometry") val geometry: Geometry,
    @Json(name = "record_timestamp") val recordTimestamp: String
)

@JsonClass(generateAdapter = true)
data class CameraFields(
    @Json(name = "title") val title: String,
    @Json(name = "geo_point_2d") val geoPoint2d: List<Double>?,
    @Json(name = "view") val view: String,
    @Json(name = "direction") val direction: String?,
    @Json(name = "href") val href: String?,
    @Json(name = "region") val region: String?,
    @Json(name = "dataset_published_date") val datasetPublishedDate: String?
)

@JsonClass(generateAdapter = true)
data class Geometry(
    @Json(name = "type") val type: String,
    @Json(name = "coordinates") val coordinates: List<Double>
)
