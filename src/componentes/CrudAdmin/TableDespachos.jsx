import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import { FormCierreDespacho } from "./FormCierreDespacho";

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);
  
  // Usamos la variable de entorno que definimos en .env
  const API_URL = import.meta.env.VITE_API_DESPACHOS;

  const despacho = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/despachos`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log(response.data);
      setDespachos(response.data);
    } catch (error) {
      console.error("Error al obtener despachos:", error);
    }
  };

  useEffect(() => {
    despacho();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [despachoSeleccionado, setDespachoSeleccionado] = useState(null);

  const handleAbrirModal = (despacho) => {
    setDespachoSeleccionado(despacho);
    setOpenModal(true);
  };

  return (
    <>
      <section className="grid text-center grid-cols-12 mb-8">
        <div className="col-span-12 flex justify-center">
          <div className="col-span-10 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white h-full overflow-hidden">
            <table className="table-fixed w-full">
              <thead>
                <tr className="py-10">
                  <th className="pr-10">Orden de despacho</th>
                  <th className="pr-10">Orden de compra</th>
                  <th className="pr-10">Dirección de entrega</th>
                  <th className="pr-10">Fecha despacho</th>
                  <th className="pr-10">Patente Camión</th>
                  <th className="pr-10">Estado</th>
                  <th className="pr-10">Intentos</th>
                  <th className="pr-10">Acción</th>
                </tr>
              </thead>
              <tbody>
                {despachos.map((despacho) => (
                  <tr key={despacho.idDespacho} className="border-t">
                    <td className="pr-10 py-10">{despacho.idDespacho}</td>
                    <td className="pr-10 py-10">{despacho.idCompra}</td>
                    <td className="pr-10 py-10">{despacho.direccionCompra}</td>
                    <td className="pr-10 py-10">{despacho.fechaDespacho}</td>
                    <td className="pr-10 py-10">{despacho.patenteCamion}</td>
                    <td className="pr-10 py-10">
                      {/* Corregido: usando la propiedad 'despachado' de tu entidad */}
                      {despacho.despachado
                        ? "Despacho entregado"
                        : "Despacho pendiente"}
                    </td>
                    <td className="pr-10 py-10">{despacho.intento}</td>
                    <td>
                      <button
                        onClick={() => handleAbrirModal(despacho)}
                        className="py-1 bg-orange-200 px-8 rounded-xl shadow-md hover:bg-orange-300/70 transition-all duration-300"
                      >
                        Cerrar despacho
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      <Modal onClose={() => setOpenModal(false)} open={openModal}>
        {despachoSeleccionado && (
          <FormCierreDespacho
            despacho={despachoSeleccionado}
            onClose={() => {
              setOpenModal(false);
              despacho(); // Refresca los datos al cerrar el modal
            }}
          />
        )}
      </Modal>
    </>
  );
};
