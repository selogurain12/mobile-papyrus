import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  description: {
    fontSize: 13,
    color: "#6B7280",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  text: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },

  badge: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },

  badgeText: {
    fontSize: 12,
    color: "#374151",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  headerLeft: {
    flexDirection: "row",
    flex: 1,
    marginRight: 12,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  source: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  noteContainer: {
    backgroundColor: "#FEFCE8",
    borderLeftWidth: 4,
    borderLeftColor: "#FACC15",
    padding: 12,
    marginBottom: 16,
  },
  noteText: {
    fontSize: 13,
    color: "#854D0E",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  openButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  openButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  modalHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 12,
  },
});
