const { z } = require("zod");

// Schema for form data where numbers come as strings
const programFormDataSchema = z
  .object({
    programTitle: z.string().min(1, "Program title is required").max(200, "Program title is too long"),

    category: z.enum(["Diploma", "Certificate", "International", "Short Course"], {
      errorMap: () => ({ message: "Invalid category" }),
    }),

    status: z.enum(["Active", "Draft", "Inactive"], {
      errorMap: () => ({ message: "Invalid status" }),
    }),

    duration: z
      .string()
      .min(1, "Duration is required")
      .regex(/^[0-9]+\s*(years?|months?)?(,\s*[0-9]+\s*(months?|years?))?$/i, "Duration must be in format like '4 years, 6 months'"),

    // Price comes as string from form data, so we transform it to number
    price: z
      .string()
      .min(1, "Price is required")
      .transform((val) => {
        const num = parseFloat(val);
        if (isNaN(num)) throw new Error("Price must be a valid number");
        return num;
      })
      .refine((val) => val >= 0, "Price must be a positive number")
      .refine((val) => val <= 1000000, "Price is too high"),

    // Max students comes as string from form data, so we transform it to number
    maxStudents: z
      .string()
      .min(1, "Max students is required")
      .transform((val) => {
        const num = parseInt(val, 10);
        if (isNaN(num)) throw new Error("Max students must be a valid number");
        return num;
      })
      .refine((val) => Number.isInteger(val), "Must be an integer")
      .refine((val) => val >= 1, "At least 1 student required")
      .refine((val) => val <= 1000, "Too many students"),

    leadInstructor: z.string().min(1, "Lead instructor is required").max(100, "Instructor name too long"),

    startDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Start date must be in mm/dd/yyyy format"),

    endDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "End date must be in mm/dd/yyyy format"),

    description: z.string().min(1, "Description is required"),

    prerequisites: z.string().optional(),

    curriculumOverview: z.string().optional(),

    // programImage will be handled as a file upload, not a URL
    // The file validation will be done by multer middleware
  })
  .refine(
    (data) => {
      // Validate that endDate is after startDate
      const [sm, sd, sy] = data.startDate.split("/").map(Number);
      const [em, ed, ey] = data.endDate.split("/").map(Number);

      const start = new Date(sy, sm - 1, sd);
      const end = new Date(ey, em - 1, ed);

      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

// Original schema for JSON data (keeping for backward compatibility)
const programSchema = z
  .object({
    programTitle: z.string().min(1, "Program title is required").max(200, "Program title is too long"),

    category: z.enum(["Diploma", "Certificate", "International", "Short Course"], {
      errorMap: () => ({ message: "Invalid category" }),
    }),

    status: z.enum(["Active", "Draft", "Inactive"], {
      errorMap: () => ({ message: "Invalid status" }),
    }),

    duration: z
      .string()
      .min(1, "Duration is required")
      .regex(/^[0-9]+\s*(years?|months?)?(,\s*[0-9]+\s*(months?|years?))?$/i, "Duration must be in format like '4 years, 6 months'"),

    price: z.number().min(0, "Price must be a positive number").max(1000000, "Price is too high"),

    maxStudents: z.number().int("Must be an integer").min(1, "At least 1 student required").max(1000, "Too many students"),

    leadInstructor: z.string().min(1, "Lead instructor is required").max(100, "Instructor name too long"),

    startDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Start date must be in mm/dd/yyyy format"),

    endDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "End date must be in mm/dd/yyyy format"),

    description: z.string().min(1, "Description is required"),

    prerequisites: z.string().optional(),

    curriculumOverview: z.string().optional(),

    programImage: z.string().url("Program image must be a valid URL").optional(),
  })
  .refine(
    (data) => {
      // Validate that endDate is after startDate
      const [sm, sd, sy] = data.startDate.split("/").map(Number);
      const [em, ed, ey] = data.endDate.split("/").map(Number);

      const start = new Date(sy, sm - 1, sd);
      const end = new Date(ey, em - 1, ed);

      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

const createProgramFormDataSchema = z.object({
  body: programFormDataSchema,
});

const createProgramSchema = z.object({
  body: programSchema,
});

const updateProgramFormDataSchema = z.object({
  body: programFormDataSchema.partial(),
  params: z.object({
    id: z.string().min(1, "Program ID is required"),
  }),
});

const updateProgramSchema = z.object({
  body: programSchema.partial(),
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
  programSchema,
  createProgramSchema,
  updateProgramSchema,
  programIdParamSchema,
};
