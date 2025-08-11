function Footer() {
  return (
    <footer className="p-4 text-center">
      <p className="text-gray-500 font-bold mb-2">
        Desarrollado por{" "}
        <a
          href="https://adrianpisabarro.com"
          target="_blank"
          className="hover:underline"
        >
          Adrián Pisabarro
        </a>{" "}
        con mucho 💙
      </p>
      <p className="text-sm text-gray-500">
        Toma las ideas que necesites, y si te sobran algunas,{" "}
        <a
          href="https://github.com/adrianpisabarrogarcia/consumo-red-electrica"
          target="_blank"
          className="hover:underline"
        >
          déjalas aquí
        </a>{" "}
        😉
      </p>
    </footer>
  );
}
export default Footer;
