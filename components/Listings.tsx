import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
} from "react-native";
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  listings: any[];
  category: string;
  refresh: number;
}

const Listings = ({ listings: items, refresh, category }: Props) => {
  // Ref for BottomSheetFlatList
  const listRef = useRef<BottomSheetFlatListMethods>(null);
  // State to control loading state
  const [loading, setLoading] = useState<boolean>(false);

  // Update the view to scroll the list back to the top when refresh is triggered
  useEffect(() => {
    if (refresh) {
      scrollListTop();
    }
  }, [refresh]);

  // Scroll the list to the top
  const scrollListTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Use for "updating" the views data after the category changes
  useEffect(() => {
    setLoading(true);

    // Simulate a loading delay
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category]);

  const renderRow: ListRenderItem<any> = ({ item }) => (
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
    <View style={defaultStyles.container}>
      {/* BottomSheetFlatList for displaying listings */}
      <BottomSheetFlatList
        renderItem={renderRow}
        data={loading ? [] : items}
        ref={listRef}
        // Header displaying the number of homes
        ListHeaderComponent={
          <Text style={styles.info}>{items.length} vehicles</Text>
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
