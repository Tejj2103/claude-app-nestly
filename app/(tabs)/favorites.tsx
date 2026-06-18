import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function Favorites() {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-background pt-safe">
      <Ionicons name="heart-outline" size={32} color="#131313" />
      <Text className="text-lg font-semibold text-foreground">Favorites</Text>
    </View>
  );
}
