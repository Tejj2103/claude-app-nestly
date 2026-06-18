import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

export default function Search() {
  const { category } = useLocalSearchParams();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "600" }}>Search Results</Text>
        {category && (
          <Text style={{ marginTop: 12 }}>Category: {category}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
