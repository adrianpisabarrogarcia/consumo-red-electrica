import { Component } from "react";
import { Panel } from "primereact/panel";

export class PriceSummary extends Component {
  render() {
    return (
      <section>
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-info-circle mr-2"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
            <path d="M12 9h.01" />
            <path d="M11 12h1v4h1" />
          </svg>
          Los precios mostrados están en €/kWh. La franja recomendada se calcula
          buscando el tramo contiguo de 1 hora con menor precio medio.
        </div>
        <div className="p-4 mt-4 flex flex-row gap-4">
          <Panel header="Mejor Franja" className="flex-1">
            <p className="m-0 text-center font-bold text-2xl">02-03 (1 hora)</p>
            <p className="m-0 text-center text-gray-500">88.80 c€/kWh</p>
          </Panel>
          <Panel header="Hora más barata" className="flex-1">
            <p className="m-0 text-center font-bold text-2xl">02-03</p>
            <p className="m-0 text-center text-gray-500">0.089 €/kWh</p>
          </Panel>
          <Panel header="Precio medio del día" className="flex-1">
            <p className="m-0 text-center font-bold text-2xl">0.133 €/kWh</p>
          </Panel>
          <Panel header="Precio ahora" className="flex-1">
            <p className="m-0 text-center font-bold text-2xl">0.096 €/kWh</p>
          </Panel>
        </div>
      </section>
    );
  }
}

export default PriceSummary;
