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

interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  emailAddress: string;
  medicalHistory: string;
  specialCareInstructions: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientForm, setPatientForm] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    emailAddress: "",
    medicalHistory: "",
    specialCareInstructions: "",
    confirmed: false,
  });

  const handleTabPress = (tab: ActiveTab) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        router.push("/home");
        break;
      case "appointments":
        router.push("/appointments");
        break;
      case "messages":
        router.push("/messages");
        break;
      case "profile":
        // Stay on current page
        break;
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setPatientForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddPatient = () => {
    if (!patientForm.confirmed) {
      Alert.alert(
        "Confirmation Required",
        "Please confirm that you are registering this person under your caregiving responsibility"
      );
      return;
    }

    if (
      !patientForm.fullName ||
      !patientForm.dateOfBirth ||
      !patientForm.gender ||
      !patientForm.contactNumber
    ) {
      Alert.alert("Required Fields", "Please fill in all required fields");
      return;
    }

    const newPatient: Patient = {
      id: Date.now().toString(),
      fullName: patientForm.fullName,
      dateOfBirth: patientForm.dateOfBirth,
      gender: patientForm.gender,
      contactNumber: patientForm.contactNumber,
      emailAddress: patientForm.emailAddress,
      medicalHistory: patientForm.medicalHistory,
      specialCareInstructions: patientForm.specialCareInstructions,
    };

    setPatients((prev) => [...prev, newPatient]);
    setShowModal(false);
    setPatientForm({
      fullName: "",
      dateOfBirth: "",
      gender: "",
      contactNumber: "",
      emailAddress: "",
      medicalHistory: "",
      specialCareInstructions: "",
      confirmed: false,
    });
  };

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
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Profile Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#f97316" />
            </View>
          </View>
          <View style={styles.profileInfoContainer}>
            <Text style={styles.profileName}>Dr. Amelia Harper</Text>
            <Text style={styles.profileRole}>Primary Care Physician</Text>
            <Text style={styles.profileJoined}>Joined 2021</Text>
          </View>
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>July 15, 1985</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>Female</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Blood Type</Text>
            <Text style={styles.infoValue}>O-Positive</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>123 Health St, Anytown, USA</Text>
          </View>
        </View>

        {/* Medical History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical History</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Allergies</Text>
            <Text style={styles.infoValue}>None</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Conditions</Text>
            <Text style={styles.infoValue}>High Blood Pressure</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Medications</Text>
            <Text style={styles.infoValue}>Aspirin, Lisinopril</Text>
          </View>
        </View>

        {/* Patients Under Care */}
        {patients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>People Under My Care</Text>
            {patients.map((patient) => (
              <View key={patient.id} style={styles.patientCard}>
                <Text style={styles.patientName}>{patient.fullName}</Text>
                <View style={styles.patientInfo}>
                  <View style={styles.patientInfoRow}>
                    <Text style={styles.patientInfoLabel}>DOB:</Text>
                    <Text style={styles.patientInfoValue}>
                      {patient.dateOfBirth}
                    </Text>
                  </View>
                  <View style={styles.patientInfoRow}>
                    <Text style={styles.patientInfoLabel}>Gender:</Text>
                    <Text style={styles.patientInfoValue}>
                      {patient.gender}
                    </Text>
                  </View>
                  <View style={styles.patientInfoRow}>
                    <Text style={styles.patientInfoLabel}>Contact:</Text>
                    <Text style={styles.patientInfoValue}>
                      {patient.contactNumber}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.careButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.careButtonText}>I am a person in care</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
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
            <Text style={styles.modalTitle}>Add New Patient</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="close" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Patient's Full Name *</Text>
              <TextInput
                style={styles.formInput}
                value={patientForm.fullName}
                onChangeText={(value) => handleInputChange("fullName", value)}
                placeholder="Enter full name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date of Birth *</Text>
              <TextInput
                style={styles.formInput}
                value={patientForm.dateOfBirth}
                onChangeText={(value) =>
                  handleInputChange("dateOfBirth", value)
                }
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Gender *</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    patientForm.gender === "male" &&
                      styles.pickerOptionSelected,
                  ]}
                  onPress={() => handleInputChange("gender", "male")}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      patientForm.gender === "male" &&
                        styles.pickerOptionTextSelected,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    patientForm.gender === "female" &&
                      styles.pickerOptionSelected,
                  ]}
                  onPress={() => handleInputChange("gender", "female")}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      patientForm.gender === "female" &&
                        styles.pickerOptionTextSelected,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Contact Number *</Text>
              <TextInput
                style={styles.formInput}
                value={patientForm.contactNumber}
                onChangeText={(value) =>
                  handleInputChange("contactNumber", value)
                }
                placeholder="Enter contact number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email Address</Text>
              <TextInput
                style={styles.formInput}
                value={patientForm.emailAddress}
                onChangeText={(value) =>
                  handleInputChange("emailAddress", value)
                }
                placeholder="Enter email address"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Medical History</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={patientForm.medicalHistory}
                onChangeText={(value) =>
                  handleInputChange("medicalHistory", value)
                }
                placeholder="Enter medical history"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Special Care Instructions</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={patientForm.specialCareInstructions}
                onChangeText={(value) =>
                  handleInputChange("specialCareInstructions", value)
                }
                placeholder="Enter special care instructions"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Fixed Bottom Section */}
          <View style={styles.modalBottomSection}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() =>
                  handleInputChange("confirmed", !patientForm.confirmed)
                }
              >
                {patientForm.confirmed && (
                  <Ionicons name="checkmark" size={16} color="#ef4444" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                I confirm that I am registering this person under my caregiving
                responsibility
              </Text>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddPatient}
            >
              <Text style={styles.submitButtonText}>Register Patient</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    position: "relative",
  },
  avatarContainer: {
    marginRight: 16,
  },
  profileInfoContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  editIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 8,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fed7aa",
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  profileJoined: {
    fontSize: 12,
    color: "#9ca3af",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#6b7280",
  },
  patientCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 8,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 8,
  },
  patientInfo: {
    gap: 4,
  },
  patientInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientInfoLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginRight: 4,
  },
  patientInfoValue: {
    fontSize: 12,
    color: "#6b7280",
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
  },
  careButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  careButtonText: {
    color: "white",
    fontSize: 16,
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
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalBottomSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "white",
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "white",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  pickerContainer: {
    flexDirection: "row",
    gap: 8,
  },
  pickerOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "white",
  },
  pickerOptionSelected: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  pickerOptionText: {
    fontSize: 16,
    color: "#6b7280",
  },
  pickerOptionTextSelected: {
    color: "#ef4444",
    fontWeight: "500",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
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
