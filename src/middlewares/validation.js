import { z } from 'zod';

export const schemas = {
  signup: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'rh', 'manager', 'comptable', 'employee']),
    company_id: z.string().uuid().optional()
  }),

  user: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['rh', 'manager', 'comptable', 'employee']),
    first_name: z.string(),
    last_name: z.string(),
    company_id: z.string().uuid()
  }),

  subscription: z.object({
    company_id: z.string().uuid(),
    plan: z.enum(['basic', 'pro', 'enterprise']),
    status: z.enum(['active', 'suspended', 'cancelled']),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    billing_cycle: z.enum(['monthly', 'annual']),
    payment_provider_id: z.string().optional()
  })
};

export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.errors.map(e => e.message).join(', ')
      });
    }
  };
}
