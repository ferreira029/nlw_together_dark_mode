import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
  id: string;
  content: string;
  author: {
    avatar: string;
    name: string;
  };
  isHighlighted: boolean;
  isAnswered: boolean;
  likeCount: number;
  likeId: string | undefined;
};

type FirebaseQuestions = Record<
  string,
  {
    content: string;
    author: {
      avatar: string;
      name: string;
    };
    isHighlighted: boolean;
    isAnswered: boolean;
    likes: Record<string, {
      authorId: string;
    }>;
  }
>;

export function useRoom(roomId: string) {
  const { user } = useAuth()

  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");

  const history = useHistory()

  useEffect(() => {
    const roomRef = database.ref(`/rooms/${roomId}`);

    roomRef.on("value", (room) => {
      const databaseRoom = room.val();

      // Verifica se a sala já foi encerrada, caso já tenha sido encerrada não permite a entrada via URL.
      if (databaseRoom.endedAt) {
        alert("Room already close.");
        return history.replace("/");
      }

      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => ({
          id: key,
          author: {
            ...value.author,
          },
          content: value.content,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        })
      );

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);

      return () => {
        roomRef.off('value');
      }
    });
  }, [roomId, user?.id, history]);

  return { questions, title }

}