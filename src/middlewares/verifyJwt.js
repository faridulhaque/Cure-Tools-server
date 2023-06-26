import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
    const receivedToken = req.headers.authorization;
    if (!receivedToken) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    const token = receivedToken.split(" ")[1];
    jwt.verify(token, process.env.JSON_TOKEN, function (err, decoded) {
      if (err) {
        return res.status(403).send({ message: "forbidden access" });
      }
      req.decoded = decoded;
      next();
    });
  };