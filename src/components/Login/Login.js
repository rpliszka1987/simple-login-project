import React, {
  useState,
  useReducer,
  useEffect,
  useContext,
  useRef,
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

// useReducer function for email
const emailReducer = (state, action) => {
  // Checks conditions of information received
  if (action.type === "USER_INPUT") {
    // Updates the state values when type is USER_INPUT
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    // Assigns the last state value
    return { value: state.value, isValid: state.value.includes("@") };
  }
  // Default state
  return { value: "", isValid: false };
};

// useReducer funtion for password
const passwordReducer = (state, action) => {
  if (action.type === "USER_PASSWORD") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "PASSWORD_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    // Initial Email State
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    // Initial password state
    value: "",
    isValid: null,
  });

  const ctx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // Obj deconstruction to get only needed values from states with allies assignment to avoid running useEffect on every character change
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailState.isValid && passwordState.isValid);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    // WE use the reducer function and give it an action
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });

    // setFormIsValid(emailState.isValid && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    // Use reducer function and give it action for password
    dispatchPassword({ type: "USER_PASSWORD", val: event.target.value });

    // setFormIsValid(
    //   // Checks if email and password is valid
    //   emailState.isValid && passwordState.isValid
    // );
  };

  const validateEmailHandler = () => {
    // Happens when email input looses focus
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    // Happens when password input looses focus
    dispatchPassword({ type: "PASSWORD_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      ctx.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        {/* Using Input component to create input field */}
        <Input
          ref={emailInputRef}
          id="email"
          label="E-Mail"
          type="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordInputRef}
          id="password"
          label="Password"
          type="password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validateEmailHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
