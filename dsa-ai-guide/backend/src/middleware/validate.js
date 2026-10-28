/**
 * Request Validation Middleware & Schema Definitions
 * Provides schema validation for Express request bodies, params, and queries.
 */

class SchemaValidator {
  constructor(rules) {
    this.rules = rules;
  }

  validate(data) {
    const errors = [];
    const sanitized = {};

    for (const [field, rule] of Object.entries(this.rules)) {
      const val = data ? data[field] : undefined;

      // 1. Required check
      if (rule.required && (val === undefined || val === null || val === '')) {
        errors.push(`Field '${field}' is required.`);
        continue;
      }

      if (val === undefined || val === null) {
        if (rule.default !== undefined) {
          sanitized[field] = rule.default;
        }
        continue;
      }

      // 2. Type checks
      if (rule.type === 'string') {
        if (typeof val !== 'string') {
          errors.push(`Field '${field}' must be a string.`);
          continue;
        }
        const trimmed = rule.trim !== false ? val.trim() : val;
        if (rule.minLength && trimmed.length < rule.minLength) {
          errors.push(`Field '${field}' must have at least ${rule.minLength} characters.`);
          continue;
        }
        if (rule.maxLength && trimmed.length > rule.maxLength) {
          errors.push(`Field '${field}' cannot exceed ${rule.maxLength} characters.`);
          continue;
        }
        if (rule.pattern && !rule.pattern.test(trimmed)) {
          errors.push(`Field '${field}' format is invalid.`);
          continue;
        }
        if (rule.enum && !rule.enum.includes(trimmed)) {
          errors.push(`Field '${field}' must be one of: ${rule.enum.join(', ')}.`);
          continue;
        }
        sanitized[field] = trimmed;
      } else if (rule.type === 'number') {
        const num = Number(val);
        if (isNaN(num)) {
          errors.push(`Field '${field}' must be a number.`);
          continue;
        }
        if (rule.min !== undefined && num < rule.min) {
          errors.push(`Field '${field}' must be at least ${rule.min}.`);
          continue;
        }
        if (rule.max !== undefined && num > rule.max) {
          errors.push(`Field '${field}' cannot exceed ${rule.max}.`);
          continue;
        }
        if (rule.integer && !Number.isInteger(num)) {
          errors.push(`Field '${field}' must be an integer.`);
          continue;
        }
        sanitized[field] = num;
      } else if (rule.type === 'boolean') {
        sanitized[field] = Boolean(val);
      } else if (rule.type === 'array') {
        if (!Array.isArray(val)) {
          errors.push(`Field '${field}' must be an array.`);
          continue;
        }
        sanitized[field] = val;
      } else if (rule.type === 'object') {
        if (typeof val !== 'object' || Array.isArray(val)) {
          errors.push(`Field '${field}' must be an object.`);
          continue;
        }
        sanitized[field] = val;
      } else {
        sanitized[field] = val;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized
    };
  }
}

const validate = (rules, target = 'body') => {
  const validator = new SchemaValidator(rules);
  return (req, res, next) => {
    const data = req[target];
    const { isValid, errors, sanitized } = validator.validate(data);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req[target] = { ...req[target], ...sanitized };
    next();
  };
};

// --- Pre-defined Validation Schemas ---
const schemas = {
  // Auth
  register: {
    name: { type: 'string', required: true, minLength: 2, maxLength: 60, trim: true },
    email: { type: 'string', required: true, pattern: /\S+@\S+\.\S+/, trim: true },
    password: { type: 'string', required: true, minLength: 6, maxLength: 100, trim: false }
  },
  login: {
    email: { type: 'string', required: true, pattern: /\S+@\S+\.\S+/, trim: true },
    password: { type: 'string', required: true, minLength: 1, trim: false }
  },

  // Problem Submission
  submission: {
    code: { type: 'string', required: true, minLength: 1 },
    language: { type: 'string', required: true, enum: ['python', 'cpp', 'java', 'javascript'] },
    timeTakenSeconds: { type: 'number', required: false, min: 0, default: 300 },
    hintsUsedCount: { type: 'number', required: false, min: 0, integer: true, default: 0 }
  },

  // Hint Request
  hintRequest: {
    level: { type: 'number', required: true, min: 1, max: 5, integer: true }
  },

  // Revision Review
  revisionReview: {
    quality: { type: 'number', required: true, min: 0, max: 5, integer: true }
  },

  // Complexity Analysis
  complexityEstimate: {
    code: { type: 'string', required: true, minLength: 1 },
    version: { type: 'string', required: false, enum: ['v0', 'v1'], default: 'v1' }
  }
};

module.exports = {
  validate,
  schemas,
  SchemaValidator
};
