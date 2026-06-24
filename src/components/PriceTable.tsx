import React, { useState, useMemo } from "react";
import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column, type ColumnFilterElementTemplateOptions } from "primereact/column";
import { type HourlyPrice } from "../utils/priceCalculations";
import { FilterMatchMode } from "primereact/api";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";

interface PriceTableProps {
  prices: HourlyPrice[];
  averagePrice: number;
}

interface ProcessedHourlyPrice extends HourlyPrice {
  hourStr: string;
  status: "Barata" | "Normal" | "Cara";
}

export const PriceTable: React.FC<PriceTableProps> = ({ prices, averagePrice }) => {
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    hourStr: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  // Map prices to processed items adding formatted hourStr and status
  const processedPrices = useMemo<ProcessedHourlyPrice[]>(() => {
    return prices.map((p) => {
      const start = String(p.hour).padStart(2, "0");
      const end = p.hour === 23 ? "24" : String(p.hour + 1).padStart(2, "0");
      const hourStr = `${start}:00 - ${end}:00`;

      const lowerThreshold = 0.9 * averagePrice;
      const upperThreshold = 1.1 * averagePrice;
      let status: "Barata" | "Normal" | "Cara" = "Normal";
      if (p.price < lowerThreshold) {
        status = "Barata";
      } else if (p.price > upperThreshold) {
        status = "Cara";
      }

      return {
        ...p,
        hourStr,
        status,
      };
    });
  }, [prices, averagePrice]);



  const hourTemplate = (rowData: ProcessedHourlyPrice) => {
    return (
      <div className="flex items-center gap-2 font-medium text-slate-300">
        <span className="pi pi-calendar-times text-slate-500 text-sm"></span>
        <span>{rowData.hourStr}</span>
      </div>
    );
  };

  const priceTemplate = (rowData: ProcessedHourlyPrice) => {
    return (
      <span className="font-semibold text-slate-200">
        {rowData.price.toFixed(4)} €/kWh
      </span>
    );
  };

  const statusTemplate = (rowData: ProcessedHourlyPrice) => {
    const status = rowData.status;

    if (status === "Barata") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Barata
        </span>
      );
    } else if (status === "Cara") {
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

  // 24 hour ranges array: ['00:00 - 01:00', '01:00 - 02:00', ..., '23:00 - 24:00']
  const hourRanges = Array.from({ length: 24 }, (_, i) => {
    const start = String(i).padStart(2, "0");
    const end = i === 23 ? "24" : String(i + 1).padStart(2, "0");
    return `${start}:00 - ${end}:00`;
  });

  const hourFilterElement = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={hourRanges}
        onChange={(e: DropdownChangeEvent) => {
          options.filterApplyCallback(e.value);
        }}
        placeholder="Todos"
        className="w-full text-xs"
        showClear
        style={{ minWidth: "10rem" }}
      />
    );
  };

  const statusFilterElement = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={["Barata", "Normal", "Cara"]}
        onChange={(e: DropdownChangeEvent) => {
          options.filterApplyCallback(e.value);
        }}
        placeholder="Todos"
        className="w-full text-xs"
        showClear
        style={{ minWidth: "8rem" }}
      />
    );
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
          value={processedPrices}
          filters={filters}
          onFilter={(e) => setFilters({ ...e.filters })}
          filterDisplay="row"
          responsiveLayout="scroll"
          className="p-datatable-custom"
          emptyMessage="No hay datos de precios disponibles."
          rowClassName={() => "hover:bg-slate-900/40 transition-colors duration-200 border-b border-slate-900"}
        >
          <Column
            field="hourStr"
            header="Hora"
            body={hourTemplate}
            sortable
            filter
            filterMatchMode="equals"
            filterElement={hourFilterElement}
            showFilterMenu={false}
            headerStyle={{ backgroundColor: "rgba(15, 23, 42, 0.6)", color: "#94a3b8", fontWeight: "600", padding: "1rem 1.5rem" }}
            bodyStyle={{ padding: "1rem 1.5rem" }}
          />
          <Column
            field="price"
            header="Precio"
            body={priceTemplate}
            sortable
            headerStyle={{ backgroundColor: "rgba(15, 23, 42, 0.6)", color: "#94a3b8", fontWeight: "600", padding: "1rem 1.5rem" }}
            bodyStyle={{ padding: "1rem 1.5rem" }}
          />
          <Column
            field="status"
            header="Estado / Tarifa"
            body={statusTemplate}
            sortable
            filter
            filterMatchMode="equals"
            filterElement={statusFilterElement}
            showFilterMenu={false}
            headerStyle={{ backgroundColor: "rgba(15, 23, 42, 0.6)", color: "#94a3b8", fontWeight: "600", padding: "1rem 1.5rem" }}
            bodyStyle={{ padding: "1rem 1.5rem" }}
          />
        </DataTable>
      </div>
    </section>
  );
};

export default PriceTable;
