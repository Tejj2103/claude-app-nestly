import { useClerk } from "@clerk/expo";
import Octicons from "@expo/vector-icons/Octicons";
import { Image as ExpoImage } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

import { CountryCodePicker } from "@/components/country-code-picker";
import { colors } from "@/constants/theme";
import { useProfileStore } from "@/lib/store/profile-store";
import {
  COUNTRIES,
  formatPhoneForDisplay,
  splitPhone,
  validateAndFormatPhone,
  type CountryCode,
} from "@/lib/phone";

const SafeAreaView = styled(RNSafeAreaView);

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <View className="gap-2">
      <Text className="font-sans-medium text-primary/70">{label}</Text>
      <View className="rounded-2xl bg-secondary/20 px-4 py-4">
        <Text className="font-sans-regular text-primary">{value || "—"}</Text>
      </View>
    </View>
  );
}

export default function Profile() {
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const { signOut } = useClerk();

  const [isEditing, setIsEditing] = useState(false);
  const [draftFullName, setDraftFullName] = useState("");
  const [draftCountry, setDraftCountry] = useState<CountryCode>("IN");
  const [draftNationalNumber, setDraftNationalNumber] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedCountry = COUNTRIES.find((c) => c.iso === draftCountry);

  const onEdit = () => {
    const { country, nationalNumber } = splitPhone(profile.phone);
    setDraftFullName(profile.fullName);
    setDraftCountry(country);
    setDraftNationalNumber(nationalNumber);
    setPhoneError(null);
    setIsEditing(true);
  };

  const onCancel = () => {
    setIsEditing(false);
    setPhoneError(null);
  };

  const onSave = async () => {
    setPhoneError(null);

    const { valid, e164 } = validateAndFormatPhone(draftCountry, draftNationalNumber);
    if (!valid) {
      setPhoneError("Enter a valid phone number for the selected country.");
      return;
    }

    setSaving(true);
    const { error } = await updateProfile({
      fullName: draftFullName.trim(),
      phone: e164 ?? "",
    });
    setSaving(false);

    if (error) {
      setPhoneError(`Couldn't save: ${error}`);
      return;
    }
    setIsEditing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F2]">
      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between pt-5">
          <Text className="text-3xl font-sans-bold text-primary">Profile</Text>
          <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-secondary">
            {profile.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <ExpoImage
                source={require("@/assets/images/user-profile.svg")}
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </View>
        </View>

        <View className="mt-8 gap-5">
          <ReadOnlyField label="Username" value={profile.username} />
          <ReadOnlyField label="Email" value={profile.email} />

          {!isEditing ? (
            <>
              <ReadOnlyField label="Full name" value={profile.fullName} />
              <ReadOnlyField label="Phone" value={formatPhoneForDisplay(profile.phone)} />

              <Pressable
                className="mt-2 flex-row items-center justify-center gap-2 rounded-full bg-white py-4"
                onPress={onEdit}
              >
                <Octicons name="pencil" size={16} color={colors.primary} />
                <Text className="font-sans-bold text-primary">Edit profile</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View className="gap-2">
                <Text className="font-sans-medium text-primary/70">Full name</Text>
                <TextInput
                  className="rounded-2xl bg-white px-4 py-4 font-sans-regular text-primary"
                  value={draftFullName}
                  onChangeText={setDraftFullName}
                  placeholder="Your name"
                  placeholderTextColor="#b7b7b8"
                />
              </View>

              <View className="gap-2">
                <Text className="font-sans-medium text-primary/70">Phone</Text>
                <View className="flex-row items-center gap-3">
                  <Pressable
                    className="flex-row items-center gap-2 rounded-2xl bg-white px-4 py-4"
                    onPress={() => setPickerVisible(true)}
                  >
                    <Text className="text-lg">{selectedCountry?.flag}</Text>
                    <Text className="font-sans-medium text-primary">
                      {selectedCountry?.dialCode}
                    </Text>
                    <Octicons name="chevron-down" size={14} color={colors.primary} />
                  </Pressable>
                  <TextInput
                    className="flex-1 rounded-2xl bg-white px-4 py-4 font-sans-regular text-primary"
                    value={draftNationalNumber}
                    onChangeText={(text) => setDraftNationalNumber(text.replace(/[^\d]/g, ""))}
                    placeholder="98765 43210"
                    placeholderTextColor="#b7b7b8"
                    keyboardType="phone-pad"
                  />
                </View>
                {phoneError && (
                  <Text className="font-sans-medium text-red-500">{phoneError}</Text>
                )}
              </View>

              <View className="mt-2 flex-row gap-3">
                <Pressable
                  className="flex-1 items-center rounded-full bg-[#E5E5E5] py-4"
                  onPress={onCancel}
                  disabled={saving}
                >
                  <Text className="font-sans-bold text-primary">Cancel</Text>
                </Pressable>
                <Pressable
                  className="flex-1 items-center rounded-full bg-accent py-4"
                  onPress={onSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text className="font-sans-bold text-white">Save</Text>
                  )}
                </Pressable>
              </View>
            </>
          )}
        </View>

        <Pressable
          className="mt-8 items-center rounded-full bg-white py-4"
          onPress={() => signOut()}
        >
          <Text className="font-sans-bold text-red-500">Log out</Text>
        </Pressable>
      </ScrollView>

      <CountryCodePicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={setDraftCountry}
      />
    </SafeAreaView>
  );
}
