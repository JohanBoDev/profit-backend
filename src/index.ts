import app from './app';
import { prisma } from './db/prisma';

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de desconexión de Prisma al cerrar
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    server.close(() => {
        console.log('Servidor y conexión a la base de datos cerrados.');
        process.exit(0);
    });
});
