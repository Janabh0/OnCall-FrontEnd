import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors } from "../../../constants/Colors";

const doctorData: Record<string, { name: string; specialty: string }> = {
  "1": { name: "Dr. Ethan Carter", specialty: "Cardiologist" },
  "2": { name: "Dr. Sophia Hayes", specialty: "Dermatologist" },
  "3": { name: "Dr. Noah Bennett", specialty: "Pediatrician" },
  "4": { name: "Dr. Olivia Reed", specialty: "Neurologist" },
};

export default function DoctorChatPage() {
  const router = useRouter();
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();
  const doctor = doctorData[doctorId || "1"];
  const [input, setInput] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={AppColors.primary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.doctorName}>{doctor?.name || "Doctor"}</Text>
          <Text style={styles.doctorSpecialty}>{doctor?.specialty || ""}</Text>
        </View>
      </View>
      <View style={styles.chatArea}>
        <View style={styles.messageBubbleDoctor}>
          <Text style={styles.messageTextDoctor}>
            Hello! How can I help you today?
          </Text>
        </View>
        <View style={styles.messageBubbleUser}>
          <Text style={styles.messageTextUser}>
            Hi Doctor, I have a question about my prescription.
          </Text>
        </View>
      </View>
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#6b7280",
  },
  chatArea: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-end",
  },
  messageBubble: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    padding: 12,
    marginVertical: 4,
    maxWidth: "80%",
  },
  messageBubbleDoctor: {
    alignSelf: "flex-start",
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  messageTextDoctor: {
    color: "#111827",
    fontSize: 15,
  },
  messageBubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: AppColors.primary,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    maxWidth: "80%",
    shadowColor: AppColors.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  messageTextUser: {
    color: "#fff",
    fontSize: 15,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sendButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
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
  inputContainer: {
    backgroundColor: AppColors.primary,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
