import { Component } from 'react'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default class PriceTable extends Component {
  products = [
    { code: 'P001', name: 'Laptop', category: 'Electronics', quantity: 10 },
    { code: 'P002', name: 'Mouse', category: 'Electronics', quantity: 25 },
    { code: 'P003', name: 'Keyboard', category: 'Electronics', quantity: 15 }
  ];

  render() {
    return (
      <DataTable value={this.products} tableStyle={{ minWidth: "50rem" }} className="m-4">
        <Column field="code" header="Code"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>
      </DataTable>
    );
  }
}
