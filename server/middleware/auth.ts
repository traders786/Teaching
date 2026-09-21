import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'upspeaq_secure_jwt_secret_change_in_production_2026';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  teacher_id?: string | null;
  student_id?: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      teacher_id: user.teacher_id || null,
      student_id: user.student_id || null,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Strict token verification middleware.
 * Rejects unauthenticated requests without unsafe hardcoded fallbacks.
 */
export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && (req.cookies.upspeaq_token || req.cookies.admin_token)) {
    token = req.cookies.upspeaq_token || req.cookies.admin_token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

/**
 * Optional token verification: extracts user if token is present, but doesn't block if missing.
 */
export function optionalVerifyToken(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && (req.cookies.upspeaq_token || req.cookies.admin_token)) {
    token = req.cookies.upspeaq_token || req.cookies.admin_token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
      req.user = decoded;
    } catch (e) {
      // Ignore invalid optional token
    }
  }
  next();
}

/**
 * Role-based access control middleware.
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Denied. Role '${req.user.role}' is not authorized for this resource. Required: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
}
