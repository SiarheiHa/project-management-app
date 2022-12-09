export const BASE_URL = process.env.REACT_APP_BASE_URL;
//export const BASE_URL = 'https://final-task-backend-production-8f5b.up.railway.app/';
//final-task-backend-production-8f5b.up.railway.app/

export enum Endpoint {
  BOARDS = 'boards/',
  BOARDS_SET = 'boardsSet/',
  USERS = 'users/',
  COLUMNS = 'columns/',
  COLUMNS_SET = 'columnsSet/',
  TASKS_SET = 'tasksSet',
  AUTH = 'auth/',
}

export enum HTTPMethod {
  DELETE = 'DELETE',
  GET = 'GET',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
}
