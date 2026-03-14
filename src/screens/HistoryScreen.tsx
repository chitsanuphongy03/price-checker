import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  getFont,
} from "../constants/theme";
import { useLanguage } from "../hooks/useLanguage";
import { useHistory } from "../hooks/useStorage";
import { HistoryItem } from "../types/promotion";
import { formatPrice } from "../utils/priceCalculator";

import { RootStackParamList } from "../navigation/AppNavigator";

export function HistoryScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t, isThai } = useLanguage();
  const { history, loading, deleteItem, clearAll, updateName, toggleSaved, refresh } =
    useHistory();

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      t("delete") || "Delete",
      t("confirmDelete") || "Are you sure?",
      [
        { text: t("cancel") || "Cancel", style: "cancel" },
        {
          text: t("delete") || "Delete",
          style: "destructive",
          onPress: () => deleteItem(id),
        },
      ],
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      t("clearAll") || "Clear All",
      t("confirmClearAll") || "Delete all history?",
      [
        { text: t("cancel") || "Cancel", style: "cancel" },
        {
          text: t("delete") || "Delete",
          style: "destructive",
          onPress: () => clearAll(),
        },
      ],
    );
  };

  const startEdit = (item: HistoryItem) => {
    setEditingItem(item.id);
    setEditName(item.name);
  };

  const saveEdit = () => {
    if (editingItem && editName.trim()) {
      updateName(editingItem, editName.trim());
      setEditingItem(null);
      setEditName("");
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditName("");
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() =>
        navigation.navigate("HistoryDetail", { historyId: item.id })
      }
    >
      <View style={styles.itemContent}>
        {editingItem === item.id ? (
          <View style={styles.editContainer}>
            <TextInput
              style={[
                styles.editInput,
                { fontFamily: getFont("regular", isThai) },
              ]}
              value={editName}
              onChangeText={setEditName}
              autoFocus
              onSubmitEditing={saveEdit}
            />
            <View style={styles.editButtons}>
              <TouchableOpacity onPress={saveEdit} style={styles.editButton}>
                <Ionicons name="checkmark" size={20} color={Colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelEdit} style={styles.editButton}>
                <Ionicons name="close" size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.itemHeader}>
              <Text
                style={[
                  styles.itemName,
                  { fontFamily: getFont("semiBold", isThai) },
                ]}
              >
                {item.name}
              </Text>
              <TouchableOpacity
                onPress={() => startEdit(item)}
                style={styles.editIcon}
              >
                <Ionicons name="pencil-outline" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.itemDate,
                { fontFamily: getFont("regular", isThai) },
              ]}
            >
              {new Date(item.timestamp).toLocaleDateString()}
            </Text>
            {item.winner && (
              <View style={styles.winnerRow}>
                <Ionicons name="trophy" size={12} color={Colors.accent} />
                <Text
                  style={[
                    styles.winnerText,
                    { fontFamily: getFont("medium", isThai) },
                  ]}
                >
                  {item.winner.name}
                </Text>
                <Text
                  style={[
                    styles.savingsText,
                    { fontFamily: getFont("regular", isThai) },
                  ]}
                >
                  {t("saved")} {formatPrice(item.winner.price)}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {editingItem !== item.id && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleSaved(item.id)}
          >
            <Ionicons 
              name={item.isSaved ? "heart" : "heart-outline"} 
              size={20} 
              color={item.isSaved ? Colors.error : Colors.textMuted} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { fontFamily: getFont("bold", isThai) }]}>
          {t("history")}
        </Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text
              style={[
                styles.clearText,
                { fontFamily: getFont("medium", isThai) },
              ]}
            >
              {t("clearAll")}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <Text style={{ fontFamily: getFont("regular", isThai) }}>
            {t("loading")}
          </Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="time-outline" size={48} color={Colors.textMuted} />
          <Text
            style={[
              styles.emptyText,
              { fontFamily: getFont("medium", isThai) },
            ]}
          >
            {t("noHistory")}
          </Text>
          <Text
            style={[
              styles.emptySubtext,
              { fontFamily: getFont("regular", isThai) },
            ]}
          >
            {t("startComparing")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: 28,
    color: Colors.text,
  },
  clearText: {
    fontSize: 14,
    color: Colors.error,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  list: {
    padding: Spacing.lg,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  editIcon: {
    padding: Spacing.xs,
  },
  itemDate: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  winnerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  winnerText: {
    fontSize: 13,
    color: Colors.accent,
    marginLeft: Spacing.xs,
    marginRight: Spacing.sm,
  },
  savingsText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    fontSize: 16,
    backgroundColor: Colors.background,
  },
  editButtons: {
    flexDirection: "row",
    marginLeft: Spacing.sm,
  },
  editButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
