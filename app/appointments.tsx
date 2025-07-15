import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ActiveTab = "home" | "appointments" | "messages" | "profile";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DurationOption {
  duration: string;
  price: number;
}

const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Ethan Carter",
    specialty: "Cardiologist",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "2",
    name: "Dr. Sophia Hayes",
    specialty: "Dermatologist",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "3",
    name: "Dr. Noah Bennett",
    specialty: "Pediatrician",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "4",
    name: "Dr. Olivia Reed",
    specialty: "Neurologist",
    image: "/placeholder.svg?height=50&width=50",
  },
];

const timeSlots: TimeSlot[] = [
  { time: "9:00 AM", available: true },
  { time: "9:30 AM", available: true },
  { time: "10:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: true },
  { time: "11:30 AM", available: true },
  { time: "1:00 PM", available: true },
  { time: "1:30 PM", available: true },
  { time: "2:00 PM", available: true },
  { time: "2:30 PM", available: true },
];

const durationOptions: DurationOption[] = [
  { duration: "30 min", price: 15 },
  { duration: "1 hour", price: 30 },
  { duration: "1.5 hours", price: 45 },
  { duration: "2 hours", price: 60 },
];

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("appointments");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [sessionType, setSessionType] = useState<"offline" | "online" | "">("");
  const [selectedDuration, setSelectedDuration] =
    useState<DurationOption | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Calendar date handling
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const specialties = [
    "All",
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Neurologist",
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty =
      selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const handleTabPress = (tab: ActiveTab) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        router.push("/home");
        break;
      case "appointments":
        // Stay on current page
        break;
      case "messages":
        router.push("/messages");
        break;
      case "profile":
        router.push("/profile");
        break;
    }
  };

  const handleBookDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleBookAppointment = () => {
    if (selectedDoctor && selectedDate && selectedTime && sessionType) {
      if (!selectedDuration) {
        Alert.alert("Selection Required", "Please select a meeting duration");
        return;
      }

      setShowModal(false);
      setShowSuccessPopup(true);

      // Auto-hide success popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        setSelectedTime("");
        setSessionType("");
        setSelectedDuration(null);
      }, 3000);
    } else {
      Alert.alert(
        "Selection Required",
        "Please select a date, time, and session type"
      );
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const selectedDateObj = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(selectedDateObj);
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate || !day) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const calendarDays = generateCalendarDays(currentMonth);

  const renderTabIcon = (tabName: ActiveTab, iconName: string) => {
    const isActive = activeTab === tabName;
    return (
      <Ionicons
        name={iconName as any}
        size={24}
        color={isActive ? "#ef4444" : "#9ca3af"}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#9ca3af"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search specialists"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Specialists Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialists</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.specialtyContainer}
          >
            {specialties.map((specialty) => (
              <TouchableOpacity
                key={specialty}
                style={[
                  styles.specialtyButton,
                  selectedSpecialty === specialty &&
                    styles.specialtyButtonSelected,
                ]}
                onPress={() => setSelectedSpecialty(specialty)}
              >
                <Text
                  style={[
                    styles.specialtyButtonText,
                    selectedSpecialty === specialty &&
                      styles.specialtyButtonTextSelected,
                  ]}
                >
                  {specialty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Doctors List */}
        <View style={styles.doctorsList}>
          {filteredDoctors.map((doctor) => (
            <View key={doctor.id} style={styles.doctorCard}>
              <View style={styles.doctorInfo}>
                <View style={styles.doctorAvatar}>
                  <Ionicons name="person" size={24} color="#6b7280" />
                </View>
                <View style={styles.doctorDetails}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBookDoctor(doctor)}
              >
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalBackButton}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="arrow-back" size={20} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Book Appointment</Text>
            <View style={styles.modalHeaderSpacer} />
          </View>

          {/* Modal Content */}
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Doctor Info */}
            {selectedDoctor && (
              <View style={styles.doctorInfoModal}>
                <View style={styles.doctorAvatarModal}>
                  <Ionicons name="person" size={28} color="white" />
                </View>
                <View style={styles.doctorDetailsModal}>
                  <Text style={styles.doctorNameModal}>
                    {selectedDoctor.name}
                  </Text>
                  <Text style={styles.doctorSpecialtyModal}>
                    {selectedDoctor.specialty}
                  </Text>
                </View>
              </View>
            )}

            {/* Select Date */}
            <View style={styles.calendarSection}>
              <Text style={styles.calendarTitle}>Select Date</Text>

              {/* Custom Calendar Component */}
              <View style={styles.calendarContainer}>
                <View style={styles.calendarHeader}>
                  <TouchableOpacity onPress={goToPreviousMonth}>
                    <Ionicons name="chevron-back" size={24} color="#6b7280" />
                  </TouchableOpacity>
                  <Text style={styles.calendarMonthYear}>
                    {formatMonthYear(currentMonth)}
                  </Text>
                  <TouchableOpacity onPress={goToNextMonth}>
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.calendarGrid}>
                  {/* Days of the week */}
                  <View style={styles.calendarDayNames}>
                    <Text style={styles.calendarDayName}>Sun</Text>
                    <Text style={styles.calendarDayName}>Mon</Text>
                    <Text style={styles.calendarDayName}>Tue</Text>
                    <Text style={styles.calendarDayName}>Wed</Text>
                    <Text style={styles.calendarDayName}>Thu</Text>
                    <Text style={styles.calendarDayName}>Fri</Text>
                    <Text style={styles.calendarDayName}>Sat</Text>
                  </View>
                  {/* Calendar days */}
                  <View style={styles.calendarDays}>
                    {calendarDays.map((day, index) => {
                      const isSelected = day ? isDateSelected(day) : false;
                      const isTodayDate = day ? isToday(day) : false;

                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.calendarDay,
                            isSelected && styles.calendarDaySelected,
                            isTodayDate && styles.calendarDayToday,
                          ]}
                          onPress={() => day && handleDateSelect(day)}
                          disabled={!day}
                        >
                          <Text
                            style={[
                              styles.calendarDayText,
                              isSelected && styles.calendarDayTextSelected,
                              isTodayDate && styles.calendarDayTextToday,
                            ]}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>

            {/* Available Times */}
            <View style={styles.timesSection}>
              <Text style={styles.timesTitle}>Available Times</Text>
              <View style={styles.timeSlots}>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.time}
                    style={[
                      styles.timeSlot,
                      selectedTime === slot.time && styles.timeSlotSelected,
                    ]}
                    onPress={() => setSelectedTime(slot.time)}
                    disabled={!slot.available}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        selectedTime === slot.time &&
                          styles.timeSlotTextSelected,
                      ]}
                    >
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Session Type */}
            <View style={styles.sessionSection}>
              <Text style={styles.sessionTitle}>Session Type</Text>
              <View style={styles.sessionTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.sessionTypeButton,
                    sessionType === "offline" &&
                      styles.sessionTypeButtonSelected,
                  ]}
                  onPress={() => setSessionType("offline")}
                >
                  <Text
                    style={[
                      styles.sessionTypeText,
                      sessionType === "offline" &&
                        styles.sessionTypeTextSelected,
                    ]}
                  >
                    Offline
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sessionTypeButton,
                    sessionType === "online" &&
                      styles.sessionTypeButtonSelected,
                  ]}
                  onPress={() => setSessionType("online")}
                >
                  <Text
                    style={[
                      styles.sessionTypeText,
                      sessionType === "online" &&
                        styles.sessionTypeTextSelected,
                    ]}
                  >
                    Online
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Meeting Duration (for both offline and online sessions) */}
            {sessionType && (
              <View style={styles.durationSection}>
                <Text style={styles.durationTitle}>Meeting Duration</Text>
                <View style={styles.durationContainer}>
                  {durationOptions.map((option) => (
                    <TouchableOpacity
                      key={option.duration}
                      style={[
                        styles.durationButton,
                        selectedDuration?.duration === option.duration &&
                          styles.durationButtonSelected,
                      ]}
                      onPress={() => setSelectedDuration(option)}
                    >
                      <Text
                        style={[
                          styles.durationText,
                          selectedDuration?.duration === option.duration &&
                            styles.durationTextSelected,
                        ]}
                      >
                        {option.duration}
                      </Text>
                      <Text
                        style={[
                          styles.durationPrice,
                          selectedDuration?.duration === option.duration &&
                            styles.durationPriceSelected,
                        ]}
                      >
                        {option.price} KWD
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Book Button */}
          <View style={styles.modalBottomSection}>
            <TouchableOpacity
              style={styles.bookAppointmentButton}
              onPress={handleBookAppointment}
            >
              <Text style={styles.bookAppointmentButtonText}>
                Book Appointment
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Success Popup */}
      <Modal visible={showSuccessPopup} transparent={true} animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successPopup}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark" size={40} color="white" />
            </View>

            <Text style={styles.successTitle}>🎉 Booked!</Text>
            <Text style={styles.successMessage}>
              Your appointment with{" "}
              <Text style={styles.successDoctorName}>
                {selectedDoctor?.name}
              </Text>{" "}
              has been successfully booked!
            </Text>

            <View style={styles.appointmentDetails}>
              <Text style={styles.appointmentDetail}>
                <Text style={styles.appointmentDetailLabel}>
                  📅{" "}
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : ""}
                </Text>
              </Text>
              <Text style={styles.appointmentDetail}>
                <Text style={styles.appointmentDetailLabel}>
                  🕐 {selectedTime}
                </Text>
              </Text>
              <Text style={styles.appointmentDetail}>
                <Text style={styles.appointmentDetailLabel}>
                  💻{" "}
                  {sessionType === "online"
                    ? "Online Session"
                    : "Offline Session"}
                </Text>
              </Text>
              {selectedDuration && (
                <Text style={styles.appointmentDetail}>
                  <Text style={styles.appointmentDetailLabel}>
                    ⏱️ {selectedDuration.duration} - {selectedDuration.price}{" "}
                    KWD
                  </Text>
                </Text>
              )}
            </View>

            <Text style={styles.successFooter}>
              We'll send you a reminder soon! 💌
            </Text>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.tabContainer}>
          {/* Home */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabPress("home")}
          >
            {renderTabIcon("home", "home")}
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
            {renderTabIcon("appointments", "calendar")}
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
            {renderTabIcon("messages", "chatbubble")}
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
            {renderTabIcon("profile", "person")}
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
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  headerSpacer: {
    width: 32,
  },
  searchContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  specialtyContainer: {
    marginBottom: 8,
  },
  specialtyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    marginRight: 8,
  },
  specialtyButtonSelected: {
    backgroundColor: "#ef4444",
  },
  specialtyButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  specialtyButtonTextSelected: {
    color: "white",
  },
  doctorsList: {
    gap: 12,
  },
  doctorCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
  bookButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalBackButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  modalHeaderSpacer: {
    width: 28,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  doctorInfoModal: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  doctorAvatarModal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  doctorDetailsModal: {
    flex: 1,
  },
  doctorNameModal: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  doctorSpecialtyModal: {
    fontSize: 16,
    color: "#6b7280",
  },
  calendarSection: {
    marginBottom: 24,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  calendarContainer: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  calendarMonthYear: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  calendarGrid: {
    // gridTemplateColumns: "repeat(7, 1fr)", // For CSS Grid
    // gridTemplateRows: "repeat(6, 1fr)", // For CSS Grid
  },
  calendarDayNames: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  calendarDayName: {
    fontSize: 12,
    color: "#6b7280",
  },
  calendarDays: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  calendarDay: {
    width: "14.28%", // 1/7 of the grid
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  calendarDaySelected: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
  },
  calendarDayToday: {
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
  },
  calendarDayText: {
    fontSize: 14,
    color: "#374151",
  },
  calendarDayTextSelected: {
    color: "white",
  },
  calendarDayTextToday: {
    color: "#111827",
  },
  timesSection: {
    marginBottom: 24,
  },
  timesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  timeSlots: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timeSlot: {
    flex: 1,
    minWidth: "45%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  timeSlotSelected: {
    backgroundColor: "#ef4444",
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  timeSlotTextSelected: {
    color: "white",
  },
  modalBottomSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "white",
  },
  bookAppointmentButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  bookAppointmentButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  successPopup: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 32,
    maxWidth: 320,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 24,
  },
  successDoctorName: {
    fontWeight: "600",
    color: "#111827",
  },
  appointmentDetails: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: "100%",
  },
  appointmentDetail: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  appointmentDetailLabel: {
    fontWeight: "600",
  },
  successFooter: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
    textAlign: "center",
  },
  sessionSection: {
    marginBottom: 24,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  sessionTypeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  sessionTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  sessionTypeButtonSelected: {
    backgroundColor: "#ef4444",
  },
  sessionTypeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  sessionTypeTextSelected: {
    color: "white",
  },
  durationSection: {
    marginBottom: 24,
  },
  durationTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  durationContainer: {
    gap: 12,
  },
  durationButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationButtonSelected: {
    backgroundColor: "#ef4444",
  },
  durationText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  durationTextSelected: {
    color: "white",
  },
  durationPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  durationPriceSelected: {
    color: "white",
  },
  bottomNav: {
    backgroundColor: "white",
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
    color: "#ef4444",
  },
});
