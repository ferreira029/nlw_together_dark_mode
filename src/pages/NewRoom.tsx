import classNames from "classnames";
import { useState } from "react";
import { FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { database } from "../services/firebase";

import "../styles/auth.scss";

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();

  const { theme } = useTheme()

  const [newRoom, setNewRoom] = useState("");

  const handleCreateRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.replace(`/rooms/${firebaseRoom.key}`);
  };

  return (
    <div id="page-auth" className={classNames({ 'layout-dark': theme === 'dark' })}>
      <aside>
        <img src={illustrationImg} alt="Perguntas e respostas" />
        <strong>Crie salas de Q&am;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img className="logo-img" src={logoImg} alt="Letmeask" />
          <h2> Criar uma nova sala </h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              value={newRoom}
              onChange={(event) => setNewRoom(event.target.value)}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
