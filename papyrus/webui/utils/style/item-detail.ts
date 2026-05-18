import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: { padding: 12 },

  emptyCard: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: { fontSize: 18, marginTop: 10 },
  emptySubtitle: { fontSize: 14, color: "#999" },

  header: { flexDirection: "row", marginBottom: 16 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  name: { fontSize: 20, fontWeight: "bold" },
  subtitle: { color: "#666" },

  roleRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  roleLabel: { marginRight: 6 },
  stars: { flexDirection: "row" },

  section: { marginBottom: 12 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  sectionTitle: { fontSize: 16, fontWeight: "bold" },

  sectionContent: {
    paddingLeft: 8,
    paddingBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  label: { fontWeight: "bold", marginRight: 4, minWidth: 110 },
  value: { color: "#444", flex: 1 },

  column: { marginBottom: 6 },

  badges: { flexDirection: "row", flexWrap: "wrap", gap: 6 },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: { color: "black" },
  contentContainer: {
    paddingBottom: 80,
  },
});
