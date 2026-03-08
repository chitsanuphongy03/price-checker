import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows, getFont } from '../constants/theme';
import { useLanguage } from '../hooks/useLanguage';

interface CalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (result: number) => void;
}

export function CalculatorModal({ visible, onClose, onApply }: CalculatorModalProps) {
  const { t, isThai } = useLanguage();
  const [packSize, setPackSize] = useState('');
  const [itemCount, setItemCount] = useState('');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const pack = parseFloat(packSize) || 0;
    const count = parseFloat(itemCount) || 0;

    if (pack > 0 && count > 0) {
      setResult(pack * count);
    } else {
      setResult(null);
    }
  }, [packSize, itemCount]);

  const handleApply = () => {
    if (result !== null) {
      onApply(result);
      reset();
      onClose();
    }
  };

  const reset = () => {
    setPackSize('');
    setItemCount('');
    setResult(null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent={true}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { fontFamily: getFont('bold', isThai) }]}>
              {t('calculator') || 'Calculator'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.description, { fontFamily: getFont('regular', isThai) }]}>
            {t('calculatorDesc') || 'Calculate total quantity in pack'}
          </Text>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontFamily: getFont('medium', isThai) }]}>
                {t('packSize') || 'Pack size'}
              </Text>
              <TextInput
                style={[styles.input, { fontFamily: getFont('regular', isThai) }]}
                value={packSize}
                onChangeText={setPackSize}
                placeholder="6"
                keyboardType="number-pad"
              />
            </View>
            <Text style={styles.x}>×</Text>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontFamily: getFont('medium', isThai) }]}>
                {t('eachAmount') || 'Each'}
              </Text>
              <TextInput
                style={[styles.input, { fontFamily: getFont('regular', isThai) }]}
                value={itemCount}
                onChangeText={setItemCount}
                placeholder="350"
                keyboardType="number-pad"
              />
            </View>
          </View>

          {result !== null && (
            <View style={styles.resultBox}>
              <Text style={[styles.resultLabel, { fontFamily: getFont('medium', isThai) }]}>
                {t('total') || 'Total'}
              </Text>
              <Text style={[styles.resultValue, { fontFamily: getFont('bold', isThai) }]}>
                {result.toLocaleString()}
              </Text>
            </View>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={[styles.cancelText, { fontFamily: getFont('medium', isThai) }]}>
                {t('close') || 'Close'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.applyButton, result === null && styles.disabled]} 
              onPress={handleApply}
              disabled={result === null}
            >
              <Text style={[styles.applyText, { fontFamily: getFont('bold', isThai) }]}>
                {t('apply') || 'Apply'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 320,
    ...Shadows.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    color: Colors.text,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 18,
    color: Colors.text,
    backgroundColor: Colors.background,
    textAlign: 'center',
  },
  x: {
    fontSize: 20,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  resultBox: {
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  resultLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  resultValue: {
    fontSize: 32,
    color: Colors.primary,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.xl,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.text,
  },
  applyButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
  },
  disabled: {
    backgroundColor: Colors.textMuted,
  },
  applyText: {
    fontSize: 16,
    color: Colors.card,
  },
});
