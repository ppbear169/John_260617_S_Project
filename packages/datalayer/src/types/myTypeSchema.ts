import { z } from 'zod/v4';

export const myTypeSchema = z
  .object({
    key: z.string().describe('The key of the record'),
    name: z.string().describe('The symbol of the record'),
    dataType: z
      .union([z.literal('INT'), z.literal('BOOL'), z.undefined()])
      .describe('The type of the record'),
    defaultValue: z
      .union([z.int32(), z.boolean(), z.undefined()])
      .describe('The value of the record'),
    comments: z
      .string()
      .max(200, 'Comments must be less than 200 characters')
      .describe('Comments about the record'),
  })
  .describe('MyType details');

export type MyTypeSchema = z.infer<typeof myTypeSchema>;
