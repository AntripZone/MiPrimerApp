import express from 'express';
import estudiantesRouter, {cargarDatos} from './routes/estudiantes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/estudiantes', estudiantesRouter);

app.listen(PORT, async function () {
  await cargarDatos();
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});









/* Traer Estudiantes */


/*app.get("/api/status", async function(req: Request, res:Response) {
    res.json({status: "Servidor en línea", version: "1.0.0" });
    res.json({mensaje: `Version de Node: ${process.version}`});
});*/