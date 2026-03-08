export type Language = 'th' | 'en';

export interface Translations {
  [key: string]: string;
}

export const translations = {
  th: {
    // App
    appName: 'Price Checker',
    appSubtitle: 'เปรียบเทียบสินค้าและหาข้อเสนอที่ดีที่สุด',
    
    // Products
    product: 'สินค้า',
    productA: 'สินค้า A',
    productB: 'สินค้า B',
    addProduct: 'เพิ่มสินค้า',
    removeProduct: 'ลบสินค้า',
    fillAllProducts: 'กรุณากรอกข้อมูลสินค้าทั้งหมด',
    
    // Form Fields
    name: 'ชื่อ',
    enterProductName: 'ใส่ชื่อสินค้า (ไม่บังคับ)',
    price: 'ราคา',
    quantity: 'จำนวน',
    unit: 'หน่วย',
    selectUnit: 'เลือกหน่วย',
    
    // Units
    weight: 'น้ำหนัก',
    volume: 'ปริมาตร',
    volume_short: 'ปริมาตร',
    perUnit: 'ต่อหน่วย',
    perVolume: 'ต่อ ml',
    perWeight: 'ต่อ g',
    
    // Promotion
    promotion: 'โปรโมชั่น',
    noPromotion: 'ไม่มีโปรโมชั่น',
    percentageDiscount: 'ส่วนลดเปอร์เซ็นต์',
    fixedDiscount: 'ส่วนลดจำนวนคงที่',
    buyXGetY: 'ซื้อ X แถม Y',
    bundlePrice: 'ราคาชุด',
    selectPromotion: 'เลือกโปรโมชั่น',
    discountPercent: 'ส่วนลด %',
    discountAmount: 'จำนวนส่วนลด',
    buy: 'ซื้อ',
    getFree: 'แถม',
    quantity_short: 'จำนวน',
    forPrice: 'ราคา',
    tapToChange: 'แตะเพื่อเปลี่ยน',
    
    // Compare Button
    compareBestDeal: 'เปรียบเทียบข้อเสนอที่ดีที่สุด',
    compare: 'เปรียบเทียบ',
    
    // Result Screen
    result: 'ผลลัพธ์',
    back: 'กลับ',
    bestDeal: 'ข้อเสนอที่ดีที่สุด',
    winner: 'ผู้ชนะ',
    loser: 'รองชนะ',
    youSave: 'คุณประหยัด',
    saved: 'ประหยัด',
    originalTotal: 'ราคาเดิมรวม',
    afterPromotion: 'หลังโปรโมชั่น',
    youSaveAmount: 'คุณประหยัด',
    pricePerUnit: 'ราคาต่อหน่วย',
    vsAlternative: 'เทียบกับตัวเลือกอื่น',
    comparisonDetails: 'รายละเอียดการเปรียบเทียบ',
    rankings: 'อันดับ',
    rank: 'อันดับ',
    
    // Tie
    itsATie: 'เสมอกัน!',
    tieMessage: 'สินค้าทั้งสองมีมูลค่าเท่ากัน',
    
    // Share
    share: 'แชร์',
    shareTitle: 'ผลการเปรียบเทียบราคา',
    bestDealFound: 'หาข้อเสนอที่ดีที่สุดแล้ว!',
    itsATieShare: 'เสมอกัน!',
    bothSamePrice: 'ทั้งสองสินค้ามีราคาเท่ากัน',
    
    // New Comparison
    newComparison: 'เปรียบเทียบใหม่',
    
    // Validation
    error: 'ข้อผิดพลาด',
    productAError: 'กรุณาตรวจสอบสินค้า A',
    productBError: 'กรุณาตรวจสอบสินค้า B',
    priceMustBeGreater: 'ราคาต้องมากกว่า 0',
    quantityMustBeGreater: 'จำนวนต้องมากกว่า 0',
    nameRequired: 'ต้องระบุชื่อสินค้า',
    
    // History
    history: 'ประวัติ',
    noHistory: 'ไม่มีประวัติ',
    startComparing: 'เริ่มเปรียบเทียบสินค้าเลย',
    historyDetail: 'รายละเอียดประวัติ',
    delete: 'ลบ',
    confirmDelete: 'คุณต้องการลบรายการนี้ใช่หรือไม่?',
    clearAll: 'ลบทั้งหมด',
    confirmClearAll: 'คุณต้องการลบประวัติทั้งหมดใช่หรือไม่?',
    loading: 'กำลังโหลด...',
    edit: 'แก้ไข',
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    
    // Notes
    addNote: 'เพิ่มโน้ต',
    editNote: 'แก้ไขโน้ต',
    enterNote: 'ใส่โน้ต...',
    note: 'โน้ต',
    
    // Quantity Picker
    quickSelect: 'เลือกด่วน',
    
    // Calculator
    calculator: 'เครื่องคิดเลข',
    calculatorDesc: 'คำนวณจำนวนรวมในแพ็ค',
    packSize: 'จำนวนในแพ็ค',
    eachAmount: 'จำนวนแต่ละชิ้น',
    total: 'รวม',
    apply: 'ใช้งาน',
    close: 'ปิด',
    
    // Settings
    settings: 'ตั้งค่า',
    general: 'ทั่วไป',
    storage: 'การจัดเก็บ',
    about: 'เกี่ยวกับ',
    language: 'ภาษา',
    currency: 'สกุลเงิน',
    selectCurrency: 'เลือกสกุลเงิน',
    cacheSize: 'ขนาดแคช',
    clearCache: 'ล้างแคช',
    confirmClearCache: 'คุณต้องการล้างแคชทั้งหมดใช่หรือไม่?',
    clearCacheDesc: 'ลบข้อมูลแคชทั้งหมด',
    mode: 'โหมด',
    simple: 'ง่าย',
    advance: 'ขั้นสูง',
    
    // Date
    date: 'วันที่',
    time: 'เวลา',
    
    // Products list
    products: 'สินค้า',
    
    // Volume/Weight comparison
    byVolume: 'เปรียบเทียบต่อปริมาตร',
    byWeight: 'เปรียบเทียบต่อน้ำหนัก',
    equivalentTo: 'เท่ากับ',
    
    // Misc
    comparison: 'การเปรียบเทียบ',
    clear: 'ล้าง',
  },
  en: {
    // App
    appName: 'Price Checker',
    appSubtitle: 'Compare products and find the best deal',
    
    // Products
    product: 'Product',
    productA: 'Product A',
    productB: 'Product B',
    addProduct: 'Add Product',
    removeProduct: 'Remove Product',
    fillAllProducts: 'Please fill in all products',
    
    // Form Fields
    name: 'Name',
    enterProductName: 'Enter product name (optional)',
    price: 'Price',
    quantity: 'Quantity',
    unit: 'Unit',
    selectUnit: 'Select Unit',
    
    // Units
    weight: 'Weight',
    volume: 'Volume',
    volume_short: 'Vol',
    perUnit: 'per unit',
    perVolume: 'per ml',
    perWeight: 'per g',
    
    // Promotion
    promotion: 'Promotion',
    noPromotion: 'No Promotion',
    percentageDiscount: 'Percentage Discount',
    fixedDiscount: 'Fixed Discount',
    buyXGetY: 'Buy X Get Y',
    bundlePrice: 'Bundle Price',
    selectPromotion: 'Select Promotion',
    discountPercent: 'Discount %',
    discountAmount: 'Discount Amount',
    buy: 'Buy',
    getFree: 'Get Free',
    quantity_short: 'Qty',
    forPrice: 'For Price',
    tapToChange: 'Tap to change',
    
    // Compare Button
    compareBestDeal: 'Compare Best Deal',
    compare: 'Compare',
    
    // Result Screen
    result: 'Result',
    back: 'Back',
    bestDeal: 'Best Deal',
    winner: 'Winner',
    loser: 'Runner-up',
    youSave: 'You save',
    saved: 'Saved',
    originalTotal: 'Original total',
    afterPromotion: 'After promotion',
    youSaveAmount: 'You save',
    pricePerUnit: 'Price per unit',
    vsAlternative: 'vs. alternative',
    comparisonDetails: 'Comparison Details',
    rankings: 'Rankings',
    rank: 'Rank',
    
    // Tie
    itsATie: "It's a Tie!",
    tieMessage: 'Both products have the same value',
    
    // Share
    share: 'Share',
    shareTitle: 'Price Comparison Result',
    bestDealFound: '🏆 Best Deal Found!',
    itsATieShare: "🤝 It's a tie!",
    bothSamePrice: 'Both products have the same price',
    
    // New Comparison
    newComparison: 'New Comparison',
    
    // Validation
    error: 'Error',
    productAError: 'Please check Product A',
    productBError: 'Please check Product B',
    priceMustBeGreater: 'Price must be greater than 0',
    quantityMustBeGreater: 'Quantity must be greater than 0',
    nameRequired: 'Product name is required',
    
    // History
    history: 'History',
    noHistory: 'No history',
    startComparing: 'Start comparing products',
    historyDetail: 'History Detail',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this item?',
    clearAll: 'Clear All',
    confirmClearAll: 'Are you sure you want to delete all history?',
    loading: 'Loading...',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    
    // Notes
    addNote: 'Add Note',
    editNote: 'Edit Note',
    enterNote: 'Enter note...',
    note: 'Note',
    
    // Quantity Picker
    quickSelect: 'Quick Select',
    
    // Calculator
    calculator: 'Calculator',
    calculatorDesc: 'Calculate total quantity in pack',
    packSize: 'Pack size',
    eachAmount: 'Each amount',
    total: 'Total',
    apply: 'Apply',
    close: 'Close',
    
    // Settings
    settings: 'Settings',
    general: 'General',
    storage: 'Storage',
    about: 'About',
    language: 'Language',
    currency: 'Currency',
    selectCurrency: 'Select Currency',
    cacheSize: 'Cache Size',
    clearCache: 'Clear Cache',
    confirmClearCache: 'Are you sure you want to clear all cache?',
    clearCacheDesc: 'Delete all cached data',
    mode: 'Mode',
    simple: 'Simple',
    advance: 'Advance',
    
    // Date
    date: 'Date',
    time: 'Time',
    
    // Products list
    products: 'Products',
    
    // Volume/Weight comparison
    byVolume: 'Compare by Volume',
    byWeight: 'Compare by Weight',
    equivalentTo: 'Equivalent to',
    
    // Misc
    comparison: 'Comparison',
    clear: 'Clear',
  },
} as const;

export type TranslationKey = keyof typeof translations.th;
