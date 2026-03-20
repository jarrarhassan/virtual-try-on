import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Camera state
      isCameraActive: false,
      setCameraActive: (active) => set({ isCameraActive: active }),

      // Current view
      currentView: 'home', // 'home', 'tryon', 'analysis', 'favorites'
      setCurrentView: (view) => set({ currentView: view }),

      // Selected products and shades
      selectedProducts: {
        lips: null,
        foundation: null,
        blush: null,
        contour: null,
        highlighter: null,
        eyeshadow: null,
        eyeliner: null,
        mascara: null,
        brow: null,
      },
      selectedShades: {
        lips: null,
        foundation: null,
        blush: null,
        contour: null,
        highlighter: null,
        eyeshadow: null,
        eyeliner: null,
        mascara: null,
        brow: null,
      },

      setSelectedProduct: (category, product) =>
        set((state) => ({
          selectedProducts: { ...state.selectedProducts, [category]: product },
        })),

      setSelectedShade: (category, shade) =>
        set((state) => ({
          selectedShades: { ...state.selectedShades, [category]: shade },
        })),

      clearProduct: (category) =>
        set((state) => ({
          selectedProducts: { ...state.selectedProducts, [category]: null },
          selectedShades: { ...state.selectedShades, [category]: null },
        })),

      clearAllProducts: () =>
        set({
          selectedProducts: {
            lips: null,
            foundation: null,
            blush: null,
            contour: null,
            highlighter: null,
            eyeshadow: null,
            eyeliner: null,
            mascara: null,
            brow: null,
          },
          selectedShades: {
            lips: null,
            foundation: null,
            blush: null,
            contour: null,
            highlighter: null,
            eyeshadow: null,
            eyeliner: null,
            mascara: null,
            brow: null,
          },
        }),

      // Makeup intensity (0-100)
      makeupIntensity: {
        lips: 80,
        foundation: 50,
        blush: 60,
        contour: 40,
        highlighter: 50,
        eyeshadow: 70,
        eyeliner: 90,
        mascara: 80,
        brow: 60,
      },
      setMakeupIntensity: (category, intensity) =>
        set((state) => ({
          makeupIntensity: { ...state.makeupIntensity, [category]: intensity },
        })),

      // Compare mode (before/after)
      isCompareMode: false,
      comparePosition: 50,
      setCompareMode: (enabled) => set({ isCompareMode: enabled }),
      setComparePosition: (position) => set({ comparePosition: position }),

      // Skin analysis results
      skinAnalysis: null,
      setSkinAnalysis: (analysis) => set({ skinAnalysis: analysis }),

      // Favorites
      favorites: [],
      addFavorite: (look) =>
        set((state) => ({
          favorites: [...state.favorites, { ...look, id: Date.now(), savedAt: new Date().toISOString() }],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),

      // Tutorial
      showTutorial: true,
      setShowTutorial: (show) => set({ showTutorial: show }),

      // Current filter category
      activeCategory: 'all',
      setActiveCategory: (category) => set({ activeCategory: category }),

      // Face detection status
      isFaceDetected: false,
      setFaceDetected: (detected) => set({ isFaceDetected: detected }),

      // Face landmarks
      faceLandmarks: null,
      setFaceLandmarks: (landmarks) => set({ faceLandmarks: landmarks }),

      // Loading states
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),

      // Error state
      error: null,
      setError: (error) => set({ error: error }),
      clearError: () => set({ error: null }),

      // Captured image for sharing
      capturedImage: null,
      setCapturedImage: (image) => set({ capturedImage: image }),

      // Get current look as saveable object
      getCurrentLook: () => {
        const state = get();
        return {
          products: state.selectedProducts,
          shades: state.selectedShades,
          intensity: state.makeupIntensity,
        };
      },

      // Apply a saved look
      applyLook: (look) =>
        set({
          selectedProducts: look.products,
          selectedShades: look.shades,
          makeupIntensity: look.intensity,
        }),
    }),
    {
      name: 'beauty-tryon-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        showTutorial: state.showTutorial,
      }),
    }
  )
);

export default useStore;
