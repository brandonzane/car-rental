import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUser, useClerk } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import NotSignedInView from "@/components/NotSignedInView";

const { width, height } = Dimensions.get("window");

interface ProfileOptionProps {
  title: string;
  icon: string;
  onPress: () => void;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({
  title,
  icon,
  onPress,
}) => (
  <TouchableOpacity style={styles.optionContainer} onPress={onPress}>
    <Ionicons
      name={icon as any}
      size={24}
      color={Colors.primary}
      style={styles.optionIcon}
    />
    <Text style={styles.optionText}>{title}</Text>
    <Ionicons name="chevron-forward" size={24} color={Colors.grey} />
  </TouchableOpacity>
);

const ProfilePage: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
      // Navigate to login screen or handle post-logout logic
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle error (e.g., show an alert)
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await user?.delete();
              // Navigate to the signup page after successful account deletion
              navigation.navigate("SignUp" as never);
            } catch (error) {
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

  const handleOptionPress = (option: string) => {
    // Handle option press
    console.log(`${option} pressed`);
    // Add navigation or other logic here
  };

  if (!user) {
    return <NotSignedInView />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Account</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.profileSection}>
          <Image
            source={{ uri: user.imageUrl || "https://via.placeholder.com/150" }}
            style={styles.profilePicture}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.fullName}</Text>
            <TouchableOpacity onPress={() => handleOptionPress("View profile")}>
              <Text style={styles.viewProfile}>View profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <ProfileOption
            title="Account management"
            icon="person-circle-outline"
            onPress={() => handleOptionPress("Account management")}
          />
          <ProfileOption
            title="Profile visibility"
            icon="eye-outline"
            onPress={() => handleOptionPress("Profile visibility")}
          />
          <ProfileOption
            title="Notifications"
            icon="notifications-outline"
            onPress={() => handleOptionPress("Notifications")}
          />
        </View>

        <View style={styles.loginSection}>
          <Text style={styles.sectionTitle}>Login</Text>
          <ProfileOption
            title="Add account"
            icon="person-add-outline"
            onPress={() => handleOptionPress("Add account")}
          />
          <ProfileOption
            title="Security"
            icon="shield-checkmark-outline"
            onPress={() => handleOptionPress("Security")}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Log out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteAccountButton]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "aeonikBold",
    color: Colors.dark,
  },
  placeholder: {
    width: 28,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
    // Properties for the box shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // This is for Android
  },

  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 22,
    lineHeight: 20,
    fontWeight: "600",
    fontFamily: "aeonikBold",
    color: Colors.dark,
  },
  viewProfile: {
    fontSize: 16,
    color: Colors.primary,
    lineHeight: 20,
    marginTop: 4,
    fontFamily: "aeonik",
  },
  settingsSection: {
    marginTop: 30,
  },
  loginSection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark,
    marginLeft: 16,
    marginBottom: 10,
    fontFamily: "aeonikBold",
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    color: Colors.dark,
    fontFamily: "aeonik",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  deleteAccountButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.danger,
    marginLeft: 10,
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "aeonikBold",
  },
  deleteAccountText: {
    color: Colors.danger,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "aeonikBold",
  },
});

export default ProfilePage;
