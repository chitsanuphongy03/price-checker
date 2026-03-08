# Price Checker

A modern, clean React Native mobile application for comparing product prices and finding the best deals. Built with Expo and TypeScript.

![Price Checker Banner](https://via.placeholder.com/800x400/2563EB/FFFFFF?text=Price+Checker)

## Features

### Core Features
- ✅ **Compare Multiple Products** - Compare up to 10 products at once
- ✅ **Smart Price Calculation** - Calculates price per unit (g, ml, or piece)
- ✅ **Unit Conversion** - Automatic conversion between weight and volume units
- ✅ **Promotion Support** - Calculate with various promotions:
  - Percentage Discount
  - Fixed Amount Discount
  - Buy X Get Y Free
  - Bundle Pricing

### Advanced Features
- 📊 **Simple & Advance Modes** - Toggle between basic and advanced interfaces
- 📝 **Product Notes** - Add notes to each product
- 🧮 **Built-in Calculator** - Calculate pack totals (e.g., 6 bottles × 350ml)
- 📱 **Quantity Picker** - Elegant modal for selecting quantities 1-10
- 💾 **History** - Save and review past comparisons
- 🌏 **Bilingual** - Full Thai and English support
- 💰 **Multiple Currencies** - Support for ฿, $, €, ¥

### Unit Support
| Category | Units |
|----------|-------|
| **Weight** | mg, g, kg, oz, lb |
| **Volume** | ml, cl, L, fl oz, gal |
| **Quantity** | pcs, pack, box, set |

## Screenshots

| Home Screen | Result Screen | History |
|-------------|---------------|---------|
| ![Home](https://via.placeholder.com/200x400/F8FAFC/2563EB?text=Home) | ![Result](https://via.placeholder.com/200x400/F8FAFC/22C55E?text=Result) | ![History](https://via.placeholder.com/200x400/F8FAFC/475569?text=History) |

## Tech Stack

- **Framework:** React Native 0.81.5 with Expo SDK ~54.0.33
- **Language:** TypeScript 5.9.2
- **Navigation:** React Navigation 7.x (Native Stack + Bottom Tabs)
- **State Management:** React Context API
- **Storage:** AsyncStorage (local storage)
- **Animation:** React Native Reanimated 4.x
- **Icons:** Ionicons (@expo/vector-icons)
- **Fonts:** System fonts (optimized for fast loading)

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android emulator) or Xcode (for iOS simulator)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd price-checker
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
# or
npx expo start
```

4. **Run on device/emulator**
- Press `a` for Android emulator
- Press `i` for iOS simulator (macOS only)
- Press `w` for web browser
- Scan QR code with Expo Go app on physical device

## Build Commands

```bash
# Development
npm start              # Start Metro bundler
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web

# Production Build
npx expo build:android    # Build Android APK/AAB
npx expo build:ios        # Build iOS IPA (requires Apple Developer account)

# Linting
npm run lint           # Run ESLint

# Reset
npm run reset-project  # Reset Expo project
```

## Project Structure

```
price-checker/
├── App.tsx                    # App entry point
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ProductCard.tsx    # Product input form
│   │   ├── QuantityPicker.tsx # Quantity selector modal
│   │   ├── UnitPicker.tsx     # Unit selection modal
│   │   ├── PromotionModal.tsx # Promotion type selector
│   │   ├── CalculatorModal.tsx# Pack calculator
│   │   ├── NoteModal.tsx      # Add notes modal
│   │   └── ...
│   ├── screens/               # Screen components
│   │   ├── HomeScreen.tsx     # Main comparison screen
│   │   ├── ResultScreen.tsx   # Results display
│   │   ├── HistoryScreen.tsx  # Comparison history
│   │   ├── SettingsScreen.tsx # App settings
│   │   └── ...
│   ├── navigation/            # Navigation setup
│   ├── hooks/                 # Custom React hooks
│   ├── constants/             # Theme, translations, units
│   ├── types/                 # TypeScript interfaces
│   └── utils/                 # Utility functions
├── assets/                    # Fonts, images, icons
└── ...
```

## Usage Guide

### Basic Comparison
1. Open the app
2. Enter product name (optional)
3. Enter price
4. Enter quantity and select unit
5. Choose promotion type (if any)
6. Tap "Compare Best Deal"

### Using Calculator
- Tap the calculator icon next to quantity
- Enter pack size and amount per item
- Tap "Apply" to use calculated total

### Adding Notes
- Tap "Add Note" on any product card
- Enter your note
- Notes appear in history and results

### Viewing History
- Tap "History" tab at bottom
- View past comparisons
- Tap to see details
- Swipe left or tap trash to delete

### Settings
- Tap "Settings" tab
- Toggle between Thai/English
- Switch Simple/Advance mode
- Change currency
- View and clear cache

## Supported Languages

| Language | Code | Status |
|----------|------|--------|
| Thai     | th   | ✅ Complete |
| English  | en   | ✅ Complete |

## Design

The app follows a clean, minimal design inspired by:
- **Notion** - Clean typography and spacing
- **Apple Calculator** - Simple, focused interface
- **Google Keep** - Card-based layout

### Color Palette
- **Primary:** `#2563EB` (Blue)
- **Background:** `#F8FAFC` (Light Gray)
- **Card:** `#FFFFFF` (White)
- **Text:** `#0F172A` (Dark Slate)
- **Accent:** `#22C55E` (Green for savings)

## Troubleshooting

### App shows loading spinner forever
- Clear Metro cache: `npx expo start --clear`
- Restart the app

### AsyncStorage errors
The app has automatic fallback to memory storage if AsyncStorage fails.

### Fonts not loading
The app uses system fonts by default for fast loading. Custom fonts (Noto Sans) are included in assets/fonts/ as fallback.

### Modal shows bottom navigation
All modals are now full-screen with `statusBarTranslucent` to prevent this issue.

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons by [Ionicons](https://ionic.io/ionicons)
- Fonts: Noto Sans & Noto Sans Thai by Google

---

Made with ❤️ for smart shoppers
