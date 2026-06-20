import AsyncStorage from "@react-native-async-storage/async-storage";

const DEVICE_ID_KEY = "nestly-device-id";

let cachedDeviceId: string | null = null;

function randomUUID(): string {
  // Pure-JS UUID v4 — no native module needed. Not cryptographically
  // secure, but this is just a pseudo-anonymous device identifier, not a
  // security boundary.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getDeviceId(): Promise<string> {
  if (cachedDeviceId) return cachedDeviceId;

  const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (stored) {
    cachedDeviceId = stored;
    return stored;
  }

  const newId = randomUUID();
  await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
  cachedDeviceId = newId;
  return newId;
}
