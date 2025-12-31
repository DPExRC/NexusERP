import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    // El token suele venir en el header 'Authorization' como: "Bearer TOKEN_AQUÍ"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. No se encontró un token de seguridad." });
    }

    try {
        // Verificamos si el token es válido usando nuestra palabra secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Guardamos los datos del usuario dentro del 'req' para que las rutas puedan usarlos
        req.user = decoded;
        
        // ¡Todo bien! Pasamos a la siguiente función (la ruta del Excel)
        next();
    } catch (error) {
        console.error("Error al verificar token:", error.message);
        res.status(403).json({ error: "Token inválido o expirado." });
    }
};