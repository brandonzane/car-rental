import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import "react-native-reanimated";
import { ClerkProvider, useAuth, useClerk } from "@clerk/clerk-expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomHeader from "@/components/CustomHeader";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value;
    } catch (err) {
      console.error("Error retrieving token:", err);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("Error saving token:", err);
    }
  },
};

function CustomJWTCache() {
  const { getToken } = useAuth();
  const clerk = useClerk();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getToken();
        if (token) {
          await SecureStore.setItemAsync("__clerk_client_jwt", token);
        }
      } catch (error) {
        console.error("Error fetching or storing token:", error);
      }
    };

    fetchToken();
  }, [getToken]);

  return null;
}

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    aeonik: require("../assets/fonts/Aeonik/AeonikTRIAL-Regular.ttf"),
    aeonikBold: require("../assets/fonts/Aeonik/AeonikTRIAL-Bold.ttf"),
    aeonikLight: require("../assets/fonts/Aeonik/AeonikTRIAL-Light.ttf"),
    aeonikBoldItalic: require("../assets/fonts/Aeonik/AeonikTRIAL-BoldItalic.ttf"),
    aeonikLightItalic: require("../assets/fonts/Aeonik/AeonikTRIAL-LightItalic.ttf"),
    aeonikItalic: require("../assets/fonts/Aeonik/AeonikTRIAL-RegularItalic.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // SecureStore doesn't have an initializeSecureStore method
        // We'll remove this line as it's not needed
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn("Error during app preparation:", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!appIsReady || !loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <CustomJWTCache />
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <RootLayoutNav />
      </View>
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/(modals)/signUp");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          header: ({ options, route }) => {
            // Don't render the header for the listing detail page
            if (route.name === "listing/[id]") {
              return null;
            }
            return (
              <CustomHeader
                title={options.headerTitle?.toString() || route.name}
                showBackButton={route.name !== "(tabs)"}
                customLeftButton={
                  options.headerLeft && options.headerLeft({ canGoBack: true })
                }
              />
            );
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, headerTitle: "" }}
        />
        <Stack.Screen
          name="(modals)/signUp"
          options={{
            headerTitle: "Login or Sign Up",
            presentation: "modal",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close-outline" size={28} color="#333" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="listing/[id]"
          options={{
            headerShown: false, // This ensures no header is shown from the layout
          }}
        />
        <Stack.Screen
          name="(modals)/booking"
          options={{
            presentation: "transparentModal",
            animation: "fade",
            headerTransparent: true,
            headerTitle: "Booking",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close-outline" size={28} color="#333" />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
