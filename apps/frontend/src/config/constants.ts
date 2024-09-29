export const BACKEND_URL =
  import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export const SOCKET_IO_URL: string = `${BACKEND_URL}`;
