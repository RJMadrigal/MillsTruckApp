export type Language = 'en' | 'es';

export const CATEGORY_TRANSLATIONS: Record<string, { en: string; es: string }> = {
  // Motores / Engines
  'motores': { en: 'Engines', es: 'Motores' },
  'engines': { en: 'Engines', es: 'Motores' },
  'motor': { en: 'Engine', es: 'Motor' },
  'engine': { en: 'Engine', es: 'Motor' },
  'motores y turbos': { en: 'Engines & Turbos', es: 'Motores y Turbos' },
  'engines & turbos': { en: 'Engines & Turbos', es: 'Motores y Turbos' },

  // Camiones / Trucks
  'camiones': { en: 'Trucks', es: 'Camiones' },
  'trucks': { en: 'Trucks', es: 'Camiones' },
  'camión': { en: 'Truck', es: 'Camión' },
  'camion': { en: 'Truck', es: 'Camión' },
  'truck': { en: 'Truck', es: 'Camión' },

  // Frenos / Brakes
  'frenos': { en: 'Brakes', es: 'Frenos' },
  'brakes': { en: 'Brakes', es: 'Frenos' },
  'freno': { en: 'Brake', es: 'Freno' },
  'brake': { en: 'Brake', es: 'Freno' },
  'frenos de aire': { en: 'Air Brakes', es: 'Frenos de Aire' },
  'air brakes': { en: 'Air Brakes', es: 'Frenos de Aire' },

  // Transmisiones / Transmissions
  'transmisiones': { en: 'Transmissions', es: 'Transmisiones' },
  'transmissions': { en: 'Transmissions', es: 'Transmisiones' },
  'transmisión': { en: 'Transmission', es: 'Transmisión' },
  'transmision': { en: 'Transmission', es: 'Transmisión' },
  'transmission': { en: 'Transmission', es: 'Transmisión' },
  'transmisiones y embragues': { en: 'Transmissions & Clutches', es: 'Transmisiones y Embragues' },
  'transmissions & clutches': { en: 'Transmissions & Clutches', es: 'Transmisiones y Embragues' },
  'embragues': { en: 'Clutches', es: 'Embragues' },
  'clutches': { en: 'Clutches', es: 'Embragues' },

  // Suspensiones y Ejes
  'suspensiones y ejes': { en: 'Suspension & Axles', es: 'Suspensiones y Ejes' },
  'suspension & axles': { en: 'Suspension & Axles', es: 'Suspensiones y Ejes' },
  'suspensiones': { en: 'Suspension', es: 'Suspensiones' },
  'suspensión': { en: 'Suspension', es: 'Suspensión' },
  'suspension': { en: 'Suspension', es: 'Suspensión' },
  'ejes': { en: 'Axles', es: 'Ejes' },
  'axles': { en: 'Axles', es: 'Ejes' },
  'diferenciales': { en: 'Differentials', es: 'Diferenciales' },
  'differentials': { en: 'Differentials', es: 'Diferenciales' },

  // Combustible e Inyección
  'combustible e inyección': { en: 'Fuel & Injection', es: 'Combustible e Inyección' },
  'combustible e inyeccion': { en: 'Fuel & Injection', es: 'Combustible e Inyección' },
  'fuel & injection': { en: 'Fuel & Injection', es: 'Combustible e Inyección' },
  'inyección diésel': { en: 'Diesel Injection', es: 'Inyección Diésel' },
  'inyeccion diesel': { en: 'Diesel Injection', es: 'Inyección Diésel' },
  'diesel injection': { en: 'Diesel Injection', es: 'Inyección Diésel' },
  'inyección': { en: 'Injection', es: 'Inyección' },
  'inyeccion': { en: 'Injection', es: 'Inyección' },
  'injection': { en: 'Injection', es: 'Inyección' },

  // Filtros y Aceites
  'filtros y aceites': { en: 'Filters & Oil', es: 'Filtros y Aceites' },
  'filters & oil': { en: 'Filters & Oil', es: 'Filtros y Aceites' },
  'filtros': { en: 'Filters', es: 'Filtros' },
  'filters': { en: 'Filters', es: 'Filtros' },

  // Eléctrico
  'eléctrico': { en: 'Electrical', es: 'Eléctrico' },
  'electrico': { en: 'Electrical', es: 'Eléctrico' },
  'electrical': { en: 'Electrical', es: 'Eléctrico' },

  // Climatización y Cabina
  'cooling & heating': { en: 'Cooling & Heating', es: 'Enfriamiento y Calefacción' },
  'enfriamiento y calefacción': { en: 'Cooling & Heating', es: 'Enfriamiento y Calefacción' },
  'enfriamiento y calefaccion': { en: 'Cooling & Heating', es: 'Enfriamiento y Calefacción' },
  'cabin & body': { en: 'Cabin & Body', es: 'Cabina y Carrocería' },
  'cabina y carrocería': { en: 'Cabin & Body', es: 'Cabina y Carrocería' },
  'cabina y carroceria': { en: 'Cabin & Body', es: 'Cabina y Carrocería' },
  'cabinas': { en: 'Cabins', es: 'Cabinas' },
  'cabins': { en: 'Cabins', es: 'Cabinas' },
  'cabina': { en: 'Cabin', es: 'Cabina' },
  'cabin': { en: 'Cabin', es: 'Cabina' },

  // Turbos
  'turbos': { en: 'Turbos', es: 'Turbos' },
  'turbo': { en: 'Turbo', es: 'Turbo' },

  // Llantas / Tires
  'llantas': { en: 'Tires', es: 'Llantas' },
  'tires': { en: 'Tires', es: 'Llantas' },
  'llanta': { en: 'Tire', es: 'Llanta' },
  'tire': { en: 'Tire', es: 'Llanta' },
  'ruedas': { en: 'Wheels', es: 'Ruedas' },
  'wheels': { en: 'Wheels', es: 'Ruedas' },

  // Hidráulicos / Hydraulics
  'hidraulicos': { en: 'Hydraulics', es: 'Hidráulicos' },
  'hidráulicos': { en: 'Hydraulics', es: 'Hidráulicos' },
  'hydraulics': { en: 'Hydraulics', es: 'Hidráulicos' },
  'hidraulico': { en: 'Hydraulic', es: 'Hidráulico' },
  'hidráulico': { en: 'Hydraulic', es: 'Hidráulico' },
  'hydraulic': { en: 'Hydraulic', es: 'Hidráulico' },

  // Chasis / Chassis
  'chasis': { en: 'Chassis', es: 'Chasis' },
  'chassis': { en: 'Chassis', es: 'Chasis' },

  // Accesorios / Accessories
  'accesorios': { en: 'Accessories', es: 'Accesorios' },
  'accessories': { en: 'Accessories', es: 'Accesorios' },
  'accesorio': { en: 'Accessory', es: 'Accesorio' },
  'accessory': { en: 'Accessory', es: 'Accesorio' },

  // Otros / Other
  'otros': { en: 'Other', es: 'Otros' },
  'other': { en: 'Other', es: 'Otros' },
  'otro': { en: 'Other', es: 'Otro' },
  'others': { en: 'Other', es: 'Otros' },

  // Generales y Filtros Globales
  'repuestos generales': { en: 'General Parts', es: 'Repuestos Generales' },
  'general parts': { en: 'General Parts', es: 'Repuestos Generales' },
  'todos los repuestos': { en: 'All Parts', es: 'Todos los Repuestos' },
  'all parts': { en: 'All Parts', es: 'Todos los Repuestos' },
  'todos': { en: 'All', es: 'Todos' },
  'all': { en: 'All', es: 'Todos' },
};

export const translateCategoryName = (name: string, lang: Language): string => {
  if (!name) return '';
  const clean = name.trim().toLowerCase();
  const normalized = clean.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const match = CATEGORY_TRANSLATIONS[clean] || CATEGORY_TRANSLATIONS[normalized];
  if (match) {
    return match[lang];
  }

  // Búsqueda inteligente por coincidencia parcial si la categoría viene con texto adicional
  if (normalized.includes('motor') || normalized.includes('engine')) {
    return lang === 'en' ? 'Engines' : 'Motores';
  }
  if (normalized.includes('turbo')) {
    return lang === 'en' ? 'Turbos' : 'Turbos';
  }
  if (normalized.includes('freno') || normalized.includes('brake')) {
    return lang === 'en' ? 'Brakes' : 'Frenos';
  }
  if (normalized.includes('camion') || normalized.includes('truck')) {
    return lang === 'en' ? 'Trucks' : 'Camiones';
  }
  if (normalized.includes('transmisi') || normalized.includes('transmission')) {
    return lang === 'en' ? 'Transmissions' : 'Transmisiones';
  }
  if (normalized.includes('llanta') || normalized.includes('tire') || normalized.includes('wheel')) {
    return lang === 'en' ? 'Tires' : 'Llantas';
  }
  if (normalized.includes('hidraul') || normalized.includes('hydraul')) {
    return lang === 'en' ? 'Hydraulics' : 'Hidráulicos';
  }
  if (normalized.includes('cabin')) {
    return lang === 'en' ? 'Cabins' : 'Cabinas';
  }
  if (normalized.includes('chasi') || normalized.includes('frame')) {
    return lang === 'en' ? 'Chassis' : 'Chasis';
  }
  if (normalized.includes('accesori') || normalized.includes('accessori')) {
    return lang === 'en' ? 'Accessories' : 'Accesorios';
  }
  if (normalized.includes('diferencial') || normalized.includes('differential')) {
    return lang === 'en' ? 'Differentials' : 'Diferenciales';
  }
  if (normalized.includes('suspensi') || normalized.includes('suspension')) {
    return lang === 'en' ? 'Suspension' : 'Suspensión';
  }
  if (normalized.includes('inyecc') || normalized.includes('inject')) {
    return lang === 'en' ? 'Injection' : 'Inyección';
  }
  if (normalized.includes('filtr') || normalized.includes('filter')) {
    return lang === 'en' ? 'Filters' : 'Filtros';
  }
  if (normalized.includes('otro') || normalized.includes('other') || normalized.includes('misc')) {
    return lang === 'en' ? 'Other' : 'Otros';
  }

  return name;
};

export const TRANSLATIONS = {
  en: {
    // Navigation
    nav_home: 'Home',
    nav_categories: 'Categories',
    nav_requests: 'Cart',
    nav_info: 'Info',

    // Common / Global
    contact_sales: 'Contact to sales',
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    price: 'Price',
    all: 'All',
    clear_filter: 'Clear filter',
    show_all: 'Show all',
    search: 'Search',
    view_all: 'View All',
    close: 'Close',
    error: 'Error',
    loading: 'Loading...',

    // Header & Quick Actions
    parts_in_stock: 'Parts in Stock',
    towing_service: 'Towing 24/7',
    search_placeholder: 'Search parts, trucks, VIN, SKU...',
    category_filter_active: 'Category Filter Active',

    // Catalog Sections
    section_parts_trucks: 'Parts & Trucks',
    section_all_inventory: 'All Inventory',
    section_your_activity: 'Your Activity',
    tab_recommended: 'Recommended',
    tab_recently_visited: 'Recently visited',
    tab_most_visited: 'Most visited',

    // Empty States
    no_recent_items: 'No recently viewed items yet.',
    no_most_visited: 'No frequent items yet.',
    no_products_found: 'No products found in this category.',
    view_all_products: 'View All Products',

    // Category Screen
    departments_found: 'departments found',
    no_categories_match: 'No categories match your search.',
    view_all_categories: 'View All Categories',
    search_categories_placeholder: 'Search categories & parts...',

    // Product Detail
    product_details: 'Product Details',
    truck_details: 'Truck Details',
    specifications: 'Specifications',
    make: 'Make',
    model: 'Model',
    year: 'Year',
    vin_chassis: 'VIN / Chassis',
    mileage: 'Mileage',
    engine: 'Engine',
    transmission: 'Transmission',
    category: 'Category',
    warehouse: 'Warehouse',
    add_to_request: 'Add to Cart',
    consult_vin: 'Consult VIN & Pricing',
    photos_count: 'photos',

    // Cart / Requests
    your_request: 'My Cart',
    empty_request: 'Your cart is empty.',
    start_browsing: 'Start browsing the catalog to add heavy truck parts and trucks to your cart.',
    explore_catalog: 'Explore Catalog',
    request_summary: 'Cart Summary',
    estimated_total: 'Estimated Total',
    proceed_to_request: 'Proceed to Checkout',
    order_confirmation: 'Order Request Confirmed!',
    order_number: 'Order Number',
    order_thank_you: 'Thank you for your order request. A sales advisor will contact you shortly.',
    follow_up_whatsapp: 'Follow up via WhatsApp',

    // Checkout
    customer_info: 'Customer Information',
    full_name: 'Full Name',
    full_name_placeholder: 'e.g. John Doe',
    phone_whatsapp: 'Phone / WhatsApp',
    delivery_address: 'Delivery Address / City',
    delivery_address_placeholder: 'City, State or Postal Code',
    notes_requirements: 'Notes / Part or VIN Requirements',
    notes_placeholder: 'Specify any details, year, or questions about the parts...',
    preferred_contact: 'Preferred Contact Method',
    submit_request: 'Submit Order Request',
    sending: 'Sending request...',

    // Info Screen
    app_language: 'App Language',
    language_desc: 'Select your preferred display language',
    locations_title: 'Locations',
    direct_channels: 'Direct Attention Channels',
    call_usa: 'Call USA',
    whatsapp_sales: 'WhatsApp Sales',
    send_email: 'Send Email',
    store_policies: 'Store Policies & Legal',
    privacy_policy: 'Privacy Policy',
    terms_conditions: 'Terms and Conditions',
    refund_warranty: 'Refund & Warranty Policy',
    shipping_policy: 'Shipping Policy',
    company_transparency: 'Company Transparency',
    server_online: 'System Online',
    usa_easton: 'USA - Easton, PA',
    cr_sanjose: 'Costa Rica - San José',
    phone_coming_soon: '+506 7033-4308',
  },
  es: {
    // Navigation
    nav_home: 'Inicio',
    nav_categories: 'Categorías',
    nav_requests: 'Carrito',
    nav_info: 'Info',

    // Common / Global
    contact_sales: 'Contactar a ventas',
    in_stock: 'Disponible',
    out_of_stock: 'Agotado',
    price: 'Precio',
    all: 'Todo',
    clear_filter: 'Limpiar filtro',
    show_all: 'Ver todo',
    search: 'Buscar',
    view_all: 'Ver Todo',
    close: 'Cerrar',
    error: 'Error',
    loading: 'Cargando...',

    // Header & Quick Actions
    parts_in_stock: 'Repuestos en Bodega',
    towing_service: 'Grúas 24/7',
    search_placeholder: 'Buscar repuestos, camiones, VIN, SKU...',
    category_filter_active: 'Filtro de Categoría Activo',

    // Catalog Sections
    section_parts_trucks: 'Repuestos y Camiones',
    section_all_inventory: 'Todo el Inventario',
    section_your_activity: 'Tu Actividad',
    tab_recommended: 'Recomendados',
    tab_recently_visited: 'Vistos recientemente',
    tab_most_visited: 'Más visitados',

    // Empty States
    no_recent_items: 'Aún no has visto repuestos recientemente.',
    no_most_visited: 'Aún no tienes repuestos frecuentes.',
    no_products_found: 'No hay productos en esta categoría.',
    view_all_products: 'Ver Todos los Productos',

    // Category Screen
    departments_found: 'departamentos encontrados',
    no_categories_match: 'No hay categorías que coincidan con la búsqueda.',
    view_all_categories: 'Ver Todas las Categorías',
    search_categories_placeholder: 'Buscar categorías y repuestos...',

    // Product Detail
    product_details: 'Detalle del Repuesto',
    truck_details: 'Detalle del Camión',
    specifications: 'Especificaciones Técnicas',
    make: 'Marca',
    model: 'Modelo',
    year: 'Año',
    vin_chassis: 'VIN / Chasis',
    mileage: 'Kilometraje / Millaje',
    engine: 'Motor',
    transmission: 'Transmisión',
    category: 'Categoría',
    warehouse: 'Bodega / Almacén',
    add_to_request: 'Agregar al Carrito',
    consult_vin: 'Consultar VIN y Precio',
    photos_count: 'fotos',

    // Cart / Requests
    your_request: 'Mi Carrito',
    empty_request: 'Tu carrito está vacío.',
    start_browsing: 'Explora el catálogo para agregar repuestos pesados a tu carrito de compras.',
    explore_catalog: 'Explorar Catálogo',
    request_summary: 'Resumen del Carrito',
    estimated_total: 'Total Estimado',
    proceed_to_request: 'Continuar con el pedido',
    order_confirmation: '¡Solicitud de Pedido Confirmada!',
    order_number: 'Número de Orden',
    order_thank_you: 'Gracias por enviar tu cotización. Un asesor de ventas te contactará a la brevedad.',
    follow_up_whatsapp: 'Seguimiento por WhatsApp',

    // Checkout
    customer_info: 'Datos del Cliente',
    full_name: 'Nombre Completo',
    full_name_placeholder: 'Ej. Juan Pérez',
    phone_whatsapp: 'Teléfono / WhatsApp',
    delivery_address: 'Dirección o Ciudad de Entrega',
    delivery_address_placeholder: 'Ciudad, Estado o Código Postal',
    notes_requirements: 'Notas o Requerimientos de la Pieza (VIN)',
    notes_placeholder: 'Detalla cualquier pregunta, año o especificación del repuesto...',
    preferred_contact: 'Método de Contacto Preferido',
    submit_request: 'Enviar Solicitud de Pedido',
    sending: 'Enviando solicitud...',

    // Info Screen
    app_language: 'Idioma de la App',
    language_desc: 'Selecciona tu idioma preferido',
    locations_title: 'Ubicaciones',
    direct_channels: 'Canales de Atención Directa',
    call_usa: 'Llamar a USA',
    whatsapp_sales: 'WhatsApp Ventas',
    send_email: 'Enviar Correo',
    store_policies: 'Políticas y Legal de Tienda',
    privacy_policy: 'Política de Privacidad',
    terms_conditions: 'Términos y Condiciones',
    refund_warranty: 'Garantías y Devoluciones',
    shipping_policy: 'Políticas de Envío',
    company_transparency: 'Transparencia Corporativa',
    server_online: 'Servidor En Línea',
    usa_easton: 'USA - Easton, PA',
    cr_sanjose: 'Costa Rica - San José',
    phone_coming_soon: '+506 7033-4308',
  },
};

export type TranslationKey = keyof typeof TRANSLATIONS.en;
