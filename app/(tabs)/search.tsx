import { icons } from "@/constants/icons";
import { Image, Text, View } from "react-native";

export default function Search() {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-background pt-safe">
      <Image
        source={icons.search}
        className="tabs-glyph"
        resizeMode="contain"
        style={{ width: 48, height: 48 }}
      />
      <Text className="text-lg font-semibold text-foreground">Search</Text>
    </View>
  );
};
