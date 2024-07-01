import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";

enum Strategy {
  Apple = "oauth_apple",
  Google = "oauth_google",
  Facebook = "oauth_facebook",
}

const Page = () => {
  useWarmUpBrowser();
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });
  const { startOAuthFlow: googleAuth } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: "oauth_facebook",
  });

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Apple]: appleAuth,
      [Strategy.Google]: googleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();
      console.log(
        " ~ file: signUp.tsx:41 ~ onSelectAuth ~ createdSessionId",
        createdSessionId
      );

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("OAuth error: ", error);
      Alert.alert("Error", "Authentication failed. Please try again.");
    }
  };

  const onSignUpWithEmail = async () => {
    if (!isLoaded) {
      Alert.alert(
        "Error",
        "Authentication is not ready yet. Please try again."
      );
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
      await signUp.create({
        emailAddress: email,
        password,
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Navigate to email verification page
      router.push("/verify-email");
    } catch (err: any) {
      console.error("Error:", err);
      Alert.alert("Sign Up Error", err.errors[0].message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
      />
      <TextInput
        autoCapitalize="none"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
      />
      <TouchableOpacity style={defaultStyles.btn} onPress={onSignUpWithEmail}>
        <Text style={defaultStyles.btnText}>Sign Up with Email</Text>
      </TouchableOpacity>
      <Link href={"/emailLogin"} replace asChild>
        <TouchableOpacity>
          <Text style={{ textAlign: "center", color: Colors.primary, top: 10 }}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </Link>
      <View style={styles.seperatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: "#000",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text style={styles.seperator}>or</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: "#000",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>

      <View style={{ gap: 26 }}>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Apple)}
        >
          <Ionicons name="logo-apple" size={24} style={defaultStyles.btnIcon} />
          <Text style={styles.btnOutlineText}>Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Google)}
        >
          <Ionicons
            name="logo-google"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Facebook)}
        >
          <Ionicons
            name="logo-facebook"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 26,
  },

  seperatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  seperator: {
    fontFamily: "aeonik",
    color: Colors.grey,
    fontSize: 16,
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
});
