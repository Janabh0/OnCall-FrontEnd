import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AppColors } from "../constants/Colors";

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

  // Date picker state for date of birth selection
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  // Medical history file upload state
  const [uploadedMedicalFile, setUploadedMedicalFile] = useState<any>(null);

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

  // Date picker functions
  const handleDateConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    handleInputChange("dateOfBirth", formattedDate);
    setDatePickerVisible(false);
  };

  // Medical history file upload function
  const handleMedicalHistoryUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "image/*",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (!result.canceled) {
        setUploadedMedicalFile(result);
      }
    } catch (e) {
      Alert.alert("Error", "Could not open document picker.");
    }
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
    setDatePickerVisible(false);
    setUploadedMedicalFile(null);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // Handle logout logic here
          router.push("/auth");
        },
      },
    ]);
  };

  const renderTabIcon = (tabName: ActiveTab, iconName: string) => {
    const isActive = activeTab === tabName;
    return (
      <Ionicons
        name={iconName as any}
        size={24}
        color={isActive ? AppColors.primary : "#9ca3af"}
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
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#10b981" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color={AppColors.primary} />
            </View>
          </View>
          <View style={styles.profileInfoContainer}>
            <Text style={styles.profileName}>Dalal Mohammad</Text>
            <Text style={styles.profileRole}>Primary Care Physician</Text>
            <Text style={styles.profileJoined}>Joined 2025</Text>
          </View>
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={20} color={AppColors.primary} />
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>July 24, 1990</Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>Female</Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoLabel}>Blood Type</Text>
              <Text style={styles.infoValue}>O-Positive</Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>
                123 FreeZone St, Anytown, KWT
              </Text>
            </View>
          </View>
        </View>

        {/* Medical History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical History</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoLabel}>Allergies</Text>
              <Text style={styles.infoValue}>None</Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoLabel}>Conditions</Text>
              <Text style={styles.infoValue}>High Blood Pressure</Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoLabel}>Medications</Text>
              <Text style={styles.infoValue}>Aspirin, Lisinopril</Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoLabel}>Surgeries</Text>
              <Text style={styles.infoValue}>Appendectomy (2010)</Text>
            </View>
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
              <TouchableOpacity
                onPress={() => setDatePickerVisible(true)}
                style={styles.formInput}
              >
                <Text style={styles.formInputText}>
                  {patientForm.dateOfBirth || "Select date"}
                </Text>
                <Ionicons name="calendar" size={20} color="#9ca3af" />
              </TouchableOpacity>
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
              <View style={styles.medicalHistoryContainer}>
                <TextInput
                  style={[
                    styles.formInput,
                    styles.textArea,
                    styles.medicalHistoryInput,
                  ]}
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
                <TouchableOpacity
                  style={styles.uploadButtonInside}
                  onPress={handleMedicalHistoryUpload}
                >
                  <Ionicons name="cloud-upload" size={18} color="white" />
                </TouchableOpacity>
              </View>
              {uploadedMedicalFile && (
                <View style={styles.uploadedFileContainer}>
                  <Text style={styles.uploadedFileName}>
                    📎 {uploadedMedicalFile.name}
                  </Text>
                </View>
              )}
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
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={AppColors.primary}
                  />
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

          {/* Date Picker Modal */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={() => setDatePickerVisible(false)}
          />
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
    backgroundColor: AppColors.background,
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
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  logoutText: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
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
    backgroundColor: AppColors.surface,
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
    borderColor: "#E1EEBC",
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
    backgroundColor: AppColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: AppColors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    borderColor: "#E1EEBC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  formInputText: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    marginRight: 8,
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
    borderColor: "#E1EEBC",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "white",
  },
  pickerOptionSelected: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.surfaceLight,
  },
  pickerOptionText: {
    fontSize: 16,
    color: "#6b7280",
  },
  pickerOptionTextSelected: {
    color: AppColors.primary,
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
    borderColor: "#E1EEBC",
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
    backgroundColor: AppColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: AppColors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    color: AppColors.primary,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  infoGridItem: {
    width: "48%",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E1EEBC",
  },
  medicalHistoryContainer: {
    position: "relative",
  },
  medicalHistoryInput: {
    paddingRight: 50, // Make space for the upload button
  },
  uploadButtonInside: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -16 }], // Half of the button height (32/2)
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: AppColors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadedFileContainer: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: AppColors.surfaceLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  uploadedFileName: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontWeight: "500",
  },
});
