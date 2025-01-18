import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

// バリデーションエラーをチェックするミドルウェア
const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // すべてのバリデーションを実行
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // エラーメッセージを整形
    const formattedErrors = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg
    }));

    res.status(400).json({
      message: 'Validation failed',
      errors: formattedErrors
    });
  };
};

// 財務情報のバリデーションルール
export const validateFinancial = validateRequest([
  body('period.startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('period.endDate')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('budget.total')
    .isFloat({ min: 0 })
    .withMessage('Total budget must be a positive number'),
  body('budget.categories.operations')
    .isFloat({ min: 0 })
    .withMessage('Operations budget must be a positive number'),
  body('budget.categories.maintenance')
    .isFloat({ min: 0 })
    .withMessage('Maintenance budget must be a positive number'),
  body('budget.categories.labor')
    .isFloat({ min: 0 })
    .withMessage('Labor budget must be a positive number'),
  body('budget.categories.materials')
    .isFloat({ min: 0 })
    .withMessage('Materials budget must be a positive number'),
  body('budget.categories.marketing')
    .isFloat({ min: 0 })
    .withMessage('Marketing budget must be a positive number'),
  body('budget.categories.other')
    .isFloat({ min: 0 })
    .withMessage('Other budget must be a positive number'),
  body('status')
    .isIn(['planning', 'active', 'completed', 'archived'])
    .withMessage('Invalid status')
]);

// 施設のバリデーションルール
export const validateFacility = validateRequest([
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string'),
  body('location.address')
    .notEmpty()
    .withMessage('Address is required')
    .isString()
    .withMessage('Address must be a string'),
  body('location.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('location.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  body('capacity.total')
    .isFloat({ min: 0 })
    .withMessage('Total capacity must be a positive number'),
  body('type')
    .isIn(['pond', 'tank', 'cage', 'other'])
    .withMessage('Invalid facility type'),
  body('status')
    .isIn(['active', 'maintenance', 'inactive'])
    .withMessage('Invalid status')
]);

// 生産情報のバリデーションルール
export const validateProduction = validateRequest([
  body('facilityId')
    .notEmpty()
    .withMessage('Facility ID is required')
    .isMongoId()
    .withMessage('Invalid facility ID'),
  body('species')
    .notEmpty()
    .withMessage('Species is required')
    .isString()
    .withMessage('Species must be a string'),
  body('quantity.initial')
    .isFloat({ min: 0 })
    .withMessage('Initial quantity must be a positive number'),
  body('quantity.current')
    .isFloat({ min: 0 })
    .withMessage('Current quantity must be a positive number'),
  body('period.startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('period.expectedEndDate')
    .isISO8601()
    .withMessage('Expected end date must be a valid date'),
  body('status')
    .isIn(['planning', 'ongoing', 'completed', 'cancelled'])
    .withMessage('Invalid status')
]);

// 販売情報のバリデーションルール
export const validateSales = validateRequest([
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .isFloat({ min: 0 })
    .withMessage('Quantity must be a positive number'),
  body('unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid date'),
  body('status')
    .isIn(['pending', 'completed', 'cancelled'])
    .withMessage('Invalid status')
]);
