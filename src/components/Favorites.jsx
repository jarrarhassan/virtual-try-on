import useStore from '../store/useStore';
import { FiTrash2, FiPlay } from 'react-icons/fi';

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
    <div className="h-full flex flex-col bg-cream">
      {/* Header */}
      <div className="p-5 border-b border-neutral-100 bg-white">
        <h2 className="text-xl font-serif font-medium text-charcoal">Saved Looks</h2>
        <p className="text-muted text-sm mt-1">{favorites.length} looks saved</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-luxury p-5">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-serif font-medium text-charcoal mb-2">
              No saved looks yet
            </h3>
            <p className="text-muted text-sm max-w-xs mx-auto leading-relaxed">
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
                  className="bg-white rounded-xl p-5 border border-neutral-100 hover:shadow-medium transition-luxury animate-fade-in"
                >
                  {/* Look preview - color swatches */}
                  <div className="flex gap-2 mb-4">
                    {products.slice(0, 5).map(({ key, shade }) => (
                      <div
                        key={key}
                        className="w-9 h-9 rounded-full shadow-soft"
                        style={{ backgroundColor: shade?.hex || '#f0f0f0' }}
                        title={shade?.name}
                      />
                    ))}
                    {products.length > 5 && (
                      <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-xs text-muted font-medium">
                        +{products.length - 5}
                      </div>
                    )}
                  </div>

                  {/* Look info */}
                  <div className="mb-4">
                    <p className="text-xs text-muted mb-2">
                      {new Date(look.savedAt).toLocaleDateString()} · {products.length} products
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {products.map(({ key, product }) => (
                        <span
                          key={key}
                          className="px-2.5 py-1 bg-cream text-charcoal text-xs rounded-full"
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
                      className="flex-1 py-2.5 px-4 bg-charcoal text-cream font-medium text-sm rounded-full flex items-center justify-center gap-2 hover:bg-neutral-800 transition-luxury"
                    >
                      <FiPlay className="w-4 h-4" />
                      Apply Look
                    </button>
                    <button
                      onClick={() => removeFavorite(look.id)}
                      className="p-2.5 hover:bg-neutral-100 rounded-full transition-luxury group"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4 text-muted group-hover:text-charcoal" />
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
