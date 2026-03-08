# Price Checker - AI Agent Guide

## Project Overview

**Price Checker** is a React Native mobile application built with Expo that helps users compare product prices and find the best deals. The app supports multiple products, various unit conversions (weight, volume, quantity), and different promotion types (percentage discount, fixed discount, buy X get Y, bundle pricing).

### Key Features
- Compare prices between multiple products
- Support for weight (mg, g, kg, oz, lb), volume (ml, cl, L, fl oz, gal), and quantity units
- Multiple promotion types calculation
- Comparison history with local storage
- Bilingual support: Thai (default) and English
- Simple and Advance modes

---

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React Native 0.81.5 with Expo SDK ~54.0.33 |
| Language | TypeScript 5.9.2 |
| Navigation | React Navigation 7.x (Native Stack + Bottom Tabs) |
| State Management | React Context API (LanguageProvider) |
| Storage | @react-native-async-storage/async-storage |
| Animation | react-native-reanimated ~4.1.1 |
| Gestures | react-native-gesture-handler ~2.28.0 |
| Icons | @expo/vector-icons (Ionicons) |
| Styling | StyleSheet (no CSS-in-JS library) |
| Fonts | System fonts (simplified, no custom font loading) |

---

## Project Structure

```
price-checker/
├── App.tsx                    # Entry point - wraps app with providers
├── app.json                   # Expo configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript config with path aliases
├── babel.config.js            # Babel with reanimated plugin
├── eslint.config.js           # ESLint using eslint-config-expo
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx   # Navigation setup (Stack + Tab navigators)
│   ├── screens/
│   │   ├── HomeScreen.tsx     # Main comparison screen
│   │   ├── ResultScreen.tsx   # Comparison results display
│   │   ├── HistoryScreen.tsx  # List of past comparisons
│   │   ├── HistoryDetailScreen.tsx  # Detail view of history item
│   │   ├── SavedScreen.tsx    # Saved comparisons
│   │   └── SettingsScreen.tsx # App settings
│   ├── components/
│   │   ├── ProductCard.tsx    # Product input form card
│   │   ├── ProductList.tsx    # List of product cards
│   │   ├── CompareButton.tsx  # Compare action button
│   │   ├── UnitPicker.tsx     # Unit selection modal
│   │   ├── QuantityPicker.tsx # Quantity input with quick select
│   │   ├── PromotionModal.tsx # Promotion type selector
│   │   ├── PromotionSelector.tsx  # Promotion picker component
│   │   ├── CalculatorModal.tsx    # Pack calculator modal
│   │   ├── NoteModal.tsx      # Add/edit notes modal
│   │   ├── ResultCard.tsx     # Result display card
│   │   └── LanguageSwitcher.tsx   # Language toggle component
│   ├── hooks/
│   │   ├── useLanguage.tsx    # Language context (Thai/English)
│   │   ├── useStorage.ts      # History, settings, cache hooks
│   │   ├── useFonts.ts        # Font loading (simplified)
│   │   └── useUnitConversion.ts   # Unit conversion hook
│   ├── constants/
│   │   ├── theme.ts           # Colors, spacing, shadows, fonts
│   │   ├── translations.ts    # Thai and English translations
│   │   └── units.ts           # Unit definitions and conversions
│   ├── types/
│   │   └── promotion.ts       # TypeScript interfaces
│   └── utils/
│       ├── priceCalculator.ts # Price calculation logic
│       ├── storage.ts         # AsyncStorage operations
│       └── unitConverter.ts   # Unit conversion utilities
├── assets/
│   ├── fonts/                 # NotoSans and NotoSansThai fonts
│   └── images/                # App icons, splash screen
└── scripts/
    └── reset-project.js       # Expo project reset utility
```

---

## Build and Run Commands

```bash
# Install dependencies
npm install

# Start development server
npm start           # or: npx expo start

# Run on specific platforms
npm run android     # Android emulator/device
npm run ios         # iOS simulator (macOS only)
npm run web         # Web browser

# Linting
npm run lint        # Run ESLint with expo config

# Reset project (Expo utility)
npm run reset-project
```

### Development Workflow

1. Start the development server with `npm start`
2. Scan QR code with Expo Go app on physical device, or
3. Press `a` for Android emulator, `i` for iOS simulator, `w` for web
4. The app uses hot reload for quick development

---

## Code Style Guidelines

### TypeScript
- Strict mode enabled (`"strict": true` in tsconfig.json)
- Path aliases: `@/*` maps to project root, `@/src/*` maps to `./src/*`
- All components use `.tsx` extension
- Types defined in `src/types/promotion.ts`

### Component Structure
```typescript
// Functional components with explicit return types
export function ComponentName(): JSX.Element {
  // hooks at top
  const { t, isThai } = useLanguage();
  
  // state
  const [state, setState] = useState();
  
  // effects
  useEffect(() => {}, []);
  
  // handlers
  const handleAction = () => {};
  
  return (
    // JSX
  );
}

// Styles at bottom of file
const styles = StyleSheet.create({
  // styles
});
```

### Naming Conventions
- Components: PascalCase (e.g., `ProductCard.tsx`)
- Hooks: camelCase starting with `use` (e.g., `useLanguage.tsx`)
- Utils: camelCase (e.g., `priceCalculator.ts`)
- Constants: UPPER_SNAKE_CASE for values, PascalCase for types

### Styling Patterns
- Use `StyleSheet.create()` for all styles
- Import theme constants from `src/constants/theme.ts`
- Font family via `getFont(weight, isThai)` function
- Colors from `Colors` object
- Spacing from `Spacing` object
- Shadows from `Shadows` object

Example:
```typescript
import { Colors, Spacing, BorderRadius, Shadows, getFont } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadows.md,
  },
  text: {
    fontFamily: getFont('bold', isThai),
    color: Colors.text,
  },
});
```

---

## Testing Instructions

### Current State
- **No automated tests are configured** in this project
- Testing is done manually through the app interface

### Manual Testing Checklist

1. **Home Screen**
   - Add product names, prices, quantities
   - Test unit picker (different categories)
   - Test promotion types
   - Verify compare button enables when valid

2. **Result Screen**
   - Verify winner/loser calculation
   - Test share functionality
   - Check ranking display

3. **History**
   - Save comparisons
   - View history list
   - Delete individual items
   - Clear all history

4. **Settings**
   - Toggle language (Thai/English)
   - Switch between Simple/Advance modes
   - Clear cache

---

## Key Architecture Patterns

### Navigation Structure
```
Stack Navigator (Root)
├── Main (Tab Navigator)
│   ├── Home (HomeScreen)
│   ├── History (HistoryScreen)
│   ├── Saved (SavedScreen)
│   └── Settings (SettingsScreen)
├── Result (ResultScreen)
└── HistoryDetail (HistoryDetailScreen)
```

### State Management
- **Language**: Context API with `LanguageProvider` wrapping the app
- **Settings/History**: Custom hooks (`useSettings`, `useHistory`) with AsyncStorage
- **Local component state**: `useState` for form inputs

### Data Flow
1. User inputs product data in `ProductCard` components
2. `HomeScreen` collects all products
3. On compare, `priceCalculator.compareMultipleProducts()` calculates results
4. Results passed to `ResultScreen` via navigation params
5. History saved to AsyncStorage automatically

### Promotion Types (src/types/promotion.ts)
```typescript
enum PromotionType {
  NONE = 'none',
  PERCENTAGE_DISCOUNT = 'percentage_discount',
  FIXED_DISCOUNT = 'fixed_discount',
  BUY_X_GET_Y = 'buy_x_get_y',
  BUNDLE_PRICE = 'bundle_price',
}
```

### Unit Categories (src/constants/units.ts)
- **Weight**: mg, g, kg, oz, lb (base: grams)
- **Volume**: ml, cl, l, fl_oz, gal (base: milliliters)
- **Quantity**: pcs, pack, box, set (no conversion)

---

## Security Considerations

### Data Storage
- All data stored locally using AsyncStorage
- No sensitive user data collected
- No network requests made by the app

### Dependencies
- Keep Expo SDK and dependencies updated
- Run `npm audit` periodically
- Expo handles security patches for native dependencies

### Input Validation
- Price and quantity inputs validated (must be > 0)
- Promotion values have reasonable bounds (e.g., max 100% discount)

---

## Internationalization (i18n)

The app supports Thai (default) and English:

- Translation keys in `src/constants/translations.ts`
- Use `useLanguage()` hook to access translations:
  ```typescript
  const { t, isThai, toggleLanguage } = useLanguage();
  
  // Get translation
  <Text>{t('appName')}</Text>
  
  // Check current language
  if (isThai) { /* Thai-specific logic */ }
  ```

- Default language is Thai (`'th'`)
- Font handling supports both Latin and Thai scripts via `getFont()`

---

## Expo Configuration Notes

### app.json Key Settings
- `newArchEnabled: true` - Uses React Native's new architecture
- `scheme: "pricechecker"` - Deep linking support
- `typedRoutes: true` - Type-safe routing
- `reactCompiler: true` - React Compiler enabled

### Platform-Specific
- Android: Adaptive icons configured, edge-to-edge enabled
- iOS: Tablet support enabled
- Web: Static output mode

---

## Common Development Tasks

### Adding a New Screen
1. Create screen component in `src/screens/`
2. Add route type to `RootStackParamList` or `TabParamList` in `AppNavigator.tsx`
3. Register screen in the appropriate navigator
4. Add navigation from existing screens

### Adding a Translation
1. Add key to `TranslationKey` type in `translations.ts`
2. Add Thai translation in `translations.th`
3. Add English translation in `translations.en`
4. Use with `t('yourKey')` in components

### Adding a Unit
1. Add to `UnitType` union type in `units.ts`
2. Add `UnitDefinition` to `UNITS` array
3. Specify category and conversion factor to base unit

---

## Troubleshooting

### Common Issues

**Metro bundler cache issues:**
```bash
npx expo start --clear
```

**TypeScript path alias not resolving:**
- Ensure import starts with `@/` (e.g., `@/src/constants/theme`)

**AsyncStorage errors:**
- Storage has fallback to memory if AsyncStorage unavailable
- Check that `@react-native-async-storage/async-storage` is properly linked

**Reanimated not working:**
- Plugin is configured in `babel.config.js`
- Ensure app is rebuilt after adding reanimated code
