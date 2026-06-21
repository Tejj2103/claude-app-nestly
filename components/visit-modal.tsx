import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

interface VisitModalProps {
  visible: boolean;
  onClose: () => void;
  defaultFullName: string;
  defaultPhone: string;
  submitting: boolean;
  onSubmit: (values: { fullName: string; phone: string; date: string; time: string }) => void;
}

export function VisitModal({
  visible,
  onClose,
  defaultFullName,
  defaultPhone,
  submitting,
  onSubmit,
}: VisitModalProps) {
  const [fullName, setFullName] = useState(defaultFullName);
  const [phone, setPhone] = useState(defaultPhone);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (visible) {
      setFullName(defaultFullName);
      setPhone(defaultPhone);
      setDate("");
      setTime("");
    }
  }, [visible, defaultFullName, defaultPhone]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView className="rounded-t-3xl bg-white" keyboardShouldPersistTaps="handled">
          <View className="gap-5 px-5 pb-8 pt-6">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-sans-bold text-primary">Schedule a Visit</Text>
              <Pressable onPress={onClose}>
                <Text className="font-sans-medium text-primary/60">Close</Text>
              </Pressable>
            </View>

            <View className="gap-2">
              <Text className="font-sans-medium text-primary/70">Name</Text>
              <TextInput
                className="rounded-2xl bg-[#F2F2F2] px-4 py-4 font-sans-regular text-primary"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your name"
                placeholderTextColor="#b7b7b8"
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            <View className="gap-2">
              <Text className="font-sans-medium text-primary/70">Phone</Text>
              <TextInput
                className="rounded-2xl bg-[#F2F2F2] px-4 py-4 font-sans-regular text-primary"
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 98765 43210"
                placeholderTextColor="#b7b7b8"
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1 gap-2">
                <Text className="font-sans-medium text-primary/70">Date</Text>
                <TextInput
                  className="rounded-2xl bg-[#F2F2F2] px-4 py-4 font-sans-regular text-primary"
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#b7b7b8"
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>
              <View className="flex-1 gap-2">
                <Text className="font-sans-medium text-primary/70">Time</Text>
                <TextInput
                  className="rounded-2xl bg-[#F2F2F2] px-4 py-4 font-sans-regular text-primary"
                  value={time}
                  onChangeText={setTime}
                  placeholder="e.g. 4:00 PM"
                  placeholderTextColor="#b7b7b8"
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>
            </View>

            <Pressable
              className="items-center rounded-full bg-accent py-4"
              onPress={() =>
                onSubmit({
                  fullName: fullName.trim(),
                  phone: phone.trim(),
                  date: date.trim(),
                  time: time.trim(),
                })
              }
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="font-sans-bold text-white">Submit</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
