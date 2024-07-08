import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  listings: any[];
  category: string;
  refresh: number;
}

const Listings = ({ listings: items, category, refresh }: Props) => {
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (refresh) {
      scrollListTop();
    }
  }, [refresh]);

  const scrollListTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  useEffect(() => {
    console.log("RELOAD LISTINGS: ", items.length);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderRow: ListRenderItem<any> = ({ item }) => (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity>
        <View style={styles.listing}>
          <Image source={{ uri: item.medium_url }} style={styles.image} />
          <TouchableOpacity
            style={{ position: "absolute", top: 30, right: 30 }}
          >
            <Ionicons name="bookmark-outline" size={25} color={"#fff"} />
          </TouchableOpacity>

          <View style={{ flexDirection: "row" }}>
            <Text
              style={{ fontFamily: "aeonik", fontSize: 16, lineHeight: 15 }}
            >
              {item.name}
            </Text>
            <View style={{ flexDirection: "row", gap: 4 }}>
              <Ionicons name="star" size={16} />
              <Text style={{ fontFamily: "aeonik", lineHeight: 15 }}>
                {item.review_scores_rating / 20}
              </Text>
            </View>
          </View>

          <Text style={{ fontFamily: "aeonik", lineHeight: 15 }}>
            {item.car_type}
          </Text>

          <View style={{ flexDirection: "row", gap: 4 }}>
            <Text style={{ fontFamily: "aeonik", lineHeight: 15 }}>
              $ {item.price}
            </Text>
            <Text style={{ fontFamily: "aeonik", lineHeight: 15 }}>/day</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={defaultStyles.container}>
      <FlatList
        renderItem={renderRow}
        ref={listRef}
        data={loading ? [] : items}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listing: {
    padding: 16,
    gap: 10,
    marginVertical: 16,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
});

export default Listings;
