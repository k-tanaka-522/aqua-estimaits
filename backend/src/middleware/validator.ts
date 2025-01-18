import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './errorHandler';

// Middleware to check for validation errors
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map(err => ({
      [err.param]: err.msg
    }));

    throw new AppError('Validation failed', 400);
  };
};

// Common validation rules
export const commonValidations = {
  idParam: {
    in: ['params'],
    isMongoId: true,
    errorMessage: 'Invalid ID format'
  },
  dateRange: {
    startDate: {
      in: ['query'],
      isISO8601: true,
      toDate: true,
      errorMessage: 'Invalid start date format'
    },
    endDate: {
      in: ['query'],
      isISO8601: true,
      toDate: true,
      errorMessage: 'Invalid end date format'
    }
  },
  pagination: {
    page: {
      in: ['query'],
      optional: true,
      isInt: { options: { min: 1 } },
      toInt: true,
      errorMessage: 'Page must be a positive integer'
    },
    limit: {
      in: ['query'],
      optional: true,
      isInt: { options: { min: 1, max: 100 } },
      toInt: true,
      errorMessage: 'Limit must be between 1 and 100'
    }
  },
  status: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    errorMessage: 'Status is required and must be a string'
  }
};

// Facility validation rules
export const facilityValidations = {
  create: [
    {
      name: {
        in: ['body'],
        isString: true,
        notEmpty: true,
        trim: true,
        errorMessage: 'Facility name is required'
      },
      location: {
        in: ['body'],
        isString: true,
        notEmpty: true,
        trim: true,
        errorMessage: 'Location is required'
      },
      capacity: {
        in: ['body'],
        isNumeric: true,
        custom: {
          options: (value: number) => value > 0
        },
        errorMessage: 'Capacity must be a positive number'
      }
    }
  ]
};

// Production validation rules
export const productionValidations = {
  create: [
    {
      facilityId: commonValidations.idParam,
      productName: {
        in: ['body'],
        isString: true,
        notEmpty: true,
        trim: true,
        errorMessage: 'Product name is required'
      },
      targetQuantity: {
        in: ['body'],
        isNumeric: true,
        custom: {
          options: (value: number) => value > 0
        },
        errorMessage: 'Target quantity must be a positive number'
      }
    }
  ]
};

// Sales validation rules
export const salesValidations = {
  create: [
    {
      productId: commonValidations.idParam,
      period: {
        startDate: commonValidations.dateRange.startDate,
        endDate: commonValidations.dateRange.endDate
      },
      targets: {
        quantity: {
          in: ['body'],
          isNumeric: true,
          custom: {
            options: (value: number) => value > 0
          },
          errorMessage: 'Target quantity must be a positive number'
        },
        revenue: {
          in: ['body'],
          isNumeric: true,
          custom: {
            options: (value: number) => value > 0
          },
          errorMessage: 'Target revenue must be a positive number'
        }
      }
    }
  ]
};

// Financial validation rules
export const financialValidations = {
  create: [
    {
      period: {
        startDate: commonValidations.dateRange.startDate,
        endDate: commonValidations.dateRange.endDate
      },
      budget: {
        total: {
          in: ['body'],
          isNumeric: true,
          custom: {
            options: (value: number) => value > 0
          },
          errorMessage: 'Total budget must be a positive number'
        }
      }
    }
  ]
};
