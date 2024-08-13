import React, { useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import ListingsMap from "@/components/ListingsMap";
import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useListings } from "@/hooks/useListings";

const Home = () => {
  const [category, setCategory] = useState<string>("All");
  const { listings, loading, error } = useListings(category);

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
        <ListingsMap listings={{ features: listings as any }} />
        <ListingsBottomSheet listings={listings as any} category={category} />
      </GestureHandlerRootView>
    </View>
  );
};

export default Home;
