import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { createContext, useContext, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Favourites context
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

interface FavouritesContextType {
  favouriteDoctors: Doctor[];
  toggleFavourite: (doctor: Doctor) => void;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(
  undefined
);

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx)
    throw new Error("useFavourites must be used within FavouritesProvider");
  return ctx;
}

function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [favouriteDoctors, setFavouriteDoctors] = useState<Doctor[]>([]);
  const toggleFavourite = (doctor: Doctor) => {
    setFavouriteDoctors((prev) => {
      const isFav = prev.some((d) => d.id === doctor.id);
      return isFav ? prev.filter((d) => d.id !== doctor.id) : [...prev, doctor];
    });
  };
  return (
    <FavouritesContext.Provider value={{ favouriteDoctors, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <FavouritesProvider>
        <Stack>
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="homepage" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="appointments" options={{ headerShown: false }} />
          <Stack.Screen name="messages" options={{ headerShown: false }} />
          <Stack.Screen
            name="messages/chat/[doctorId]"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </FavouritesProvider>
    </ThemeProvider>
  );
}
