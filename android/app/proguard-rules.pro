# Add project specific ProGuard rules here.
-keepattributes *Annotation*
-keepclassmembers class * {
    @com.squareup.moshi.* <methods>;
}
-keep class com.trafficcam.nsw.data.remote.** { *; }
-keep class com.trafficcam.nsw.domain.model.** { *; }
