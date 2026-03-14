import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, getFont } from '../constants/theme';
import { Product, PromotionType } from '../types/promotion';
import { UnitType } from '../constants/units';
import { ProductCard } from './ProductCard';
import { PromotionModal } from './PromotionModal';
import { useLanguage } from '../hooks/useLanguage';

interface ProductListProps {
  products: Product[];
  onUpdate: (products: Product[]) => void;
  activeProductId: string | null;
  setActiveProductId: (id: string | null) => void;
  promoModalVisible: boolean;
  setPromoModalVisible: (visible: boolean) => void;
}

const MAX_PRODUCTS = 10;
const MIN_PRODUCTS = 2;

export function ProductList({
  products,
  onUpdate,
  activeProductId,
  setActiveProductId,
  promoModalVisible,
  setPromoModalVisible,
}: ProductListProps) {
  const { t, isThai } = useLanguage();

  const addProduct = () => {
    if (products.length >= MAX_PRODUCTS) return;
    
    const newProduct: Product = {
      id: String(products.length + 1),
      name: '',
      price: 0,
      quantity: 1,
      unit: 'pcs' as UnitType,
      promotion: { type: PromotionType.NONE, value: 0 },
    };
    
    onUpdate([...products, newProduct]);
  };

  const removeProduct = (id: string) => {
    if (products.length <= MIN_PRODUCTS) return;
    
    const updated = products.filter(p => p.id !== id);
    // Re-index IDs
    const reindexed = updated.map((p, idx) => ({ ...p, id: String(idx + 1) }));
    onUpdate(reindexed);
  };

  const updateProduct = (id: string, product: Product) => {
    const updated = products.map(p => p.id === id ? product : p);
    onUpdate(updated);
  };

  const handleSelectPromotion = (promotion: { type: PromotionType; value: number; buyX?: number; getY?: number; bundleQuantity?: number }) => {
    if (!activeProductId) return;
    
    const product = products.find(p => p.id === activeProductId);
    if (product) {
      updateProduct(activeProductId, { ...product, promotion });
    }
    setPromoModalVisible(false);
    setActiveProductId(null);
  };

  const activeProduct = activeProductId ? products.find(p => p.id === activeProductId) : null;

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onUpdate={(p) => updateProduct(product.id, p)}
            index={index}
            onOpenPromotion={() => {
              setActiveProductId(product.id);
              setPromoModalVisible(true);
            }}
            canDelete={products.length > MIN_PRODUCTS}
            onDelete={() => removeProduct(product.id)}
          />
        ))}
        
        {products.length < MAX_PRODUCTS && (
          <TouchableOpacity style={styles.addButton} onPress={addProduct}>
            <Ionicons name="add-circle" size={24} color={Colors.primary} />
            <Text style={[styles.addButtonText, { fontFamily: getFont('semiBold', isThai) }]}>
              {t('addProduct') || 'Add Product'}
            </Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.spacer} />
      </ScrollView>

      <PromotionModal
        visible={promoModalVisible}
        onClose={() => {
          setPromoModalVisible(false);
          setActiveProductId(null);
        }}
        onSelect={handleSelectPromotion}
        currentPromotion={activeProduct?.promotion || { type: PromotionType.NONE, value: 0 }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    borderStyle: "dashed",
  },
  addButtonText: {
    fontSize: 16,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  spacer: {
    height: 100,
  },
});
