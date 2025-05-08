import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  try {
    // Header: Authorization: Bearer <token>
    const token = req.headers.authorization?.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET);
    next();               // 验证通过 → 继续执行路由处理器
  } catch {
    res.sendStatus(401);   // 无 token 或无效 → 401
  }
}
