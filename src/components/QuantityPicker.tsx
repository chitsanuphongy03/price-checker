import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows, getFont } from '../constants/theme';
import { useLanguage } from '../hooks/useLanguage';

interface QuantityPickerProps {
  value: number;
  onSelect: (value: number) => void;
  min?: number;
  max?: number;
}

const PRESET_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function QuantityPicker({ value, onSelect, min = 0, max = 9999 }: QuantityPickerProps) {
  const { t, isThai } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value === 0 ? '' : value.toString());
  }, [value, visible]);

  const handleSelect = (num: number) => {
    onSelect(num);
    setVisible(false);
  };

  const handleInputSubmit = () => {
    const num = parseInt(inputValue) || 0;
    if (num >= min && num <= max) {
      onSelect(num);
      setVisible(false);
    }
  };

  const increment = () => {
    const current = parseInt(inputValue) || 0;
    if (current < max) {
      setInputValue((current + 1).toString());
    }
  };

  const decrement = () => {
    const current = parseInt(inputValue) || 0;
    if (current > min) {
      setInputValue((current - 1).toString());
    }
  };

  // Split into rows of 5
  const rows = [];
  for (let i = 0; i < PRESET_VALUES.length; i += 5) {
    rows.push(PRESET_VALUES.slice(i, i + 5));
  }

  return (
    <>
      {/* Display Button */}
      <TouchableOpacity style={styles.displayButton} onPress={() => setVisible(true)}>
        <Text style={[styles.displayText, { fontFamily: getFont('medium', isThai) }]}>
          {value === 0 ? '-' : value}
        </Text>
        <Ionicons name="chevron-down" size={16} color={Colors.textMuted} />
      </TouchableOpacity>

      {/* Full Screen Modal */}
      <Modal 
        visible={visible} 
        transparent 
        animationType="fade"
        statusBarTranslucent={true}
      >
        <View style={styles.fullScreenOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { fontFamily: getFont('bold', isThai) }]}>
                {t('quantity') || 'Quantity'}
              </Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {/* Input Section */}
            <View style={styles.inputSection}>
              <TouchableOpacity style={styles.adjustButton} onPress={decrement}>
                <Ionicons name="remove" size={24} color={Colors.primary} />
              </TouchableOpacity>
              
              <TextInput
                style={[styles.input, { fontFamily: getFont('bold', isThai) }]}
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType="number-pad"
                autoFocus
                selectTextOnFocus
                textAlign="center"
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
              />
              
              <TouchableOpacity style={styles.adjustButton} onPress={increment}>
                <Ionicons name="add" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Apply Button */}
            <TouchableOpacity 
              style={[styles.applyButton, !inputValue && styles.applyButtonDisabled]}
              onPress={handleInputSubmit}
              disabled={!inputValue}
            >
              <Text style={[styles.applyText, { fontFamily: getFont('bold', isThai) }]}>
                {t('apply') || 'Apply'}
              </Text>
            </TouchableOpacity>

            {/* Quick Select Title */}
            <Text style={[styles.quickTitle, { fontFamily: getFont('medium', isThai) }]}>
              {t('quickSelect') || 'Quick Select'}
            </Text>

            {/* Grid - 2 rows x 5 columns */}
            <View style={styles.gridContainer}>
              {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.presetButton,
                        value === num && styles.presetButtonActive,
                      ]}
                      onPress={() => handleSelect(num)}
                    >
                      <Text style={[
                        styles.presetText,
                        { fontFamily: getFont('medium', isThai) },
                        value === num && styles.presetTextActive,
                      ]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  displayButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  displayText: {
    fontSize: 16,
    color: Colors.text,
  },
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 300,
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
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.lg,
  },
  adjustButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 100,
    height: 56,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    fontSize: 24,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  applyButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  applyText: {
    fontSize: 16,
    color: Colors.card,
  },
  quickTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  gridContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  presetButton: {
    width: 46,
    height: 46,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  presetText: {
    fontSize: 16,
    color: Colors.text,
  },
  presetTextActive: {
    color: Colors.card,
  },
});
