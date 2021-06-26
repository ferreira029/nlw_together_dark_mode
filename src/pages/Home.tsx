import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleImg from "../assets/images/google-icon.svg";
import { Button } from "../components/Button";

import "../styles/auth.scss";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FormEvent } from "react";
import { useState } from "react";
import { database } from "../services/firebase";
import classNames from "classnames";
import { useTheme } from "../hooks/useTheme";

export function Home() {
  const history = useHistory();
  const [roomCode, setRoomCode] = useState("");

  const { theme } = useTheme()

  const { user, signInWithGoogle } = useAuth();

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWithGoogle();
    }
    history.replace("/rooms/new");
  };

  const handleJoinRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomsRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomsRef.exists()) {
      alert('Room does not exists.')
      return;
    }

    if (roomsRef.val().endedAt) {
      alert('Room already close.')
      return;
    }

    history.replace(`rooms/${roomCode}`)
  };

  return (
    <div id="page-auth" className={classNames({ 'layout-dark': theme === 'dark' })}>
      <aside>
        <img src={illustrationImg} alt="Perguntas e respostas" />
        <strong>Crie salas de Q&A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img className="logo-img" src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleImg} alt="Google" />
            Crie sua sala com o google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
