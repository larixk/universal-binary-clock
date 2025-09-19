function Footer() {
  return (
    <div className="footer">
      <a
        href="https://github.com/larixk/universal-binary-clock"
        target="_blank"
      >
        A binary clock of seconds since the Big Bang
      </a>
      <br />
      <a href="https://larixk.nl" target="_blank">
        Larix Kortbeek
      </a>
      ,{" "}
      <a href="https://plusoneamsterdam.com" target="_blank">
        PlusOne Amsterdam
      </a>
      , 2025
      <br />
      {new Date().toLocaleString("en-US", { timeZone: "UTC" })} UTC
    </div>
  );
}

export default Footer;
