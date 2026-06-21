import { RangeSlider } from "@react-native-assets/slider";
import { Modal, Pressable, Text, View } from "react-native";

import { colors } from "@/constants/theme";
import { useCities } from "@/lib/data/properties";
import type { BathroomsFilter, BhkFilter, HomeFilters, SortBy } from "@/lib/data/properties";
import type { FurnishedStatus } from "@/lib/data/types";

const BHK_OPTIONS: BhkFilter[] = ["Any", "Studio", "1", "2", "3"];
const FURNISHED_OPTIONS: (FurnishedStatus | "Any")[] = [
  "Any",
  "Furnished",
  "Semi-Furnished",
  "Unfurnished",
];
const BATHROOM_OPTIONS: BathroomsFilter[] = ["Any", "1", "2", "3+"];
const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "none", label: "None" },
  { value: "price-asc", label: "Low to High" },
  { value: "price-desc", label: "High to Low" },
];

const MIN_PRICE = 0;
const MAX_PRICE = 40000000; // ₹4,00,00,000 (4 Cr)
const PRICE_STEP = 50000;

export const DEFAULT_HOME_FILTERS: Required<
  Pick<HomeFilters, "bhk" | "furnished" | "bathrooms" | "minPrice" | "maxPrice" | "sortBy" | "city">
> = {
  bhk: "Any",
  furnished: "Any",
  bathrooms: "Any",
  minPrice: MIN_PRICE,
  maxPrice: MAX_PRICE,
  sortBy: "none",
  city: "Any",
};

type ExtraFilters = typeof DEFAULT_HOME_FILTERS;

function formatRupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function Chip<T extends string>({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full px-4 py-2 ${selected ? "bg-accent" : "bg-[#F2F2F2]"}`}
    >
      <Text className={`text-sm font-sans-medium ${selected ? "text-white" : "text-primary"}`}>
        {label}
      </Text>
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-3">
      <Text className="font-sans-semibold text-primary">{title}</Text>
      {children}
    </View>
  );
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: ExtraFilters;
  onApply: (filters: ExtraFilters) => void;
}

export function FilterModal({ visible, onClose, filters, onApply }: FilterModalProps) {
  const update = (partial: Partial<ExtraFilters>) => onApply({ ...filters, ...partial });
  const cities = useCities();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      <View className="gap-6 rounded-t-3xl bg-white px-5 pb-8 pt-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-sans-bold text-primary">Filters</Text>
          <Pressable onPress={() => onApply(DEFAULT_HOME_FILTERS)}>
            <Text className="font-sans-medium text-accent">Reset</Text>
          </Pressable>
        </View>

        <Section title="BHK">
          <View className="flex-row flex-wrap gap-2">
            {BHK_OPTIONS.map((option) => (
              <Chip
                key={option}
                label={option === "Any" ? "Any" : option === "Studio" ? "Studio" : `${option} BHK`}
                selected={filters.bhk === option}
                onPress={() => update({ bhk: option })}
              />
            ))}
          </View>
        </Section>

        <Section title="Area">
          <View className="flex-row flex-wrap gap-2">
            <Chip
              label="Any"
              selected={filters.city === "Any"}
              onPress={() => update({ city: "Any" })}
            />
            {cities.map((city) => (
              <Chip
                key={city}
                label={city}
                selected={filters.city === city}
                onPress={() => update({ city })}
              />
            ))}
          </View>
        </Section>

        <Section title="Price range">
          <Text className="text-sm text-primary/70">
            {formatRupees(filters.minPrice)} – {formatRupees(filters.maxPrice)}
          </Text>
          <RangeSlider
            range={[filters.minPrice, filters.maxPrice]}
            minimumValue={MIN_PRICE}
            maximumValue={MAX_PRICE}
            step={PRICE_STEP}
            inboundColor={colors.accent}
            outboundColor="#E5E5E5"
            thumbTintColor={colors.accent}
            trackHeight={4}
            thumbSize={20}
            onValueChange={([minPrice, maxPrice]) => update({ minPrice, maxPrice })}
          />
        </Section>

        <Section title="Furnished status">
          <View className="flex-row flex-wrap gap-2">
            {FURNISHED_OPTIONS.map((option) => (
              <Chip
                key={option}
                label={option}
                selected={filters.furnished === option}
                onPress={() => update({ furnished: option })}
              />
            ))}
          </View>
        </Section>

        <Section title="Bathrooms">
          <View className="flex-row flex-wrap gap-2">
            {BATHROOM_OPTIONS.map((option) => (
              <Chip
                key={option}
                label={option}
                selected={filters.bathrooms === option}
                onPress={() => update({ bathrooms: option })}
              />
            ))}
          </View>
        </Section>

        <Section title="Sort by price">
          <View className="flex-row flex-wrap gap-2">
            {SORT_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={filters.sortBy === option.value}
                onPress={() => update({ sortBy: option.value })}
              />
            ))}
          </View>
        </Section>

        <Pressable className="items-center rounded-full bg-accent py-4" onPress={onClose}>
          <Text className="font-sans-bold text-white">Apply</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
