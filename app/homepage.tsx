import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ActiveTab = "home" | "appointments" | "messages" | "profile";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");

  const handleTabPress = (tab: ActiveTab) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        // Stay on current page
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

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <View style={styles.content}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.subtitleText}>Select a tab to navigate</Text>
          </View>
        );
      case "appointments":
        return (
          <View style={styles.content}>
            <Text style={styles.welcomeText}>Appointments</Text>
            <Text style={styles.subtitleText}>
              Your appointments will appear here
            </Text>
          </View>
        );
      case "messages":
        return (
          <View style={styles.content}>
            <Text style={styles.welcomeText}>Messages</Text>
            <Text style={styles.subtitleText}>
              Your messages will appear here
            </Text>
          </View>
        );
      case "profile":
        return (
          <View style={styles.content}>
            <Text style={styles.welcomeText}>Profile</Text>
            <Text style={styles.subtitleText}>
              Your profile information will appear here
            </Text>
          </View>
        );
      default:
        return null;
    }
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
      {/* Main Content Area */}
      <View style={styles.mainContent}>{renderContent()}</View>

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
    backgroundColor: "#f9fafb", // gray-50
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#9ca3af", // gray-400
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: "#6b7280", // gray-500
  },
  bottomNav: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb", // gray-200
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
    color: "#9ca3af", // gray-400
  },
  activeTabText: {
    color: "#ef4444", // red-500
  },
});
