import * as z from "zod";
 
export const adminAuthSchema = z.object({
  name: z
  .string()
  .trim()
  .min(2,'name should be atleast 2 characters long')
  .max(100,'name should not be too long'),

  password:z
  .string() 
  .trim()
  .min(2,'password should be atleast 2 characters long')
  .max(100,'name should not be too long') 
  
});