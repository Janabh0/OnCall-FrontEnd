import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AppColors } from "../constants/Colors";

type ActiveTab = "login" | "register";

interface FormData {
  civilId: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  birthDay: string;
  bloodType: string;
  height: string;
  weight: string;
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("login");
  const [formData, setFormData] = useState<FormData>({
    civilId: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    gender: "",
    birthDay: "",
    bloodType: "",
    height: "",
    weight: "",
  });
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateConfirm = (date: Date) => {
    handleInputChange("birthDay", date.toISOString().split("T")[0]);
    setDatePickerVisible(false);
  };

  const handleLogin = () => {
    // Handle login logic here
    console.log("Login:", {
      civilId: formData.civilId,
      password: formData.password,
    });
    router.push("/home");
  };

  const handleRegister = () => {
    // Handle register logic here
    console.log("Register:", formData);
    router.push("/home");
  };

  const renderLoginForm = () => (
    <View style={styles.form}>
      <View style={styles.inputGroup}>
        <Label>Civil ID</Label>
        <Input
          value={formData.civilId}
          onChangeText={(value) => handleInputChange("civilId", value)}
          placeholder="Enter your Civil ID"
        />
      </View>

      <View style={styles.inputGroup}>
        <Label>Password</Label>
        <Input
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>

      <Button title="Login" onPress={handleLogin} style={styles.submitButton} />

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRegisterForm = () => (
    <View style={styles.form}>
      {/* Required Fields */}
      <View style={styles.inputGroup}>
        <Label>Full Name *</Label>
        <Input
          value={formData.fullName}
          onChangeText={(value) => handleInputChange("fullName", value)}
          placeholder="Enter your full name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Label>Civil ID *</Label>
        <Input
          value={formData.civilId}
          onChangeText={(value) => handleInputChange("civilId", value)}
          placeholder="Enter your Civil ID"
        />
      </View>

      <View style={styles.inputGroup}>
        <Label>Phone Number *</Label>
        <Input
          value={formData.phoneNumber}
          onChangeText={(value) => handleInputChange("phoneNumber", value)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Label>Password *</Label>
        <Input
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Label>Confirm Password *</Label>
        <Input
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange("confirmPassword", value)}
          placeholder="Confirm your password"
          secureTextEntry
        />
      </View>

      {/* Optional Fields Divider */}
      <View style={styles.divider}>
        <Text style={styles.dividerText}>Optional Information</Text>
      </View>

      <View style={styles.inputGroup}>
        <Label>Email</Label>
        <Input
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          placeholder="Enter your email address"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Label>Gender</Label>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={[
            { label: "Select gender", value: "" },
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select gender"
          searchPlaceholder="Search..."
          value={formData.gender}
          onChange={(item: any) => handleInputChange("gender", item.value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Label>Date of Birth</Label>
        <TouchableOpacity
          onPress={() => setDatePickerVisible(true)}
          style={styles.datePickerInput}
        >
          <Text
            style={{
              color: formData.birthDay ? "#111827" : "#9ca3af",
              fontSize: 16,
            }}
          >
            {formData.birthDay || "Select date"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Label>Blood Type</Label>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={[
            { label: "Select blood type", value: "" },
            { label: "A+", value: "A+" },
            { label: "A-", value: "A-" },
            { label: "B+", value: "B+" },
            { label: "B-", value: "B-" },
            { label: "AB+", value: "AB+" },
            { label: "AB-", value: "AB-" },
            { label: "O+", value: "O+" },
            { label: "O-", value: "O-" },
          ]}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select blood type"
          searchPlaceholder="Search..."
          value={formData.bloodType}
          onChange={(item: any) => handleInputChange("bloodType", item.value)}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Label>Height (cm)</Label>
          <Input
            value={formData.height}
            onChangeText={(value) => handleInputChange("height", value)}
            placeholder="170"
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Label>Weight (kg)</Label>
          <Input
            value={formData.weight}
            onChangeText={(value) => handleInputChange("weight", value)}
            placeholder="70"
            keyboardType="numeric"
          />
        </View>
      </View>

      <Button
        title="Register"
        onPress={handleRegister}
        style={styles.submitButton}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome!</Text>
          <Text style={styles.welcomeSubtitle}>
            {activeTab === "login"
              ? "Sign in to your account"
              : "Create a new account"}
          </Text>
        </View>
        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "login" && styles.activeTab]}
            onPress={() => setActiveTab("login")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "login" && styles.activeTabText,
              ]}
            >
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "register" && styles.activeTab]}
            onPress={() => setActiveTab("register")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "register" && styles.activeTabText,
              ]}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "login" ? renderLoginForm() : renderRegisterForm()}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background,
    paddingHorizontal: 24,
    paddingBottom: 32,
    minHeight: "100%",
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 48,
    paddingHorizontal: 24,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: AppColors.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: AppColors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  tabRow: {
    flexDirection: "row",
    marginBottom: 32,
    borderRadius: 12,
    backgroundColor: AppColors.surface,
    overflow: "hidden",
    marginHorizontal: 24,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
    borderBottomWidth: 3,
    borderBottomColor: AppColors.primary,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "600",
  },
  activeTabText: {
    color: AppColors.primary,
    fontWeight: "600",
  },
  form: {
    paddingHorizontal: 0,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  submitButton: {
    marginTop: 8,
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#6b7280", // gray-600
  },
  divider: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb", // gray-200
    marginBottom: 16,
  },
  dividerText: {
    fontSize: 14,
    color: "#6b7280", // gray-600
  },
  dropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#9ca3af", // gray-400
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#111827", // gray-900
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  termsContainer: {
    paddingTop: 32,
    alignItems: "center",
  },
  termsText: {
    fontSize: 12,
    color: "#6b7280", // gray-500
    textAlign: "center",
  },
  termsLink: {
    color: "#374151", // gray-700
    textDecorationLine: "underline",
  },
  datePickerInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginTop: 4,
  },
  inputFocused: {
    borderBottomColor: AppColors.primary,
  },
});
