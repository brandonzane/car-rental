import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";

const VerifyEmailPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [code, setCode] = useState("");

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
        throw new Error("Unable to complete signup");
      }

      // Set the user session active
      await setActive({ session: completeSignUp.createdSessionId });

      // Navigate to the main app
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Verification failed", err.errors[0].message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Verify Your Email</Text>
      <Text style={styles.subHeader}>
        Please enter the verification code sent to your email.
      </Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="Enter verification code"
        style={[defaultStyles.inputField, { marginBottom: 20 }]}
        keyboardType="number-pad"
      />
      <TouchableOpacity style={defaultStyles.btn} onPress={onPressVerify}>
        <Text style={defaultStyles.btnText}>Verify Email</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.resendLink}
        onPress={() => {
          // Implement resend functionality here
          Alert.alert(
            "Resend Code",
            "This functionality needs to be implemented."
          );
        }}
      >
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 16,
    color: Colors.grey,
    marginBottom: 20,
    textAlign: "center",
  },
  resendLink: {
    marginTop: 20,
    alignItems: "center",
  },
  resendText: {
    color: Colors.primary,
    fontSize: 16,
  },
});

export default VerifyEmailPage;
