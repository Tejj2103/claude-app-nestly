import { useSignIn } from "@clerk/expo";
import { Link } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
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
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );
}

export default function SignIn() {
  // @clerk/expo's useSignIn() now returns the new "Future" signals API:
  // { signIn, errors, fetchStatus }, where `signIn` is a stateful resource
  // (signIn.create(), signIn.status, signIn.finalize()) instead of the old
  // { signIn, setActive, isLoaded } shape.
  const { signIn } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setError(null);

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: createError } = await signIn.create({
        identifier: email.trim(),
        password,
      });
      if (createError) {
        setError(createError.message);
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize();
        // Stack.Protected in app/_layout.tsx reacts to isSignedIn automatically —
        // no manual navigation needed once the session is active.
      } else {
        setError("Couldn't complete sign in. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F2]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 32 }}>
          <Text className="mt-10 text-4xl font-sans-bold text-primary">Welcome back</Text>
          <Text className="mt-2 font-sans-regular text-primary/60">
            Sign in to continue to Nestly
          </Text>

          <View className="mt-8 gap-5">
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
            />
            <Field
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />
          </View>

          {error && <Text className="mt-4 font-sans-medium text-red-500">{error}</Text>}

          <Pressable
            className="mt-8 items-center rounded-full bg-accent py-4"
            onPress={onSubmit}
            disabled={submitting}
          >
            <Text className="font-sans-bold text-white">
              {submitting ? "Signing in…" : "Sign in"}
            </Text>
          </Pressable>

          <View className="mt-6 flex-row justify-center gap-1">
            <Text className="font-sans-regular text-primary/60">Don't have an account?</Text>
            <Link href="/(auth)/sign-up">
              <Text className="font-sans-semibold text-accent">Sign up</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
