import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

const NotSignedInView: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/welcome-image-2.jpg")}
        style={styles.welcomeImage}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeTitle}>Welcome to Drive!</Text>
        <Text style={styles.welcomeText}>
          Sign up or log in to unlock all features and start your journey with
          us.
        </Text>

        <View style={styles.benefitsContainer}>
          <BenefitItem
            icon="person-circle-outline"
            text="Personalized experience"
          />
          <BenefitItem icon="bookmark-outline" text="Save your favorites" />
          <BenefitItem icon="notifications-outline" text="Get timely updates" />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.signUpButton]}
            onPress={() => router.push("/(modals)/signUp")}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => router.push("/(modals)/signUp")}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const BenefitItem: React.FC<{ icon: string; text: string }> = ({
  icon,
  text,
}) => (
  <View style={styles.benefitItem}>
    <Ionicons name={icon as any} size={24} color={Colors.primary} />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  welcomeImage: {
    width: width,
    height: height * 0.5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.dark,
    marginBottom: 10,
    fontFamily: "aeonikBold",
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.grey,
    marginBottom: 20,
    fontFamily: "aeonik",
  },
  benefitsContainer: {
    marginBottom: 30,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  benefitText: {
    marginLeft: 10,
    fontSize: 17,
    lineHeight: 24,
    color: Colors.dark,
    fontFamily: "aeonik",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  signUpButton: {
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  loginButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginLeft: 10,
  },
  signUpButtonText: {
    color: Colors.white,
    fontSize: 18,
    lineHeight: 20,
    fontFamily: "aeonikBold",
  },
  loginButtonText: {
    color: Colors.primary,
    fontSize: 20,
    lineHeight: 20,
    fontFamily: "aeonikBold",
  },
});

export default NotSignedInView;
