import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors } from "../constants/Colors";

type ActiveTab = "home" | "appointments" | "messages" | "profile";
type MessageMode = "doctors" | "ai";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Shahad Abdulraheem",
    specialty: "Neurologist",
    lastMessage: "Your test results look good. Let's schedule a follow-up.",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Dr. Jana Alhamad",
    specialty: "Dermatologist",
    lastMessage: "Please apply the prescribed cream twice daily.",
    lastMessageTime: "1 hour ago",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "3",
    name: "Dr. Fajer Alhammadi",
    specialty: "Nutrition ",
    lastMessage: "You are doing great! Keep up the good work!",
    lastMessageTime: "Yesterday",
    unreadCount: 1,
    isOnline: false,
  },
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("messages");
  const [messageMode, setMessageMode] = useState<MessageMode>("doctors");
  const [uploadedFile, setUploadedFile] = useState<any>(null);

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
        // Stay on current page
        break;
      case "profile":
        router.push("/profile");
        break;
    }
  };

  const handleDoctorChat = (doctorId: string) => {
    router.push({
      pathname: "/messages/chat/[doctorId]",
      params: { doctorId },
    });
  };

  const handleUpload = async () => {
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
        setUploadedFile(result);
      }
    } catch (e) {
      Alert.alert("Error", "Could not open document picker.");
    }
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
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Toggle Switch */}
      <View
        style={[
          styles.toggleRow,
          {
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          },
        ]}
      >
        <View style={{ flexDirection: "row", flex: 1 }}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              messageMode === "doctors" && styles.toggleButtonActive,
            ]}
            onPress={() => setMessageMode("doctors")}
          >
            <Text
              style={[
                styles.toggleText,
                messageMode === "doctors" && styles.toggleTextActive,
              ]}
            >
              Doctors
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              messageMode === "ai" && styles.toggleButtonActive,
            ]}
            onPress={() => setMessageMode("ai")}
          >
            <Text
              style={[
                styles.toggleText,
                messageMode === "ai" && styles.toggleTextActive,
              ]}
            >
              AI Assistant
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => router.push("/messages/calls")}
        >
          <Ionicons name="call" size={24} color={AppColors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentArea}>
        {messageMode === "doctors" ? (
          <FlatList
            data={doctors}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.doctorCard}
                onPress={() => handleDoctorChat(item.id)}
              >
                <View style={styles.avatarWrapper}>
                  <View style={styles.avatarCircle}>
                    <Ionicons
                      name="person"
                      size={24}
                      color={AppColors.primary}
                    />
                  </View>
                  {item.isOnline && <View style={styles.onlineDot} />}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.doctorRow}>
                    <Text style={styles.doctorName}>{item.name}</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {item.lastMessageTime && (
                        <Text style={styles.lastMessageTime}>
                          {item.lastMessageTime}
                        </Text>
                      )}
                      {item.unreadCount && item.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadBadgeText}>
                            {item.unreadCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
                  {item.lastMessage && (
                    <Text style={styles.lastMessage}>{item.lastMessage}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.aiContainer}>
            {!uploadedFile ? (
              <View style={{ alignItems: "center" }}>
                <View style={styles.aiIconCircle}>
                  <Ionicons
                    name="document-text-outline"
                    size={40}
                    color={AppColors.primary}
                  />
                </View>
                <Text style={styles.aiTitle}>AI Medical Analysis</Text>
                <Text style={styles.aiSubtitle}>
                  Upload your medical report for analysis
                </Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleUpload}
                >
                  <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <Text style={styles.aiTitle}>Uploaded Document</Text>
                <Text style={styles.uploadedFileName}>{uploadedFile.name}</Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleUpload}
                >
                  <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

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
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    margin: 16,
    padding: 4,
  },
  toggleButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
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
  toggleButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    color: "#6b7280",
    fontWeight: "600",
    fontSize: 15,
  },
  toggleTextActive: {
    color: "#111827",
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  doctorCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  avatarWrapper: {
    marginRight: 14,
    position: "relative",
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#9EC6F3",
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "#fff",
  },
  doctorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  doctorName: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  lastMessageTime: {
    color: "#6b7280",
    fontSize: 12,
    marginLeft: 8,
  },
  unreadBadge: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  doctorSpecialty: {
    color: "#9EC6F3",
    fontSize: 13,
    marginTop: 2,
    marginBottom: 2,
  },
  lastMessage: {
    color: "#6b7280",
    fontSize: 13,
    marginTop: 2,
  },
  aiContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  aiIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#9EC6F3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
  },
  aiSubtitle: {
    color: "#6b7280",
    fontSize: 15,
    marginBottom: 18,
    textAlign: "center",
  },
  uploadButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#ef4444",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadedFileName: {
    color: "#374151",
    fontSize: 15,
    marginBottom: 12,
    textAlign: "center",
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
  aiCard: {
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: AppColors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.84,
    elevation: 8,
  },
  callButton: {
    marginLeft: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
