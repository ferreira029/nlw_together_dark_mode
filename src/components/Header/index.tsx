import { ReactNode } from "react";
import logoImg from "../../assets/images/logo.svg";
import moonImg from "../../assets/images/moon.png";
import sunImg from "../../assets/images/sun.png";
import { useTheme } from "../../hooks/useTheme";
import { RoomCode } from "../RoomCode";

type HeaderProps = {
  roomId: string;
  children?: ReactNode;
}

export const Header = ({ roomId, children }: HeaderProps) => {
  const { theme, setTheme } = useTheme()

  return (
    <header>
      <div className="content">
        <img className="logo-img" src={logoImg} alt="Letmeask" />
        <div>
          <RoomCode code={roomId} />
          {children}
          { theme === 'light' ?
            <img src={moonImg} alt="Lua" onClick={() => setTheme('dark')} /> :
            <img src={sunImg} alt="Sol" onClick={() => setTheme('light')} />
          }
        </div>
      </div>
    </header>
  )
}
