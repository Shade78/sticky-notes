import { useState, useRef, useEffect } from "react";
import { db } from "../appwrite/databases";
import DeleteButton from "./DeleteButton";
import Spinner from "../icons/Spinner";
import { setNewOffset, autoGrow, setZIndex, bodyParser } from "../utils";

const NoteCard = ({ note, setNotes }) => {
  const [saving, setSaving] = useState(false);
  const keyUpTimer = useRef(null);

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
    if (e.target.className === "card-header") {
      mouseStartPos.x = e.clientX;
      mouseStartPos.y = e.clientY;

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);

      setZIndex(cardRef.current);
    }
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

    setSaving(false);
  };

  const handleKeyUp = () => {
    setSaving(true);

    // if we have timer id. because no need to call saveData multiple times
    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer);
    }

    keyUpTimer.current = setTimeout(() => {
      saveData("body", textAreaRef.current.value);
    }, 2000);
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
        <DeleteButton noteId={note.$id} setNotes={setNotes} />
        {saving && (
          <div className="card-saving">
            <Spinner color={colors.colorText} />
            <span style={{ color: colors.colorText }}>Saving...</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <textarea
          onKeyUp={handleKeyUp}
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
