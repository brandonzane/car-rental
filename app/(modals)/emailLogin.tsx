import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";

const LoginPage = () => {
  const { signIn, setActive } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onPressSignIn = async () => {
    if (!signIn) {
      Alert.alert("Error", "Sign-in is not available at the moment.");
      return;
    }

    if (!email || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter both email and password."
      );
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      // Check if the sign-in was successful
      if (completeSignIn.status === "complete") {
        // Set the user session as active
        await setActive({ session: completeSignIn.createdSessionId });
        // Navigate to the main app
        router.replace("/(tabs)");
      } else {
        // Handle incomplete sign-in (e.g., 2FA required)
        console.log("Sign-in not complete", completeSignIn);
        Alert.alert("Sign-in Incomplete", "Please complete additional steps.");
      }
    } catch (err: any) {
      console.error("Error:", err);
      Alert.alert("Sign In Error", err.errors[0].message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back</Text>
      <Text style={styles.subHeader}>Sign in to your account</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={[defaultStyles.inputField, { marginBottom: 15 }]}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
      />

      <TouchableOpacity style={defaultStyles.btn} onPress={onPressSignIn}>
        <Text style={defaultStyles.btnText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => {
          // Navigate to forgot password page
          router.push("/forgot-password");
        }}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 26,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 16,
    color: Colors.grey,
    marginBottom: 20,
    textAlign: "center",
  },
  forgotPassword: {
    marginTop: 20,
    alignItems: "center",
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 16,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: Colors.grey,
  },
  signUpLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "bold",
  },
});

export default LoginPage;
