import { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Colors from "@/constants/Colors";

const ModalHeaderText = () => {
  const [active, setActive] = useState(0);
  return (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      <TouchableOpacity onPress={() => setActive(1)}>
        <Text
          style={{
            fontFamily: "aeonikBold",
            fontSize: 18,
            color: active == 1 ? "#000" : "#FFF",
            textDecorationLine: active == 1 ? "underline" : "none",
          }}
        >
          Your Drive
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalHeaderText;
