import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { type HourlyPrice } from "../utils/priceCalculations";

interface PriceTableProps {
  prices: HourlyPrice[];
  averagePrice: number;
}

export const PriceTable: React.FC<PriceTableProps> = ({ prices, averagePrice }) => {
  const hourTemplate = (rowData: HourlyPrice) => {
    const start = String(rowData.hour).padStart(2, "0");
    const end = String((rowData.hour + 1) % 24).padStart(2, "0");
    return (
      <div className="flex items-center gap-2 font-medium text-slate-300">
        <span className="pi pi-calendar-times text-slate-500 text-sm"></span>
        <span>{start}:00 - {end}:00</span>
      </div>
    );
  };

  const priceTemplate = (rowData: HourlyPrice) => {
    return (
      <span className="font-semibold text-slate-200">
        {rowData.price.toFixed(4)} €/kWh
      </span>
    );
  };

  const statusTemplate = (rowData: HourlyPrice) => {
    const price = rowData.price;
    const lowerThreshold = 0.9 * averagePrice;
    const upperThreshold = 1.1 * averagePrice;

    if (price < lowerThreshold) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Barata
        </span>
      );
    } else if (price > upperThreshold) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
          Cara
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          Normal
        </span>
      );
    }
  };

  return (
    <section className="bg-slate-950/30 border border-slate-800/60 rounded-2xl p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <span className="pi pi-list text-xl text-indigo-400"></span>
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">Precios por horas</h2>
            <p className="text-xs text-slate-400">Desglose detallado del coste de la luz para las 24 horas del día</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/50">
        <DataTable
          value={prices}
          responsiveLayout="scroll"
          className="p-datatable-custom"
          emptyMessage="No hay datos de precios disponibles."
          rowClassName={() => "hover:bg-slate-900/40 transition-colors duration-200 border-b border-slate-900"}
        >
          <Column
            header="Hora"
            body={hourTemplate}
            headerStyle={{ backgroundColor: "rgba(15, 23, 42, 0.6)", color: "#94a3b8", fontWeight: "600", padding: "1rem 1.5rem" }}
            bodyStyle={{ padding: "1rem 1.5rem" }}
          />
          <Column
            header="Precio"
            body={priceTemplate}
            headerStyle={{ backgroundColor: "rgba(15, 23, 42, 0.6)", color: "#94a3b8", fontWeight: "600", padding: "1rem 1.5rem" }}
            bodyStyle={{ padding: "1rem 1.5rem" }}
          />
          <Column
            header="Estado / Tarifa"
            body={statusTemplate}
            headerStyle={{ backgroundColor: "rgba(15, 23, 42, 0.6)", color: "#94a3b8", fontWeight: "600", padding: "1rem 1.5rem" }}
            bodyStyle={{ padding: "1rem 1.5rem" }}
          />
        </DataTable>
      </div>
    </section>
  );
};

export default PriceTable;
