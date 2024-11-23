import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useLocationStore } from "@/store";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore } from "@/store";
import { MarkerData, Drivers } from "@/types/type";
import { icons } from "@/constants";
import "react-native-get-random-values";
import { useFetch } from "@/lib/fetch";

export default function Map() {
  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  } = useLocationStore();

  console.log(userLatitude, userLongitude);

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  const { selectedDriver, setDrivers } = useDriverStore();

  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const { data: drivers, loading, error } = useFetch<Drivers[]>("/api/driver");

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) {
        return;
      }
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });

      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  useEffect(() => {
    if (markers.length > 0 && destinationLatitude && destinationLongitude) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className="flex justify-between items-center w-full ">
        <ActivityIndicator size="small" color="black" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex justify-between items-center w-full ">
        <Text>Error fetching drivers</Text>
      </View>
    );
  }

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      showsUserLocation
      userInterfaceStyle="light"
      initialRegion={region}
    >
      {markers.map((marker: MarkerData, index: number) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === marker.id ? icons.selectedMarker : icons.marker
          }
        />
      ))}
    </MapView>
  );
}
