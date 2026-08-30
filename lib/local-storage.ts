export type Product = { id: string; name: string; category: string; purchasePrice: number; wholesalePrice: number; retailPrice: number; stock: number; minStock: number; supplier: string; barcode: string; image?: string }
export type Customer = { id: string; name: string; phone: string; totalPurchases: number; totalPaid: number; debt: number }
export type Supplier = { id: string; name: string; phone: string; balance: number }
export type Sale = { id: string; date: string; customerId?: string; items: { productId: string; quantity: number; price: number }[]; subtotal: number; discount: number; total: number; paid: number; debt: number; status: string }
export type Expense = { id: string; title: string; category: string; amount: number; date: string; note?: string }
export type Settings = { storeName: string; phone: string; address: string; email: string; currency: string; defaultMinStock: number }
export type AppData = { version: number; products: Product[]; customers: Customer[]; suppliers: Supplier[]; sales: Sale[]; expenses: Expense[]; settings: Settings }

const KEY = 'zoubir-sweets-data-v2'
const seed: AppData = { version: 2, settings: { storeName: 'الزوبير للحلويات', phone: '0555 12 34 56', address: 'الجزائر العاصمة', email: 'contact@zoubir.dz', currency: 'دج', defaultMinStock: 10 }, products: [
  { id: 'p1', name: 'شوكولاتة ميلكا بالحليب', category: 'شوكولاتة', purchasePrice: 180, wholesalePrice: 230, retailPrice: 260, stock: 84, minStock: 10, supplier: 'مؤسسة النور', barcode: '611111111' },
  { id: 'p2', name: 'بسكويت أوريو العائلي', category: 'بسكويت', purchasePrice: 120, wholesalePrice: 155, retailPrice: 180, stock: 5, minStock: 12, supplier: 'مؤسسة النور', barcode: '622222222' },
  { id: 'p3', name: 'علكة ترايدنت نعناع', category: 'حلويات', purchasePrice: 40, wholesalePrice: 58, retailPrice: 70, stock: 142, minStock: 20, supplier: 'توزيع كمال', barcode: '633333333' },
  { id: 'p4', name: 'عصير راني برتقال 1 لتر', category: 'مشروبات', purchasePrice: 90, wholesalePrice: 120, retailPrice: 140, stock: 0, minStock: 10, supplier: 'مشروبات الجزائر', barcode: '644444444' },
  { id: 'p5', name: 'شيبس تايجر جبنة', category: 'مقرمشات', purchasePrice: 50, wholesalePrice: 72, retailPrice: 85, stock: 38, minStock: 10, supplier: 'توزيع كمال', barcode: '655555555' },
  { id: 'p6', name: 'كاندي هاريبو جولد بير', category: 'حلويات', purchasePrice: 210, wholesalePrice: 260, retailPrice: 300, stock: 67, minStock: 10, supplier: 'مؤسسة النور', barcode: '666666666' },
], customers: [{ id: 'c1', name: 'متجر البركة', phone: '0550 111 222', totalPurchases: 185000, totalPaid: 160000, debt: 25000 }, { id: 'c2', name: 'سوبرات كريم', phone: '0661 333 444', totalPurchases: 98000, totalPaid: 98000, debt: 0 }], suppliers: [{ id: 's1', name: 'مؤسسة النور', phone: '0555 000 111', balance: 42000 }, { id: 's2', name: 'توزيع كمال', phone: '0666 222 333', balance: 18000 }], sales: [], expenses: [] }
export function loadData(): AppData { if (typeof window === 'undefined') return seed; try { const raw = localStorage.getItem(KEY); if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return seed } return JSON.parse(raw) } catch { return seed } }
export function saveData(data: AppData) { if (typeof window !== 'undefined') localStorage.setItem(KEY, JSON.stringify(data)) }
export function resetData() { if (typeof window !== 'undefined') localStorage.removeItem(KEY) }
export function exportData(data: AppData) { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `zoubir-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url) }
export const money = (n: number) => `${n.toLocaleString('ar-DZ')} دج`
export const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
export const categories = ['الكل', 'شوكولاتة', 'بسكويت', 'حلويات', 'مقرمشات', 'مشروبات', 'بقالة']

export function addProduct(data: AppData, input: Omit<Product, 'id'>) { const next = { ...data, products: [...data.products, { ...input, id: uid('p') }] }; saveData(next); return next }
export function recordSale(data: AppData, items: Sale['items'], customerId?: string, discount = 0, paid = 0) { const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0); const total = Math.max(0, subtotal - discount); const debt = Math.max(0, total - paid); const products = data.products.map(p => { const item = items.find(i => i.productId === p.id); return item ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p }); const customers = data.customers.map(c => c.id === customerId ? { ...c, totalPurchases: c.totalPurchases + total, totalPaid: c.totalPaid + paid, debt: c.debt + debt } : c); const sale: Sale = { id: `INV-${new Date().getFullYear()}-${String(data.sales.length + 1).padStart(4, '0')}`, date: new Date().toISOString(), customerId, items, subtotal, discount, total, paid, debt, status: debt === 0 ? 'مدفوعة' : paid > 0 ? 'مدفوعة جزئياً' : 'غير مدفوعة' }; const next = { ...data, products, customers, sales: [sale, ...data.sales] }; saveData(next); return next }
export function recordPayment(data: AppData, customerId: string, amount: number) { const customers = data.customers.map(c => c.id === customerId ? { ...c, totalPaid: c.totalPaid + amount, debt: Math.max(0, c.debt - amount) } : c); const next = { ...data, customers }; saveData(next); return next }
