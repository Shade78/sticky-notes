import { useState, useRef, useEffect } from "react";
import { db } from "../appwrite/databases";
import Trash from "../icons/Trash";
import { setNewOffset, autoGrow, setZIndex, bodyParser } from "../utils";

const NoteCard = ({ note }) => {
  const body = bodyParser(note.body);
  const [position, setPosition] = useState(JSON.parse(note.position));
  const colors = JSON.parse(note.colors);

  const mouseStartPos = { x: 0, y: 0 };

  const cardRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    autoGrow(textAreaRef);
  }, []);

  const mouseDown = (e) => {
    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);

    setZIndex(cardRef.current);
  };

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);

    const newPosition = setNewOffset(cardRef.current);
    saveData("position", newPosition);
    // db.notes.update(note.$id, { position: JSON.stringify(newPosition) });  created function to make it clean
  };

  const saveData = async (key, value) => {
    const payload = { [key]: JSON.stringify(value) };

    try {
      await db.notes.update(note.$id, payload);
    } catch (error) {
      console.error(error);
    }
  };

  const mouseMove = (e) => {
    const mouseMoveDirection = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };

    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    const newPosition = setNewOffset(cardRef.current, mouseMoveDirection);

    setPosition(newPosition);

    // setPosition({
    //   x: cardRef.current.offsetLeft - mouseMoveDirection.x,
    //   y: cardRef.current.offsetTop - mouseMoveDirection.y,
    // });
  };

  //TODO change to styled-components
  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        className="card-header"
        style={{ backgroundColor: colors.colorHeader }}
        onMouseDown={mouseDown}
      >
        <Trash />
      </div>
      <div className="card-body">
        <textarea
          ref={textAreaRef}
          defaultValue={body}
          style={{ color: colors.colorText }}
          onInput={() => autoGrow(textAreaRef)}
          onFocus={() => setZIndex(cardRef.current)}
        ></textarea>
      </div>
    </div>
  );
};

export default NoteCard;
