from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, root_validator
import subprocess
import tempfile
import os
import shutil

app = FastAPI()

class SimulacionRequest(BaseModel):
    topologia: str
    nodos: str
    tuplas: int = Field(..., ge=1)  # Asegurando que 'tuplas' sea un número entero mayor que 0
    tasa_arrivo: str = None
    tiempo_simulacion: int = None

    @root_validator(pre=True)
    def validar_tiempo_simulacion(cls,values):
        tiempo_simulacion = values.get('tiempo_simulacion')
        if tiempo_simulacion is not None and tiempo_simulacion <=0:
            raise ValueError('El tiempo de simulación debe ser un número positivo')
        return values

@app.post("/simular")
async def ejecutar_simulacion(req: SimulacionRequest):
    comando = ["/app/Simulador", "-t", req.topologia, "-n", req.nodos, "-p", str(req.tuplas)]
    
    if req.tasa_arrivo:
        comando.extend(["-r", req.tasa_arrivo])
    if req.tiempo_simulacion:
        comando.extend(["-l", str(req.tiempo_simulacion)])

    try:
        #Se ejecuta el comando del simulador
        resultado = subprocess.run(comando, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if resultado.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Error en simulación: {resultado.stderr}")

        # Crear un archivo temporal para almacenar el resultado
        with tempfile.NamedTemporaryFile(delete=False, mode="w", newline="") as tmp_file:
            tmp_file.write(resultado.stdout)
            archivo_resultado = tmp_file.name

        # Devolver la ruta del archivo temporal (podrías también moverlo a una ubicación más permanente si lo prefieres)
        return {"archivo_resultado": archivo_resultado}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))