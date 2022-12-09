export type Board = {
  _id: string;
  title: string;
  owner: string;
  users: string[];
};

export interface IColumn {
  _id: string;
  title: string;
  order: number;
  boardId: string;
}

export interface ITask {
  _id: string;
  title: string;
  order: number;
  boardId: string;
  columnId: string;
  description: string;
  userId: string;
  users: string[];
}

// export type UserState = {
//   login: string;
//   token: string;
//   name: string;
//   id: string;
//   loggedIn: boolean;
// };

export interface IProfile {
  name: string;
  login: string;
  password: string;
}

export interface ISignInForm {
  login: string;
  password: string;
}

export interface ISignUpForm extends IProfile {}

export interface IUserInfo {
  name: string;
  login: string;
  id: string;
}
export interface IUserResponse {
  name: string;
  _id: string;
  login: string;
}
//export interface User extends IUserResponse {} //deprecated IUserResponse instead, better if we normalize all to id instead _id

export type DecodedToken = {
  id: string;
  login: string;
  iat: number;
  exp: number;
};

export type BoardFormFields = { title: string; users: string[] };

export type TaskFormFields = { title: string; description: string; users: string[] };

export type ServerError = {
  status: number;
  data: {
    statusCode: number;
    message: string;
  };
};
