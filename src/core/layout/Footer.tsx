function Footer() {
  return (
    <footer className="p-4 text-center">
      <p className="text-slate-700 dark:text-slate-300 font-bold mb-2">
        Desarrollado por{" "}
        <a
          href="https://adrianpisabarro.com"
          target="_blank"
          className="hover:underline text-indigo-600 dark:text-indigo-400"
        >
          Adrián Pisabarro
        </a>{" "}
        con mucho 💙
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Toma las ideas que necesites, y si te sobran algunas,{" "}
        <a
          href="https://github.com/adrianpisabarrogarcia/consumo-red-electrica"
          target="_blank"
          className="hover:underline text-indigo-600 dark:text-indigo-400"
        >
          déjalas aquí
        </a>{" "}
        😉
      </p>
    </footer>
  );
}
export default Footer;
