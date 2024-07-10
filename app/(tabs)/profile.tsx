import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUser, useAuth, useClerk } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";

const CustomHeader = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={28} color={Colors.black} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Your Account</Text>
      <View style={styles.placeholder} />
    </SafeAreaView>
  );
};

const ProfilePage = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isLoading, setIsLoading] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <CustomHeader />,
    });
  }, [navigation]);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await signOut();
            // navigation.navigate('Login'); // Navigate to login screen
          } catch (error) {
            console.error("Error signing out:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await user?.delete();
              setIsLoading(false);
              // navigation.navigate('Login'); // Navigate to login screen
            } catch (error) {
              setIsLoading(false);
              console.error("Error deleting account:", error);
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user.imageUrl || "https://via.placeholder.com/150" }}
          style={styles.profilePicture}
        />
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.email}>
          {user.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.infoText}>{user.fullName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={24} color="#333" />
          <Text style={styles.infoText}>
            {user.primaryEmailAddress?.emailAddress}
          </Text>
        </View>
        {user.phoneNumbers && user.phoneNumbers.length > 0 && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={24} color="#333" />
            <Text style={styles.infoText}>
              {user.phoneNumbers[0].phoneNumber}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDeleteAccount}
        >
          <Text style={[styles.buttonText, styles.deleteButtonText]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>deleting account...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.quaternary,
    fontFamily: "aeonik",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 25,
    paddingBottom: 10,
    backgroundColor: Colors.quaternary,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "aeonikLight",
  },
  placeholder: {
    width: 28, // To balance the back button
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.quaternary,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "aeonik",
    lineHeight: 25,
  },
  email: {
    fontSize: 16,
    color: Colors.grey,
    fontFamily: "aeonik",
    lineHeight: 15,
  },
  infoSection: {
    margin: 20,
    backgroundColor: Colors.quaternary,
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    fontFamily: "aeonik",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
  },
  buttonSection: {
    margin: 20,
  },
  button: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    fontFamily: "aeonik",
    borderWidth: 2,
  },
  buttonText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "aeonik",
  },
  deleteButton: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    fontFamily: "aeonik",
  },
  deleteButtonText: {
    color: Colors.secondary,
    fontFamily: "aeonik",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfilePage;
