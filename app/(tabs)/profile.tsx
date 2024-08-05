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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUser, useClerk } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import { router } from "expo-router";

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
    <Text style={styles.optionText}>{title}</Text>
    <Ionicons name={"chevron-forward"} size={24} color={Colors.grey} />
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
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => router.push("/(modals)/signUp" as never)}
        >
          <Text style={styles.btnOutlineText}>Sign Up or Log in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your account</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView>
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => handleOptionPress("View profile")}
        >
          <Image
            source={{ uri: user.imageUrl || "https://via.placeholder.com/150" }}
            style={styles.profilePicture}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.viewProfile}>View profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.grey} />
        </TouchableOpacity>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <ProfileOption
            title="Account management"
            icon="chevron-forward"
            onPress={() => handleOptionPress("Account management")}
          />
          <ProfileOption
            title="Profile visibility"
            icon="chevron-forward"
            onPress={() => handleOptionPress("Profile visibility")}
          />
          <ProfileOption
            title="Notifications"
            icon="chevron-forward"
            onPress={() => handleOptionPress("Notifications")}
          />
        </View>

        <View style={styles.loginSection}>
          <Text style={styles.sectionTitle}>Login</Text>
          <ProfileOption
            title="Add account"
            icon="chevron-forward"
            onPress={() => handleOptionPress("Add account")}
          />
          <ProfileOption
            title="Security"
            icon="chevron-forward"
            onPress={() => handleOptionPress("Security")}
          />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteAccountButton}
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
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "aeonik",
    lineHeight: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  signUpText: {
    color: Colors.primary,
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  backButton: {
    padding: 5,
  },
  deleteAccountButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  deleteAccountText: {
    fontSize: 16,
    color: Colors.danger,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark,
  },
  placeholder: {
    width: 28,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark,
  },
  viewProfile: {
    fontSize: 14,
    color: Colors.grey,
  },
  settingsSection: {
    marginTop: 20,
  },
  loginSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark,
    marginLeft: 16,
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    color: Colors.dark,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.dark,
  },
  loadingText: {
    color: Colors.dark,
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProfilePage;
