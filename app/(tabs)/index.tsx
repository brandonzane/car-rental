import { View } from "react-native";
import React, { useMemo, useState } from "react";
import { Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import Listings from "@/components/Listings";
import listingsData from "@/assets/data/airbnb-listings.json";
import ListingsMap from "@/components/ListingsMap";
import listingsDataGeo from "@/assets/data/airbnb-listings.geo.json";
import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Home = () => {
  const [category, setCategory] = useState<string>("Tiny homes");
  const items = useMemo(() => listingsData as any, []);

  const onDataChanged = (category: string) => {
    setCategory(category);
  };

  return (
    <View style={{ flex: 1, marginTop: 130 }}>
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      <GestureHandlerRootView>
        {/* <Listings listings={items} category={category} /> */}
        <ListingsMap listings={listingsDataGeo} />
        <ListingsBottomSheet listings={items} category={category} />
      </GestureHandlerRootView>
    </View>
  );
};

export default Home;
