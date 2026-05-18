import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  colors: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  color: {
    width: 24,
    height: 24,
    borderRadius: 999,
  },
  colorActive: {
    borderWidth: 2,
    borderColor: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#111827",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10,
  },

  tagInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  tagInput: {
    flex: 1,
    marginBottom: 0,
  },

  addButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    marginBottom: 16,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    marginTop: 16,
  },
  uploadButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#374151",
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
  },

  header: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 22,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 28,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  avatarText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
  },

  cancelButton: {
    backgroundColor: "#E5E7EB",
    marginRight: 8,
  },

  deleteButton: {
    backgroundColor: "#DC2626",
    marginLeft: 8,
  },

  cancelText: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 16,
  },

  deleteText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemInfos: {
    flex: 1,
  },

  itemName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  itemDescription: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 14,
  },
  textarea: {
    minHeight: 120,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  badge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
  },

  badgeSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#DBEAFE",
  },

  badgeText: {
    color: "#374151",
    fontWeight: "600",
    marginLeft: 8,
    flexShrink: 1,
  },

  badgeTextSelected: {
    color: "#1D4ED8",
  },
  tagsImportanceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  tagImportance: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },

  tagImportanceActive: {
    borderColor: "#2563EB",
    backgroundColor: "#DBEAFE",
  },

  tagImportanceText: {
    color: "#374151",
    fontWeight: "600",
  },

  tagImportanceTextActive: {
    color: "#1D4ED8",
  },

  bold: {
    fontWeight: "700",
    color: "#111827",
  },
  existingFile: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
  },

  existingFileLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  existingFileName: {
    color: "#111827",
    fontWeight: "600",
  },

  fileActions: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "flex-end",
  },
  openText: {
    color: "#2563EB",
    marginRight: 20,
    fontWeight: "600",
  },
});
