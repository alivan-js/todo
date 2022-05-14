import { IconButton, TextField } from "@mui/material";
import React, {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useState,
} from "react";
import AddIcon from "@mui/icons-material/Add";

type FormTitleProps = {
  addNewElementCallback: (text: string) => void;
  disabled?: boolean;
};

const AddItemForm = React.memo((props: FormTitleProps) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const addNewElement = useCallback(() => {
    if (text.trim()) {
      props.addNewElementCallback(text.trim());
      setError("");
    } else {
      setError("Не указано название");
    }
    setText("");
  }, [props, text]);

  const onClickHandler = useCallback(() => {
    addNewElement();
  }, [addNewElement]);

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value);
    setError("");
  }, []);

  const onKeyPressHandler = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        addNewElement();
      }
    },
    [addNewElement]
  );

  return (
    <div>
      <TextField
        onKeyPress={onKeyPressHandler}
        value={text}
        onChange={onChangeHandler}
        size={"small"}
        variant={"outlined"}
        label={"Task title"}
        error={!!error}
        helperText={error}
        disabled={props.disabled}
      />
      <IconButton onClick={onClickHandler} disabled={props.disabled}>
        <AddIcon />
      </IconButton>
    </div>
  );
});

export default AddItemForm;
