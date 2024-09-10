import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  customLeftButton?: React.ReactNode;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton,
  customLeftButton,
}) => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.leftContainer}>
          {showBackButton ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={32} color="#333" />
            </TouchableOpacity>
          ) : customLeftButton ? (
            customLeftButton
          ) : null}
        </View>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.rightContainer} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 70,
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 40,
  },
  backButton: {
    paddingTop: 14,
  },
  headerTitle: {
    fontFamily: "aeonikBold",
    paddingTop: 20,
    lineHeight: 12,
    fontSize: 20,
    color: "#333",
  },
  rightContainer: {
    width: 40,
  },
});

export default CustomHeader;
