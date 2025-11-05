// Get allowed origins from environment variables
const getAllowedOrigins = () => {
    const envOrigins = process.env.ALLOWED_ORIGINS;
    
    // Default origins for development
    const defaultOrigins = [
        'http://localhost:5173',
        'http://localhost:3000'
    ];
    
    if (envOrigins) {
        const prodOrigins = envOrigins.split(',').map(origin => origin.trim());
        return [...defaultOrigins, ...prodOrigins];
    }
    
    // Fallback for development
    return defaultOrigins;
};

const allowedOrigins = getAllowedOrigins();

const corsOptions = {
    origin: (origin, callback) => {
        // Log for debugging
        console.log('🌐 CORS Check - Origin:', origin);
        console.log('🔍 Allowed Origins:', allowedOrigins);
        
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            console.error('❌ CORS Error - Origin not allowed:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,  // Allow credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Explicitly allow methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Explicitly allow headers
    optionsSuccessStatus: 200
};

export default corsOptions;