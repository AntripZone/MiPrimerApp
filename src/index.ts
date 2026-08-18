import express from 'express';
import fs from "node:fs/promises";
import path from "node:path";
import type {Request, Response} from "express";

const app = express();
const PORT = 3000;

app.listen(PORT, async function () {
  await cargarDatos();
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use(express.json());

interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  bootcamp: string;
}

let estudiantes: Estudiante[] = [];

async function cargarDatos() {
  try {
    const ruta = path.resolve("src/estudiantes.json");
    const data = await fs.readFile(ruta, "utf-8");
    estudiantes = JSON.parse(data);
    console.log(estudiantes);
    console.log(
      `DATOS CARGADOS EN MEMORIA: ${estudiantes.length} estudiantes cargados`,
    );
  } catch (error) {
    console.log("No se encontraron estudiantes en la lista");
    estudiantes = [];
  }
}

/* Traer Estudiantes */
app.get("/estudiantes", async function (req: Request, res: Response) {
  res.json(estudiantes);
});

/* Crear Estudiantes */
interface crearEstudiante {
  nombre: string;
  email: string;
  bootcamp: string;
}

app.post(
  "/estudiantes",
  function (req: Request<{}, {}, crearEstudiante>, res: Response) {
    const { nombre, email, bootcamp } = req.body;
    if (!nombre || !email || !bootcamp) {
      return res.status(400).json({ error: "Faltan datos que son obligatorios." });
    }
    const nuevoEstudiante: Estudiante = {
      id:
        estudiantes.length > 0
          ? estudiantes.length + 1
          : 1,
          nombre,
          email,
          bootcamp,
    };
    estudiantes.push(nuevoEstudiante);
    res.status(201).json(nuevoEstudiante);
  },
);

interface actualizarEstudiante {
  nombre: string;
  email: string;
  bootcamp: string;
}
app.put("/estudiantes/:id", function (req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const index = estudiantes.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res.status(404).json({ error: "Estudiante no encontrado." });
  } else {
    const { nombre, email, bootcamp }: actualizarEstudiante =
      req.body;

    estudiantes[index] = {
      id: idBuscado,
      nombre: nombre ?? estudiantes[index]?.nombre,
      email: email ?? estudiantes[index]?.email,
      bootcamp: bootcamp ?? estudiantes[index]?.bootcamp
    };
    res.json(estudiantes[index]);
  }
});

app.delete("/estudiantes/:id", function (req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const index = estudiantes.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res
      .status(404)
      .json({ error: "Estudiante no encontrado." });
  } else {
    estudiantes = estudiantes.filter(
      (e) => e.id !== idBuscado,
    );
    res.json({ mensaje: "Estudiante eliminado con éxito." });
  }
});

/*app.get("/api/status", async function(req: Request, res:Response) {
    res.json({status: "Servidor en línea", version: "1.0.0" });
    res.json({mensaje: `Version de Node: ${process.version}`});
});*/