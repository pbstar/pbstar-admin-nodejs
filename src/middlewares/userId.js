import { parseToken } from "../utils/token.js";
export default (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    const { id } = parseToken(token);
    req.userId = id;
  }
  next();
};
