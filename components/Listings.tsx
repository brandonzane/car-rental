// components/Listings.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Listing } from "@/interfaces/listing";

interface Props {
  listings: Listing[];
  category: string;
  refresh: number;
  loading: boolean;
  error: string | null;
}

const Listings: React.FC<Props> = ({
  listings,
  category,
  refresh,
  loading,
  error,
}) => {
  if (loading) {
    return <Text style={styles.info}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.info}>Error: {error}</Text>;
  }

  const renderRow = ({ item }: { item: Listing }) => (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity activeOpacity={0.9}>
        <View style={styles.listing}>
          <Image source={{ uri: item.medium_url }} style={styles.image} />
          <TouchableOpacity
            style={{ position: "absolute", top: 30, right: 30 }}
          >
            <Ionicons name="bookmark-outline" size={25} color={"#fff"} />
          </TouchableOpacity>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.listingText}>{item.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="star" size={16} />
              <Text style={styles.listingText}>
                {item.review_scores_rating / 20}
              </Text>
            </View>
          </View>

          <Text style={styles.listingText}>{item.car_type}</Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.listingText}>$ {item.price}</Text>
            <Text style={styles.listingText}>/day</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <BottomSheetFlatList
        renderItem={renderRow}
        data={listings}
        ListHeaderComponent={
          <Text style={styles.info}>{listings.length} vehicles</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 40,
  },
  listing: {
    padding: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  listingText: {
    fontFamily: "aeonik",
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 15,
  },
  info: {
    textAlign: "center",
    fontFamily: "aeonikLight",
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Listings;
