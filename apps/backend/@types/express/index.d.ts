declare global {
  namespace Express {
    interface Request {
      jashan: string;
      user: { id: string };
    }
  }
}
