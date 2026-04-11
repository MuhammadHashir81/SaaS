import { z } from "zod";

const invoiceItemSchema = z.object({
  product: z.string().min(1, "Product name is required"),
});

const invoiceSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  product: z.array(invoiceItemSchema).min(1, "At least one product is required"),
});

export { invoiceSchema }