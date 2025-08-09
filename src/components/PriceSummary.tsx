import { Component } from "react"


export class PriceSummary extends Component {
  render() {
    return (
      <section>
        <div className="flex">
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
        <div className="p-4 mt-4 bg-gray-100 rounded-lg">
          

        </div>
      </section>
    );
  }
}

export default PriceSummary