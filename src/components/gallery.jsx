 
 
 
 const Gallery = ()=> {<Container fluid className="p-8">
  {/* Color Mode Selector */}
  <div className="flex justify-center mb-6">
    <div className="inline-flex rounded-lg border border-gray-300 p-1 bg-white">
      <button 
        className={`px-4 py-2 rounded-md transition-all ${
          colorMode === 'purple' 
            ? 'bg-purple-500 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => setColorMode('purple')}
      >
        💜 Purple
      </button>
      <button 
        className={`px-4 py-2 rounded-md transition-all ${
          colorMode === 'cyan' 
            ? 'bg-cyan-500 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => setColorMode('cyan')}
      >
        🩵 Cyan
      </button>
      <button 
        className={`px-4 py-2 rounded-md transition-all ${
          colorMode === 'green' 
            ? 'bg-green-500 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => setColorMode('green')}
      >
        💚 Green
      </button>
    </div>
  </div>

  {/* Gallery Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {gallery.map((item ) => {
      const imageUrl = item.type === 'file' 
        ? `https://maybeart.app${item.imageUrl}` 
        : item.url;
      
      const isSelected = selectedImage?.id === item.id;
      
      // Color variants for selected state
      const selectedStyles = {
        purple: 'border-purple-500 bg-purple-50 shadow-[0_0_25px_rgba(153,69,255,0.8)]',
        cyan: 'border-cyan-500 bg-cyan-50 shadow-[0_0_25px_rgba(34,211,238,0.8)]',
        green: 'border-green-500 bg-green-50 shadow-[0_0_25px_rgba(16,185,129,0.8)]'
      };
      
      const selectedTitleStyles = {
        purple: 'text-purple-600 font-bold',
        cyan: 'text-cyan-600 font-bold',
        green: 'text-green-600 font-bold'
      };
      
      return (
        <div
          key={item.id}
          onClick={() => {
            setSelectedImage(item);
            setId(item.id);
            setUri(`${API}${item.id}`);
            setName(item.title);
            setSymbol('ART');
          }}
          className={`
            bg-white rounded-lg overflow-hidden cursor-pointer
            transition-all duration-300 hover:-translate-y-2
            ${isSelected 
              ? `border-4 scale-105 ${selectedStyles[colorMode]}` 
              : 'border-2 border-gray-300 hover:shadow-lg'
            }
          `}
        >
          {/* Image */}
          <img 
            src={imageUrl}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
          
          {/* Content */}
          <div className="p-4">
            <h3 className={`
              text-lg mb-2 font-orbitron
              ${isSelected ? selectedTitleStyles[colorMode] : 'text-gray-800'}
            `}>
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {item.description}
            </p>
          </div>
        </div>
      );
    })}
  </div>
</Container>}

export default Gallery