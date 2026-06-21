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

interface EnquiryModalProps {
  visible: boolean;
  onClose: () => void;
  defaultFullName: string;
  defaultPhone: string;
  submitting: boolean;
  onSubmit: (values: { fullName: string; phone: string; message: string }) => void;
}

export function EnquiryModal({
  visible,
  onClose,
  defaultFullName,
  defaultPhone,
  submitting,
  onSubmit,
}: EnquiryModalProps) {
  const [fullName, setFullName] = useState(defaultFullName);
  const [phone, setPhone] = useState(defaultPhone);
  const [message, setMessage] = useState("");

  // Re-sync the draft with the latest profile values each time the modal opens.
  useEffect(() => {
    if (visible) {
      setFullName(defaultFullName);
      setPhone(defaultPhone);
      setMessage("");
    }
  }, [visible, defaultFullName, defaultPhone]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          className="rounded-t-3xl bg-white"
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-5 px-5 pb-8 pt-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-sans-bold text-primary">Request Enquiry</Text>
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

          <View className="gap-2">
            <Text className="font-sans-medium text-primary/70">Message (optional)</Text>
            <TextInput
              className="min-h-24 rounded-2xl bg-[#F2F2F2] px-4 py-4 font-sans-regular text-primary"
              value={message}
              onChangeText={setMessage}
              placeholder="I'm interested in this property..."
              placeholderTextColor="#b7b7b8"
              multiline
              textAlignVertical="top"
            />
          </View>

          <Pressable
            className="items-center rounded-full bg-accent py-4"
            onPress={() => onSubmit({ fullName: fullName.trim(), phone: phone.trim(), message: message.trim() })}
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
