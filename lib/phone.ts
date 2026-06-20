import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/min";

export type { CountryCode };

export interface Country {
  iso: CountryCode;
  name: string;
  dialCode: string;
  flag: string;
}

function isoToFlagEmoji(iso: string) {
  return iso
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function countryName(iso: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(iso) ?? iso;
  } catch {
    return iso;
  }
}

export const COUNTRIES: Country[] = getCountries()
  .map((iso) => ({
    iso,
    name: countryName(iso),
    dialCode: `+${getCountryCallingCode(iso)}`,
    flag: isoToFlagEmoji(iso),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const DEFAULT_COUNTRY: CountryCode = "IN";

/** Splits a stored E.164 phone string back into a country + national number for editing. */
export function splitPhone(phone: string | null | undefined) {
  if (!phone?.trim()) {
    return { country: DEFAULT_COUNTRY, nationalNumber: "" };
  }
  const parsed = parsePhoneNumberFromString(phone);
  if (parsed?.country) {
    return {
      country: parsed.country as CountryCode,
      nationalNumber: parsed.formatNational().replace(/\D/g, ""),
    };
  }
  return { country: DEFAULT_COUNTRY, nationalNumber: phone.replace(/\D/g, "") };
}

/**
 * Validates a national number against the selected country and, if valid,
 * returns the E.164 string to persist. An empty number is treated as valid
 * (phone is optional) and returns `e164: null`.
 */
export function validateAndFormatPhone(country: CountryCode, nationalNumber: string) {
  if (!nationalNumber.trim()) {
    return { valid: true, e164: null as string | null };
  }
  if (!isValidPhoneNumber(nationalNumber, country)) {
    return { valid: false, e164: null as string | null };
  }
  const parsed = parsePhoneNumberFromString(nationalNumber, country);
  return { valid: true, e164: parsed?.number ?? null };
}

/** Formats a stored E.164 phone string for display, e.g. "+91 98765 43210". */
export function formatPhoneForDisplay(phone: string | null | undefined) {
  if (!phone?.trim()) return "";
  const parsed = parsePhoneNumberFromString(phone);
  return parsed?.formatInternational() ?? phone;
}
