const { z } = require("zod");

// Sub-schemas for complex nested objects
const curriculumStructureSchema = z.object({
  year: z.string().min(1, "Year is required"),
  semester: z.string().min(1, "Semester is required"),
  highlights: z.string().min(1, "Highlights are required"),
  credits: z.string().min(1, "Credits are required"),
});

const assessmentSchema = z.object({
  component: z.string().min(1, "Assessment component is required"),
  weight: z.string().regex(/^\d+%$/, "Weight must be in percentage format (e.g., '25%')"),
  notes: z.string().min(1, "Assessment notes are required"),
});

const jobOpportunitySchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(1, "Job description is required"),
  salary: z.string().min(1, "Salary range is required"),
});

// Main program schema matching the new JSON structure
const programFormDataSchema = z.object({
  title: z.string().min(1, "Program title is required").max(500, "Program title is too long"),

  duration: z.string().min(1, "Duration is required"),

  credits: z.string().min(1, "Credits are required"),

  intake: z.string().min(1, "Intake information is required"),

  category: z.enum(["undergraduate", "postgraduate", "diploma", "certificate", "short-course", "international"], {
    errorMap: () => ({ message: "Invalid category" }),
  }),

  tuitionFee: z.union([
    z.number().min(0, "Tuition fee must be positive"),
    z
      .string()
      .transform((val) => {
        const num = parseFloat(val);
        if (isNaN(num)) throw new Error("Tuition fee must be a valid number");
        return num;
      })
      .refine((val) => val >= 0, "Tuition fee must be positive"),
  ]),

  currency: z.string().min(1, "Currency is required").max(10, "Currency code too long"),

  deliveryMode: z.enum(["On-Campus", "Online", "Hybrid", "Distance Learning"], {
    errorMap: () => ({ message: "Invalid delivery mode" }),
  }),

  fullDescription: z.string().min(1, "Full description is required"),

  coreThemes: z.array(z.string().min(1, "Core theme cannot be empty")).min(1, "At least one core theme is required"),

  additionalInfo: z.string().optional(),

  curriculumStructure: z.array(curriculumStructureSchema).min(1, "At least one curriculum structure item is required"),

  teachingMethods: z.array(z.string().min(1, "Teaching method cannot be empty")).min(1, "At least one teaching method is required"),

  assessment: z.array(assessmentSchema).min(1, "At least one assessment method is required"),

  status: z
    .enum(["Active", "Draft", "Inactive"], {
      errorMap: () => ({ message: "Invalid status" }),
    })
    .optional(),

  highlights: z.array(z.string().min(1, "Highlight cannot be empty")).min(1, "At least one highlight is required"),

  jobOpportunities: z.array(jobOpportunitySchema).min(1, "At least one job opportunity is required"),
});

const createProgramFormDataSchema = z.object({
  body: programFormDataSchema,
});

const updateProgramFormDataSchema = z.object({
  body: programFormDataSchema.partial(),
  params: z.object({
    id: z.string().min(1, "Program ID is required"),
  }),
});

const programIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Program ID is required"),
  }),
});

module.exports = {
  createProgramFormDataSchema,
  updateProgramFormDataSchema,
  programIdParamSchema,
  programFormDataSchema,
  curriculumStructureSchema,
  assessmentSchema,
  jobOpportunitySchema,
};
