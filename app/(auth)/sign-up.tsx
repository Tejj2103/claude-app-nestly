import { useSignUp } from "@clerk/expo";
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
  keyboardType?: "default" | "email-address" | "number-pad";
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

export default function SignUp() {
  // @clerk/expo's useSignUp() now returns the new "Future" signals API:
  // `signUp` is a stateful resource — signUp.create(), signUp.verifications
  // (sendEmailCode/verifyEmailCode), signUp.status, signUp.finalize() —
  // instead of the old { signUp, setActive, isLoaded } + prepare/attempt shape.
  const { signUp } = useSignUp();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onCreateAccount = async () => {
    setError(null);

    if (!username.trim() || !email.trim() || !password) {
      setError("Username, email, and password are all required.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: createError } = await signUp.create({
        username: username.trim(),
        emailAddress: email.trim(),
        password,
      });
      if (createError) {
        setError(createError.message);
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setError(sendError.message);
        return;
      }

      setPendingVerification(true);
    } finally {
      setSubmitting(false);
    }
  };

  const onVerify = async () => {
    setError(null);

    if (!code.trim()) {
      setError("Enter the verification code sent to your email.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });
      if (verifyError) {
        setError(verifyError.message);
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize();
        // app/_layout.tsx syncs the new user's username/email to user_profiles
        // once isSignedIn/useUser() picks up the new session — no need to
        // duplicate that upsert here.
      } else {
        setError("Couldn't verify that code. Please try again.");
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
          {!pendingVerification ? (
            <>
              <Text className="mt-10 text-4xl font-sans-bold text-primary">Create account</Text>
              <Text className="mt-2 font-sans-regular text-primary/60">
                Sign up to start exploring properties
              </Text>

              <View className="mt-8 gap-5">
                <Field
                  label="Username"
                  value={username}
                  onChangeText={setUsername}
                  placeholder="janedoe"
                />
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
                onPress={onCreateAccount}
                disabled={submitting}
              >
                <Text className="font-sans-bold text-white">
                  {submitting ? "Creating account…" : "Sign up"}
                </Text>
              </Pressable>

              <View className="mt-6 flex-row justify-center gap-1">
                <Text className="font-sans-regular text-primary/60">Already have an account?</Text>
                <Link href="/(auth)/sign-in">
                  <Text className="font-sans-semibold text-accent">Sign in</Text>
                </Link>
              </View>
            </>
          ) : (
            <>
              <Text className="mt-10 text-4xl font-sans-bold text-primary">Check your email</Text>
              <Text className="mt-2 font-sans-regular text-primary/60">
                We sent a verification code to {email}
              </Text>

              <View className="mt-8">
                <Field
                  label="Verification code"
                  value={code}
                  onChangeText={setCode}
                  placeholder="123456"
                  keyboardType="number-pad"
                />
              </View>

              {error && <Text className="mt-4 font-sans-medium text-red-500">{error}</Text>}

              <Pressable
                className="mt-8 items-center rounded-full bg-accent py-4"
                onPress={onVerify}
                disabled={submitting}
              >
                <Text className="font-sans-bold text-white">
                  {submitting ? "Verifying…" : "Verify & continue"}
                </Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
