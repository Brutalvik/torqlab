import {z} from 'zod';
export const quoteSchema=z.object({
 requestId:z.uuid(),service:z.enum(['o1','o2','o3','b1','b2','b3']),
 vehicleType:z.enum(['Car / Sedan','SUV (eligible)','European / Performance']),
 vehicle:z.string().trim().min(3).max(160),neighbourhood:z.string().trim().min(2).max(120),axles:z.number().int().min(1).max(2),
 email:z.email().max(254),phone:z.string().trim().regex(/^\+?[\d\s().-]{10,25}$/).refine(p=>p.replace(/\D/g,'').length>=10&&p.replace(/\D/g,'').length<=15,'Enter a valid phone number'),
 notes:z.string().trim().max(2000),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),time:z.string().regex(/^\d{2}:\d{2}$/),consent:z.literal(true),website:z.string().max(0).optional()
}).strict();
export type QuoteInput=z.infer<typeof quoteSchema>;
export interface Availability {date:string;timezone:string;slots:string[];today:string;maxDate:string;}
export interface QuoteReceipt {id:string;status:'requested';delivery:'local';estimate:number;currency:'CAD';date:string;time:string;timezone:string;}
