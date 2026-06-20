import Octicons from "@expo/vector-icons/Octicons";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

import { colors } from "@/constants/theme";
import { useProfileStore } from "@/lib/store/profile-store";

const SafeAreaView = styled(RNSafeAreaView);

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
}) {
  return (
    <View className="gap-2">
      <Text className="font-sans-medium text-primary/70">{label}</Text>
      <TextInput
        className="rounded-2xl bg-white px-4 py-4 font-sans-regular text-primary"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#b7b7b8"
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
}

export default function Profile() {
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F2]">
      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between pt-5">
          <Text className="text-3xl font-sans-bold text-primary">Profile</Text>
          <View className="h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Octicons name="person" size={24} color={colors.primary} />
          </View>
        </View>

        <View className="mt-8 gap-5">
          <Field
            label="Full name"
            value={profile.fullName}
            onChangeText={(fullName) => updateProfile({ fullName })}
            placeholder="Your name"
          />
          <Field
            label="Email"
            value={profile.email}
            onChangeText={(email) => updateProfile({ email })}
            placeholder="you@example.com"
            keyboardType="email-address"
          />
          <Field
            label="Phone"
            value={profile.phone}
            onChangeText={(phone) => updateProfile({ phone })}
            placeholder="+91 00000 00000"
            keyboardType="phone-pad"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
