import useStore from '../store/useStore';
import { FiTrash2, FiPlay, FiX } from 'react-icons/fi';

const Favorites = ({ onClose }) => {
  const { favorites, removeFavorite, applyLook } = useStore();

  const handleApplyLook = (look) => {
    applyLook(look);
    onClose?.();
  };

  // Get products list for a look
  const getLookProducts = (look) => {
    return Object.entries(look.products)
      .filter(([_, product]) => product !== null)
      .map(([key, product]) => ({
        key,
        product,
        shade: look.shades[key],
      }));
  };

  return (
    <div className="h-full flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-pink-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-semibold text-gray-800">Saved Looks</h2>
          <p className="text-gray-500 text-sm">{favorites.length} looks saved</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-pink-100 rounded-full transition-colors"
        >
          <FiX className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💄</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No saved looks yet</h3>
            <p className="text-gray-500 text-sm">
              Try on some makeup and save your favorite looks to see them here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((look) => {
              const products = getLookProducts(look);

              return (
                <div
                  key={look.id}
                  className="bg-white rounded-2xl p-4 shadow-md border border-pink-100 hover:shadow-lg transition-shadow"
                >
                  {/* Look preview - color swatches */}
                  <div className="flex gap-1 mb-3">
                    {products.slice(0, 5).map(({ key, shade }) => (
                      <div
                        key={key}
                        className="w-8 h-8 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: shade?.hex || '#f0f0f0' }}
                        title={shade?.name}
                      />
                    ))}
                    {products.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                        +{products.length - 5}
                      </div>
                    )}
                  </div>

                  {/* Look info */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-500">
                      {new Date(look.savedAt).toLocaleDateString()} • {products.length} products
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {products.map(({ key, product }) => (
                        <span
                          key={key}
                          className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full"
                        >
                          {product.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApplyLook(look)}
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      <FiPlay className="w-4 h-4" />
                      Apply Look
                    </button>
                    <button
                      onClick={() => removeFavorite(look.id)}
                      className="p-2 hover:bg-red-100 rounded-full transition-colors group"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
