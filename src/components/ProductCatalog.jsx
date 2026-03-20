import { useState, useMemo } from 'react';
import { products, categories } from '../data/products';
import useStore from '../store/useStore';
import { FiHeart, FiCheck, FiX } from 'react-icons/fi';

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
    <div className="h-full flex flex-col bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-pink-100">
        <h2 className="text-xl font-display font-semibold text-gray-800 mb-3">Products</h2>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`category-tab whitespace-nowrap ${
                activeCategory === cat.id ? 'active' : ''
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredProducts.map((product) => {
          const isSelected = isProductSelected(product);
          const selectedShade = getSelectedShadeForProduct(product);
          const isExpanded = expandedProduct === product.id;
          const productKey = getProductKey(product);

          return (
            <div
              key={product.id}
              className={`product-card transition-all duration-300 ${
                isSelected ? 'ring-2 ring-pink-500 bg-pink-50' : ''
              }`}
            >
              {/* Product header */}
              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
              >
                {/* Product image / color preview */}
                <div
                  className="w-14 h-14 rounded-xl flex-shrink-0 shadow-md"
                  style={{
                    backgroundColor: selectedShade?.hex || product.shades[0]?.hex || '#f0f0f0'
                  }}
                />

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-pink-600 font-medium">{product.brand}</p>
                  <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500 capitalize">{product.type} • {product.finish}</p>

                  {selectedShade && (
                    <p className="text-xs text-pink-600 mt-1 flex items-center gap-1">
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
                    className="p-2 hover:bg-pink-100 rounded-full transition-colors"
                  >
                    <FiX className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Expanded shade selection */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-pink-100">
                  <p className="text-sm font-medium text-gray-700 mb-3">Select shade:</p>

                  {/* Shade swatches */}
                  <div className="flex flex-wrap gap-2 mb-4">
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
                    <p className="text-sm text-gray-600 mb-3">
                      Selected: <span className="font-medium">{selectedShade.name}</span>
                    </p>
                  )}

                  {/* Intensity slider */}
                  {isSelected && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Intensity</span>
                        <span className="text-sm font-medium text-pink-600">
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
                    className={`w-full mt-3 py-2.5 rounded-full font-medium transition-all ${
                      isSelected
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg'
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
        <div className="p-4 border-t border-pink-100">
          <button
            onClick={() => useStore.getState().clearAllProducts()}
            className="w-full py-2 text-pink-600 font-medium hover:bg-pink-50 rounded-full transition-colors"
          >
            Clear All Makeup
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
