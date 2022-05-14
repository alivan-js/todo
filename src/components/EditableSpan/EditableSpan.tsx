import { TextField } from "@mui/material";
import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { setError } from "../../app/app-reducer";
import { useDispatch } from "react-redux";

type EditableSpanPropsType = {
  text: string;
  changeText: (text: string) => void;
};

const EditableSpan = React.memo((props: EditableSpanPropsType) => {
  const [editForm, setEditForm] = useState(false);
  const [title, setTitle] = useState(props.text);

  const dispatch = useDispatch();

  const changeText = () => {
    if (title.trim()) {
      props.changeText(title.trim());
    } else {
      dispatch(setError({ error: "Title must not be empty" }));
      setTitle(props.text);
    }
    setEditForm(false);
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      changeText();
    }
  };

  const onBlurHandler = () => {
    changeText();
  };

  const onDoubleClickHandler = () => {
    setEditForm(true);
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setTitle(e.currentTarget.value);
  };

  return (
    <>
      {editForm ? (
        <TextField
          value={title}
          onKeyPress={onKeyPressHandler}
          onChange={onChangeHandler}
          autoFocus
          onBlur={onBlurHandler}
          size={"small"}
          variant={"outlined"}
          label={"Todolist title"}
        />
      ) : (
        <span onDoubleClick={onDoubleClickHandler}>{title}</span>
      )}
    </>
  );
});

export default EditableSpan;
