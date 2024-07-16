import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import * as SecureStore from "expo-secure-store";
import "react-native-reanimated";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import ModalHeaderText from "@/components/ModalHeaderText";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import AnimatedSplashScreen from "@/components/AnimatedSplashScreen";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    aeonik: require("../assets/fonts/Aeonik/AeonikTRIAL-Regular.ttf"),
    aeonikBold: require("../assets/fonts/Aeonik/AeonikTRIAL-Bold.ttf"),
    aeonikLight: require("../assets/fonts/Aeonik/AeonikTRIAL-Light.ttf"),
    aeonikBoldItalic: require("../assets/fonts/Aeonik/AeonikTRIAL-BoldItalic.ttf"),
    aeonikLightItalic: require("../assets/fonts/Aeonik/AeonikTRIAL-LightItalic.ttf"),
    aeonikItalic: require("../assets/fonts/Aeonik/AeonikTRIAL-RegularItalic.ttf"),
  });

  // const [isSplashReady, setIsSplashReady] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <RootLayoutNav />
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
  }, [isLoaded]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)/signUp"
          options={{
            title: "Login or Sign Up",
            headerTitleStyle: {
              fontFamily: "aeonik",
            },
            presentation: "modal",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close-outline" size={28} />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen
          name="listing/[id]"
          options={{ headerTitle: "", headerTransparent: true }}
        />
        <Stack.Screen
          name="(modals)/booking"
          options={{
            presentation: "transparentModal",
            animation: "fade",
            headerTransparent: true,
            headerTitle: () => <ModalHeaderText />,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close-outline" size={28} />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
