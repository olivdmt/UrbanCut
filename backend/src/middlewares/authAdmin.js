import jwt from "jsonwebtoken";

async function authAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token não informado",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({
        success: false,
        message: "Token mal formatado",
      });
    }

    const [scheme, token] = parts;

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Token inválido!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.tipo !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Acesso negado!",
      });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Não autorizado",
      error: error.message,
    });
  }
}

export default authAdmin;