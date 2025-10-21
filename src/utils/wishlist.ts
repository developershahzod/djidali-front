const WISHLIST_KEY = 'djidali_wishlist';

export const getWishlistItems = (): string[] => {
  try {
    const saved = localStorage.getItem(WISHLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error reading wishlist:', error);
    return [];
  }
};

export const saveWishlistItems = (items: string[]): void => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('wishlist-updated'));
  } catch (error) {
    console.error('Error saving wishlist:', error);
  }
};

export const addToWishlist = (tourId: string): void => {
  const current = getWishlistItems();
  if (!current.includes(tourId)) {
    saveWishlistItems([...current, tourId]);
  }
};

export const removeFromWishlist = (tourId: string): void => {
  const current = getWishlistItems();
  saveWishlistItems(current.filter(id => id !== tourId));
};

export const toggleWishlistItem = (tourId: string): boolean => {
  const current = getWishlistItems();
  const isInWishlist = current.includes(tourId);

  if (isInWishlist) {
    removeFromWishlist(tourId);
  } else {
    addToWishlist(tourId);
  }

  return !isInWishlist;
};

export const isInWishlist = (tourId: string): boolean => {
  return getWishlistItems().includes(tourId);
};

export const clearWishlist = (): void => {
  saveWishlistItems([]);
};
