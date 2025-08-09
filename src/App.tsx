import "./App.css";
import Header from "./components/Header";
import PriceSummary from "./components/PriceSummary";
import PriceTable from "./components/PriceTable";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <main className="p-4">
        <PriceSummary />
        <PriceTable />
      </main>
      <Footer />
    </>
  );
}

export default App;
