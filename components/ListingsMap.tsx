import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { memo, useEffect, useRef } from "react";
import { defaultStyles } from "@/constants/Styles";
import { Marker } from "react-native-maps";
import MapView from "react-native-map-clustering";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import * as Location from "expo-location";

interface Listing {
  id: string | number;
  latitude: number | null;
  longitude: number | null;
  price: number;
  // Other properties you may have
  car_type?: string;
  medium_url?: string;
  name?: string;
}

interface Props {
  listings: {
    features: Listing[];
  };
}

const INITIAL_REGION = {
  latitude: 37.33,
  longitude: -122,
  latitudeDelta: 9,
  longitudeDelta: 9,
};

const ListingsMap = memo(({ listings }: Props) => {
  const router = useRouter();
  const mapRef = useRef<any>(null);

  useEffect(() => {
    onLocateMe();
  }, []);

  const onMarkerSelected = (item: Listing) => {
    router.push(`/listing/${item.id}`);
  };

  const onLocateMe = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Location permission not granted");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 7,
      longitudeDelta: 7,
    };

    mapRef.current?.animateToRegion(region);
  };

  const renderCluster = (cluster: any) => {
    const { id, geometry, onPress, properties } = cluster;

    return (
      <Marker
        key={`cluster-${id}`}
        coordinate={{
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        }}
        onPress={onPress}
      >
        <View style={styles.marker}>
          <Text
            style={{
              color: "#000",
              textAlign: "center",
              fontFamily: "aeonik",
            }}
          >
            {properties.point_count}
          </Text>
        </View>
      </Marker>
    );
  };

  // Check if listings and features are present
  if (!listings || !listings.features || !Array.isArray(listings.features)) {
    console.warn("Listings or features array is missing or not an array");
    return null;
  }

  return (
    <View style={defaultStyles.container}>
      <MapView
        ref={mapRef}
        animationEnabled={false}
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        clusterColor="#fff"
        clusterTextColor="#000"
        clusterFontFamily="aeonik"
        renderCluster={renderCluster}
      >
        {listings.features.map((item: Listing, index: number) => {
          // Validate each listing's properties
          if (
            typeof item.latitude !== "number" ||
            typeof item.longitude !== "number" ||
            (typeof item.id !== "string" && typeof item.id !== "number") ||
            typeof item.price !== "number"
          ) {
            console.warn(
              `Listing at index ${index} is missing required properties`,
              item
            );
            return null;
          }

          const { latitude, longitude, id, price } = item;

          return (
            <Marker
              coordinate={{
                latitude,
                longitude,
              }}
              key={id.toString()}
              onPress={() => onMarkerSelected(item)}
            >
              <View style={styles.marker}>
                <Text style={styles.markerText}>€ {price}</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>
      <TouchableOpacity style={styles.locateBtn} onPress={onLocateMe}>
        <Ionicons name="navigate" size={24} color={Colors.dark} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 5,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  markerText: {
    fontSize: 14,
    fontFamily: "aeonik",
  },
  locateBtn: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
});

export default ListingsMap;
