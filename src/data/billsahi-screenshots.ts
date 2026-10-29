/** Selected real web application screens, in workflow order. */
export const billsahiScreenshots = [
  { file: 'dashboard', title: 'Business Dashboard', description: 'Business totals, operational alerts, and a daily overview.' },
  { file: 'inventory', title: 'Inventory Management', description: 'Products, stock levels, pricing, and supplier details.' },
  { file: 'retail-pos', title: 'Retail Point of Sale', description: 'A retail cart with quantities, payment details, and bill totals.' },
  { file: 'purchase-history', title: 'Purchase History', description: 'Purchase records with supplier, balance, payment, and status filters.' },
  { file: 'product-reports', title: 'Product Reports', description: 'Product sales, purchase quantities, stock, and profit reporting.' },
] as const;

export const billsahiImagePath = (file: string, thumbnail = false) =>
  `/images/projects/billsahi/${file}${thumbnail ? '-thumb' : ''}.webp`;
