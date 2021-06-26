import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Question } from "../components/Question";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import { useHistory, useParams } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

import "../styles/room.scss";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";
import classNames from "classnames";
import { useTheme } from "../hooks/useTheme";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { id: roomId } = useParams<RoomParams>();
  // const { user } = useAuth();

  const { questions, title } = useRoom(roomId);

  const { theme } = useTheme()

  const history = useHistory();

  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      return database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  };

  const handleCheckQuestionAsAnswered = (questionId: string) => {
    return database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });
  };

  const handleHighlightQuestion = (questionId: string) => {
    return database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    });
  };

  const handleEndRoom = async () => {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.replace("/");
  };

  return (
    <div id="page-room" className={classNames({'layout-dark': theme === 'dark' })}>
      <Header roomId={roomId}>
        <Button isOutlined onClick={handleEndRoom}>
          Encerrar Sala
        </Button>
      </Header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span> {questions.length} perguntas</span>}
        </div>
        <div className="question-list">
          {questions.map(({ id, author, content, isAnswered, isHighlighted }) => {
            return (
              <Question
                key={id}
                author={author}
                content={content}
                isAnswered={isAnswered}
                isHighlighted={isHighlighted}
              >
                { !isAnswered && (
                  <>
                    <button
                      className="like-button"
                      type="button"
                      aria-label="Marcar como gostei"
                      onClick={() => handleCheckQuestionAsAnswered(id)}
                    >
                      <img src={checkImg} alt="Marcar como pergunta respondida" />
                    </button>
                    <button
                      className="like-button"
                      type="button"
                      aria-label="Marcar como gostei"
                      onClick={() => handleHighlightQuestion(id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )
                }
                <button
                  className="like-button"
                  type="button"
                  aria-label="Marcar como gostei"
                  onClick={() => handleDeleteQuestion(id)}
                >
                  <img src={deleteImg} alt="Remover" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
