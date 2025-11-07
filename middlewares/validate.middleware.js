const validate = (schema) => {
    return (req, res, next) => {
      console.log("Validation Running:", req.body);

      const { error } = schema.validate(req.body, { abortEarly: false }); // collect all errors
      if (error) {
        // Map Joi errors to a simple ar
        console.log("Validation Failed:", error.details);
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ success: false, errors });
      }
      next();
    };
  };
  
  module.exports = validate;
  