import { LoginState } from "./LoginState";
import { createReducer, on } from "@ngrx/store";
import { login, loginFail, loginSuccess, recoverPassword, recoverPasswordFail, recoverPasswordSuccess } from "./login.actions";
import { AppInitialState } from "../AppInitialState";

const initialState: LoginState = AppInitialState.login;

const reducer = createReducer(initialState,
    on(recoverPassword, currentState => {

        return {
            ...currentState,
            error: null,
            isRecoveredPassword: false,
            isRecoveringPassword: true
        };
    }),
    on(recoverPasswordSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isRecoveredPassword: true,
            isRecoveringPassword: false
        };
    }),
    on(recoverPasswordFail, (currentState, action) => {
        return {
            ...currentState,
            error:action.error,
            isRecoveredPassword: false,
            isRecoveringPassword: false
        };;
    }),
    on(login, currentState => {
        return {
            ...currentState,
            error:null,
            isLoggingIn: true,
            isLoggedIn: false
        };;
    }),
    on(loginSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isLoggingIn: false,
            isLoggedIn: true
        };
    }),
    on(loginFail, (currentState, action) => {
        return {
            ...currentState,
            error:action.error,
            isLoggingIn: false,
            isLoggedIn: false
        };;
    }),
)

export function loginReducer(state: LoginState, action) {
    return reducer(state, action);
}