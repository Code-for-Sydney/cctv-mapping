package com.trafficcam.nsw.ui.components

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import com.trafficcam.nsw.R
import com.trafficcam.nsw.domain.model.Camera
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker

@Composable
fun MapViewComposable(
    cameras: List<Camera>,
    onCameraClick: (Camera) -> Unit,
    centerLatitude: Double = -33.8688,
    centerLongitude: Double = 151.2093,
    zoomLevel: Double = 11.0,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    LaunchedEffect(Unit) {
        Configuration.getInstance().load(context, context.getSharedPreferences("osmdroid", 0))
    }

    val mapView = remember {
        MapView(context).apply {
            setTileSource(TileSourceFactory.MAPNIK)
            setMultiTouchControls(true)
            controller.setZoom(zoomLevel)
            controller.setCenter(GeoPoint(centerLatitude, centerLongitude))
        }
    }

    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_RESUME -> mapView.onResume()
                Lifecycle.Event.ON_PAUSE -> mapView.onPause()
                else -> {}
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
            mapView.onDetach()
        }
    }

    LaunchedEffect(cameras) {
        mapView.overlays.clear()

        cameras.forEach { camera ->
            val marker = Marker(mapView).apply {
                position = GeoPoint(camera.latitude, camera.longitude)
                title = camera.title
                snippet = camera.description
                setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)

                val drawable = ContextCompat.getDrawable(context, R.drawable.ic_camera_marker)
                icon = drawable

                setOnMarkerClickListener { _, _ ->
                    onCameraClick(camera)
                    true
                }
            }
            mapView.overlays.add(marker)
        }

        mapView.invalidate()
    }

    AndroidView(
        factory = { mapView },
        modifier = modifier.fillMaxSize()
    )
}