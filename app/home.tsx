import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors } from "../constants/Colors";
import { useFavourites } from "./_layout";

type ActiveTab = "home" | "appointments" | "messages" | "profile";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  type: string;
  time: string;
  date: string;
}

// Accept favouriteDoctors as a prop for now (to be synced with appointments page)
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const { favouriteDoctors } = useFavourites();

  // Mock user data
  const userName = "Dalal";

  // Mock appointment data - set to null to show "no upcoming appointments"
  const nextAppointment: Appointment | null = {
    id: "1",
    doctorName: "Dr. Evelyn Reed",
    type: "General Checkup",
    time: "10:00 AM",
    date: "Today",
  };

  const handleTabPress = (tab: ActiveTab) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        break;
      case "appointments":
        router.push("/appointments");
        break;
      case "messages":
        router.push("/messages");
        break;
      case "profile":
        router.push("/profile");
        break;
    }
  };

  const handleBookAppointment = () => {
    router.push("/appointments");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with avatar and welcome text in a row */}
      <View style={styles.headerRow}>
        <View style={styles.avatarLarge}>
          <Ionicons name="person" size={24} color={AppColors.primary} />
        </View>
        <Text style={styles.welcomeTextRow}>Welcome back, {userName}</Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Next Appointment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Appointment</Text>
          {nextAppointment ? (
            <View style={styles.appointmentCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.appointmentDoctor}>
                  {nextAppointment.doctorName}
                </Text>
                <Text style={styles.appointmentDetails}>
                  {nextAppointment.type} · {nextAppointment.time}
                </Text>
              </View>
              <View style={styles.doctorImageWrapper}>
                <View style={styles.doctorAvatarPlaceholder}>
                  <Ionicons name="person" size={24} color={AppColors.primary} />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.noAppointmentCard}>
              <Text style={styles.noAppointmentText}>
                No upcoming appointments
              </Text>
            </View>
          )}
        </View>

        {/* Quick Access Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessRow}>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={handleBookAppointment}
            >
              <Text style={styles.bookButtonText}>Book Appointment</Text>
            </TouchableOpacity>
            <View style={styles.viewRecordsButton}>
              <TouchableOpacity onPress={() => router.push("/records")}>
                <Text style={styles.viewRecordsText}>View Records</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Favourite Doctors Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favourite Doctors</Text>
          {favouriteDoctors.length === 0 ? (
            <Text style={styles.noFavouritesText}>No favourite doctors</Text>
          ) : (
            favouriteDoctors.map((doctor) => (
              <View key={doctor.id} style={styles.doctorCard}>
                <View style={styles.doctorInfo}>
                  <View style={styles.doctorAvatar}>
                    <Ionicons
                      name="person"
                      size={24}
                      color={AppColors.primary}
                    />
                    <View style={styles.favouriteIndicator}>
                      <Ionicons name="heart" size={12} color="#FF6B6B" />
                    </View>
                  </View>
                  <View style={styles.doctorDetails}>
                    <Text style={styles.doctorName}>{doctor.name}</Text>
                    <Text style={styles.doctorSpecialty}>
                      {doctor.specialty}
                    </Text>
                  </View>
                </View>
                <View style={styles.favDoctorActions}>
                  <TouchableOpacity
                    style={styles.favDoctorButton}
                    onPress={() =>
                      router.push({
                        pathname: "/messages/chat/[doctorId]",
                        params: { doctorId: doctor.id },
                      })
                    }
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={18}
                      color={AppColors.primary}
                    />
                    <Text style={styles.favDoctorButtonText}>Chat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.favDoctorButton}
                    onPress={() =>
                      router.push({
                        pathname: "/appointments",
                        params: { doctorId: doctor.id },
                      })
                    }
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={AppColors.primary}
                    />
                    <Text style={styles.favDoctorButtonText}>Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.tabContainer}>
          {/* Home */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabPress("home")}
          >
            <Ionicons
              name="home"
              size={24}
              color={activeTab === "home" ? AppColors.primary : "#9ca3af"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "home" && styles.activeTabText,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          {/* Appointments */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabPress("appointments")}
          >
            <Ionicons
              name="calendar"
              size={24}
              color={
                activeTab === "appointments" ? AppColors.primary : "#9ca3af"
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "appointments" && styles.activeTabText,
              ]}
            >
              Appointments
            </Text>
          </TouchableOpacity>

          {/* Messages */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabPress("messages")}
          >
            <Ionicons
              name="chatbubble"
              size={24}
              color={activeTab === "messages" ? AppColors.primary : "#9ca3af"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "messages" && styles.activeTabText,
              ]}
            >
              Messages
            </Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabPress("profile")}
          >
            <Ionicons
              name="person"
              size={24}
              color={activeTab === "profile" ? AppColors.primary : "#9ca3af"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "profile" && styles.activeTabText,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  avatarLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: AppColors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeTextRow: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 10,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: AppColors.background,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  appointmentCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
  },
  appointmentDoctor: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
    marginBottom: 2,
  },
  appointmentDetails: {
    color: "#374151",
    fontSize: 13,
  },
  doctorImageWrapper: {
    width: 56,
    height: 56,
    backgroundColor: AppColors.secondary,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  doctorAvatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  doctorImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  noAppointmentCard: {
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  noAppointmentText: {
    color: "#6b7280",
    fontSize: 14,
  },
  quickAccessRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bookButton: {
    flex: 1,
    backgroundColor: AppColors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
    shadowColor: AppColors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  viewRecordsButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 8,
  },
  viewRecordsText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
  },
  noFavouritesText: {
    color: "#6b7280",
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
  },
  doctorCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  favouriteIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#6b7280",
  },
  bottomNav: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    maxWidth: 400,
    alignSelf: "center",
  },
  tab: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
    color: "#9ca3af",
  },
  activeTabText: {
    color: AppColors.primary,
  },
  favDoctorActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 12,
  },
  favDoctorButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.surfaceLight,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  favDoctorButtonText: {
    color: AppColors.primary,
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },
});
