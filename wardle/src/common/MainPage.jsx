import "./MainPage.css";

export default function MainPage() {
  return (
    <>
      <h1>WARdl!</h1>
      <div className="Userinput">
        <h2 className="title">Inicia sesión en tu cuenta</h2>
        <form>
          <input
            type="text"
            name="username"
            placeholder="NOMBRE DE USUARIO..."
          />
          <input type="password" name="password" placeholder="CONTRASEÑA..." />
          <button type="submit">➔</button>
        </form>
        <h2 className="title">
          <a href="/register" className="register">o crea una nueva cuenta</a>
        </h2>
      </div>
      <div className="Instructions">
        <a href="/rules">REGLAS DEL JUEGO</a>
        <a href="/about">CÓMO JUGAR</a>                    
        <a href="/visita">JUGAR COMO VISITA</a>{" "}        {/* todavía no existe la ruta */}
      </div>
    </>
  );
}
