import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";

import { COUNTRIES, type Country, type CountryCode } from "@/lib/phone";

interface CountryCodePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (iso: CountryCode) => void;
}

export function CountryCodePicker({ visible, onClose, onSelect }: CountryCodePickerProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.iso.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      <View className="h-3/4 gap-4 rounded-t-3xl bg-white px-5 pb-8 pt-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-sans-bold text-primary">Select country</Text>
          <Pressable onPress={onClose}>
            <Text className="font-sans-medium text-accent">Close</Text>
          </Pressable>
        </View>

        <TextInput
          className="rounded-2xl bg-[#F2F2F2] px-4 py-3 font-sans-regular text-primary"
          value={query}
          onChangeText={setQuery}
          placeholder="Search country or code"
          placeholderTextColor="#b7b7b8"
          autoCapitalize="none"
        />

        <FlatList
          data={results}
          keyExtractor={(item) => item.iso}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }: { item: Country }) => (
            <Pressable
              className="flex-row items-center gap-3 py-3"
              onPress={() => {
                onSelect(item.iso);
                setQuery("");
                onClose();
              }}
            >
              <Text className="text-xl">{item.flag}</Text>
              <Text className="flex-1 font-sans-regular text-primary">{item.name}</Text>
              <Text className="font-sans-medium text-primary/60">{item.dialCode}</Text>
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}
