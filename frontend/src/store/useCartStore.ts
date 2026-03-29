import { create } from 'zustand';

interface CartItem {
    productId: string;
    variantId?: string;
    quantity: number;
    product: {
        id: string;
        title: string;
        finalPrice: number;
        basePrice: number;
        images: { url: string }[];
    }
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    setItems: (items: CartItem[]) => void;
    setIsOpen: (isOpen: boolean) => void;
    updateQuantity: (productId: string, quantity: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
    items: [],
    isOpen: false,
    setItems: (items) => set({ items }),
    setIsOpen: (isOpen) => set({ isOpen }),
    updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item => item.productId === productId ? { ...item, quantity } : item)
    }))
}));
