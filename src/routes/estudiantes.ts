import {Router} from "express";
import fs from "node:fs/promises";
import path from "node:path";
import type {Request, Response} from "express";

const router = Router();

interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  bootcamp: string;
};

interface crearEstudiante {
  nombre: string;
  email: string;
  bootcamp: string;
};

interface actualizarEstudiante {
  nombre: string;
  email: string;
  bootcamp: string;
};

interface FiltrosEstudiante {
  bootcamp?: string;
}

let estudiantes: Estudiante[] = [];

export async function cargarDatos() {
  try {
    const ruta = path.resolve("src/estudiantes.json");
    const data = await fs.readFile(ruta, "utf-8");
    estudiantes = JSON.parse(data);
    console.log(
      `DATOS CARGADOS EN MEMORIA: ${estudiantes.length} estudiantes cargados`,
    );
  } catch (error) {
    console.log("No se encontraron estudiantes en la lista");
    estudiantes = [];
  }
}

router.get("/", async function (req: Request<{},{}, {}, FiltrosEstudiante>, res: Response) {
  const { bootcamp } = req.query;
  let resultado = [...estudiantes];

  if (bootcamp) {
    resultado = resultado.filter(
      (e) => e.bootcamp.toLowerCase() === bootcamp.toLowerCase()
    );
  }
  res.json(estudiantes);
});

/* Crear Estudiantes */


router.post(
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


router.put("/estudiantes/:id", function (req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const index = estudiantes.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res.status(404).json({ error: "Estudiante no encontrado." });
  } else {
    const { nombre, email, bootcamp }: actualizarEstudiante = req.body;

    estudiantes[index] = {
      id: idBuscado,
      nombre: nombre ?? estudiantes[index]?.nombre,
      email: email ?? estudiantes[index]?.email,
      bootcamp: bootcamp ?? estudiantes[index]?.bootcamp
    };
    res.json(estudiantes[index]);
  }
});

router.delete("/estudiantes/:id", function (req: Request, res: Response) {
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

export default router;