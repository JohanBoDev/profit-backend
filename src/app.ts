import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import proyectosRoutes from './routes/proyectos.routes';
import personaProyectoRoutes from './routes/personaProyecto.routes';
import personaRoutes from './routes/persona.routes';
import usuarioRoutes from './routes/usuarios.routes';
import exportRoutes from './routes/export.routes';


// Rutas (más adelante las importarás aquí)


const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Ruta base de prueba
app.get('/api', (req, res) => {
    res.json({ message: '¡Bienvenido a la API de Profit!' });
});

// Montar rutas de módulos
app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/persona-proyecto', personaProyectoRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/export', exportRoutes);



export default app;
