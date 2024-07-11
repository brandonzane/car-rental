import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Dimensions, Easing } from "react-native";
import Svg, { Circle, Path, Rect, G } from "react-native-svg";
import Colors from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

interface AnimatedSplashScreenProps {
  onAnimationComplete: () => void;
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({
  onAnimationComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(height)).current;
  const vehicleAnim = useRef(new Animated.Value(0)).current;
  const [vehicleIndex, setVehicleIndex] = useState(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(vehicleAnim, {
        toValue: 1,
        duration: 3000, // Reduced from 6000 to 3000 for faster animation
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setTimeout(onAnimationComplete, 500);
    });

    // Add listener to update vehicleIndex more frequently
    const listener = vehicleAnim.addListener(({ value }) => {
      setVehicleIndex(Math.floor(value * 8) % 4); // Changed from 4 to 8 to cycle through vehicles twice
    });

    // Cleanup listener
    return () => vehicleAnim.removeListener(listener);
  }, [fadeAnim, scaleAnim, translateYAnim, vehicleAnim, onAnimationComplete]);

  const vehicleTranslateX = vehicleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, width],
  });

  const Vehicle: React.FC = () => {
    switch (vehicleIndex) {
      case 0:
        return <Car />;
      case 1:
        return <SUV />;
      case 2:
        return <Motorcycle />;
      case 3:
        return <RV />;
      default:
        return <Car />;
    }
  };

  const Car = () => (
    <Svg height="60" width="120" viewBox="0 0 120 60">
      <G>
        <Rect
          x="10"
          y="20"
          width="100"
          height="30"
          fill={Colors.primary}
          rx="10"
          ry="10"
        />
        <Rect
          x="25"
          y="10"
          width="70"
          height="25"
          fill={Colors.primary}
          rx="10"
          ry="10"
        />
        <Circle cx="30" cy="50" r="10" fill="#333" />
        <Circle cx="90" cy="50" r="10" fill="#333" />
      </G>
    </Svg>
  );

  const SUV = () => (
    <Svg height="70" width="140" viewBox="0 0 140 70">
      <G>
        <Rect
          x="10"
          y="20"
          width="120"
          height="40"
          fill={Colors.primary}
          rx="10"
          ry="10"
        />
        <Rect
          x="20"
          y="5"
          width="100"
          height="35"
          fill={Colors.primary}
          rx="10"
          ry="10"
        />
        <Circle cx="35" cy="60" r="10" fill="#333" />
        <Circle cx="105" cy="60" r="10" fill="#333" />
      </G>
    </Svg>
  );

  const Motorcycle = () => (
    <Svg height="60" width="80" viewBox="0 0 80 60">
      <G>
        <Path d="M10 40 L70 40 L60 20 L20 20 Z" fill={Colors.primary} />
        <Circle cx="20" cy="50" r="10" fill="#333" />
        <Circle cx="60" cy="50" r="10" fill="#333" />
        <Path
          d="M30 20 L50 5 L55 20"
          stroke={Colors.primary}
          strokeWidth="5"
          fill="none"
        />
      </G>
    </Svg>
  );

  const RV = () => (
    <Svg height="80" width="160" viewBox="0 0 160 80">
      <G>
        <Rect
          x="10"
          y="20"
          width="140"
          height="50"
          fill={Colors.primary}
          rx="10"
          ry="10"
        />
        <Rect x="120" y="30" width="30" height="40" fill="#fff" rx="5" ry="5" />
        <Circle cx="40" cy="70" r="10" fill="#333" />
        <Circle cx="120" cy="70" r="10" fill="#333" />
      </G>
    </Svg>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Svg height="100" width="100" viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="45" fill={Colors.primary} />
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Path
              d="M30 50 L50 70 L70 30"
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Animated.View>
        </Svg>
      </Animated.View>
      <Animated.Text
        style={[
          styles.text,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          },
        ]}
      >
        DRIVE
      </Animated.Text>
      <Animated.View
        style={[
          styles.vehicleContainer,
          { transform: [{ translateX: vehicleTranslateX }] },
        ]}
      >
        <Vehicle />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  logoContainer: {
    marginBottom: 20,
  },
  text: {
    fontSize: 36,
    color: Colors.primary,
    fontFamily: "aeonikBold",
  },
  vehicleContainer: {
    position: "absolute",
    bottom: 50,
    left: -120,
  },
});

export default AnimatedSplashScreen;
