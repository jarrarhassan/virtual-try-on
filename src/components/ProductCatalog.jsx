import { useState, useMemo } from 'react';
import { products, categories } from '../data/products';
import useStore from '../store/useStore';
import { FiCheck, FiX } from 'react-icons/fi';

// Category mapping without emojis
const categoryLabels = {
  all: 'All',
  lips: 'Lips',
  face: 'Face',
  eyes: 'Eyes',
  brows: 'Brows',
};

const ProductCatalog = () => {
  const {
    activeCategory,
    setActiveCategory,
    selectedProducts,
    selectedShades,
    setSelectedProduct,
    setSelectedShade,
    clearProduct,
    makeupIntensity,
    setMakeupIntensity,
  } = useStore();

  const [expandedProduct, setExpandedProduct] = useState(null);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  // Get the makeup type key from product type
  const getProductKey = (product) => {
    const typeMap = {
      'lipstick': 'lips',
      'lip gloss': 'lips',
      'foundation': 'foundation',
      'blush': 'blush',
      'contour': 'contour',
      'highlighter': 'highlighter',
      'eyeshadow': 'eyeshadow',
      'eyeliner': 'eyeliner',
      'mascara': 'mascara',
      'brow': 'brow',
    };
    return typeMap[product.type] || product.category;
  };

  const handleSelectShade = (product, shade) => {
    const key = getProductKey(product);
    setSelectedProduct(key, product);
    setSelectedShade(key, shade);
    setExpandedProduct(null);
  };

  const handleClearProduct = (product) => {
    const key = getProductKey(product);
    clearProduct(key);
    setExpandedProduct(null);
  };

  const isProductSelected = (product) => {
    const key = getProductKey(product);
    return selectedProducts[key]?.id === product.id;
  };

  const getSelectedShadeForProduct = (product) => {
    const key = getProductKey(product);
    if (selectedProducts[key]?.id === product.id) {
      return selectedShades[key];
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* Header */}
      <div className="p-5 border-b border-neutral-100 bg-white">
        <h2 className="text-xl font-serif font-medium text-charcoal mb-4">
          Collection
        </h2>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`category-tab ${
                activeCategory === cat.id ? 'active' : ''
              }`}
            >
              {categoryLabels[cat.id]}
            </button>
          ))}
        </div>
      </div>

      {/* Product list */}
      <div className="flex-1 overflow-y-auto scrollbar-luxury p-5 space-y-4">
        {filteredProducts.map((product) => {
          const isSelected = isProductSelected(product);
          const selectedShade = getSelectedShadeForProduct(product);
          const isExpanded = expandedProduct === product.id;
          const productKey = getProductKey(product);

          return (
            <div
              key={product.id}
              className={`product-card animate-fade-in ${
                isSelected ? 'selected' : ''
              }`}
            >
              {/* Product header */}
              <div
                className="flex items-start gap-4 cursor-pointer"
                onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
              >
                {/* Large color swatch */}
                <div
                  className="shade-swatch-lg flex-shrink-0 transition-transform duration-200 hover:scale-105"
                  style={{
                    backgroundColor: selectedShade?.hex || product.shades[0]?.hex || '#f0f0f0'
                  }}
                />

                {/* Product info */}
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="text-xs text-muted font-medium tracking-wide uppercase mb-1">
                    {product.brand}
                  </p>
                  <h3 className="font-semibold text-charcoal text-base leading-tight truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted mt-1 capitalize">
                    {product.type} · {product.finish}
                  </p>

                  {selectedShade && (
                    <p className="text-xs text-gold-dark mt-2 flex items-center gap-1.5 font-medium">
                      <FiCheck className="w-3 h-3" />
                      {selectedShade.name}
                    </p>
                  )}
                </div>

                {/* Clear button when selected */}
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearProduct(product);
                    }}
                    className="p-2 hover:bg-neutral-100 rounded-full transition-luxury"
                  >
                    <FiX className="w-4 h-4 text-muted" />
                  </button>
                )}
              </div>

              {/* Expanded shade selection */}
              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-neutral-100 animate-slide-up">
                  <p className="text-sm font-medium text-charcoal mb-4">
                    Select Shade
                  </p>

                  {/* Shade swatches */}
                  <div className="flex flex-wrap gap-3 mb-5">
                    {product.shades.map((shade) => (
                      <button
                        key={shade.id}
                        onClick={() => handleSelectShade(product, shade)}
                        className={`shade-swatch ${
                          selectedShade?.id === shade.id ? 'active' : ''
                        }`}
                        style={{ backgroundColor: shade.hex }}
                        title={shade.name}
                      />
                    ))}
                  </div>

                  {/* Shade name display */}
                  {selectedShade && (
                    <p className="text-sm text-muted mb-4">
                      Selected: <span className="text-charcoal font-medium">{selectedShade.name}</span>
                    </p>
                  )}

                  {/* Intensity slider */}
                  {isSelected && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-muted">Intensity</span>
                        <span className="text-sm font-medium text-gold-dark">
                          {makeupIntensity[productKey]}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={makeupIntensity[productKey]}
                        onChange={(e) => setMakeupIntensity(productKey, parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Try On button */}
                  <button
                    onClick={() => {
                      if (!selectedShade && product.shades.length > 0) {
                        handleSelectShade(product, product.shades[0]);
                      }
                    }}
                    className={`w-full mt-5 py-3 rounded-full font-medium text-sm tracking-wide transition-luxury ${
                      isSelected
                        ? 'bg-neutral-100 text-muted cursor-default'
                        : 'bg-charcoal text-cream hover:bg-neutral-800'
                    }`}
                    disabled={isSelected}
                  >
                    {isSelected ? 'Applied' : 'Try On'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick clear all */}
      {Object.values(selectedProducts).some(p => p !== null) && (
        <div className="p-5 border-t border-neutral-100 bg-white">
          <button
            onClick={() => useStore.getState().clearAllProducts()}
            className="w-full py-3 text-muted font-medium text-sm hover:text-charcoal hover:bg-neutral-50 rounded-full transition-luxury"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
