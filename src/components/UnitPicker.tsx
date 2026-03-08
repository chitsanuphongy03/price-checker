import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows, getFont } from '../constants/theme';
import { UnitType, UnitCategory, UNITS, getUnitsByCategory } from '../constants/units';
import { useLanguage } from '../hooks/useLanguage';

interface UnitPickerProps {
  value: UnitType;
  onSelect: (unit: UnitType) => void;
  category?: UnitCategory;
}

export function UnitPicker({ value, onSelect, category }: UnitPickerProps) {
  const { t, isThai } = useLanguage();
  const [visible, setVisible] = React.useState(false);

  const units = category ? getUnitsByCategory(category) : UNITS;
  const selectedUnit = UNITS.find(u => u.id === value);

  const handleSelect = (unit: UnitType) => {
    onSelect(unit);
    setVisible(false);
  };

  const getCategoryLabel = (cat: UnitCategory) => {
    switch (cat) {
      case 'weight': return t('weight') || 'Weight';
      case 'volume': return t('volume') || 'Volume';
      case 'quantity': return t('quantity') || 'Quantity';
    }
  };

  const grouped = React.useMemo(() => {
    const groups: Record<UnitCategory, typeof UNITS> = { weight: [], volume: [], quantity: [] };
    units.forEach(u => {
      groups[u.category].push(u);
    });
    return groups;
  }, [units]);

  return (
    <>
      <TouchableOpacity style={styles.picker} onPress={() => setVisible(true)}>
        <Text style={[styles.pickerText, { fontFamily: getFont('medium', isThai) }]}>
          {selectedUnit ? (isThai ? selectedUnit.nameTh : selectedUnit.name) : value}
        </Text>
        <Ionicons name="chevron-down" size={16} color={Colors.textMuted} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" statusBarTranslucent={true}>
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, { fontFamily: getFont('bold', isThai) }]}>
                {t('selectUnit') || 'Select Unit'}
              </Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {(Object.keys(grouped) as UnitCategory[]).map(cat => {
                const catUnits = grouped[cat];
                if (catUnits.length === 0) return null;

                return (
                  <View key={cat} style={styles.category}>
                    <Text style={[styles.categoryLabel, { fontFamily: getFont('semiBold', isThai) }]}>
                      {getCategoryLabel(cat)}
                    </Text>
                    <View style={styles.unitsRow}>
                      {catUnits.map(unit => (
                        <TouchableOpacity
                          key={unit.id}
                          style={[styles.unitButton, value === unit.id && styles.unitButtonActive]}
                          onPress={() => handleSelect(unit.id)}
                        >
                          <Text style={[
                            styles.unitText,
                            { fontFamily: getFont('medium', isThai) },
                            value === unit.id && styles.unitTextActive,
                          ]}>
                            {isThai ? unit.nameTh : unit.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 70,
  },
  pickerText: {
    fontSize: 14,
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 320,
    maxHeight: '70%',
    padding: Spacing.lg,
    ...Shadows.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 20,
    color: Colors.text,
  },
  category: {
    marginBottom: Spacing.md,
  },
  categoryLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  unitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  unitButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 60,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  unitText: {
    fontSize: 14,
    color: Colors.text,
  },
  unitTextActive: {
    color: Colors.card,
  },
});
