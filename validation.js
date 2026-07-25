//Schema validation using joi
const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(10).required(),
    img: Joi.string().optional().allow(''),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    category:Joi.string().required(),
    country: Joi.string().required()
  }).required()
});
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
    author:Joi.string().required()
   
  }).required()
});
module.exports.bookingSchema = Joi.object({
  booking: Joi.object({
    checkIn: Joi.date().required(),
    checkOut: Joi.date().greater(Joi.ref("checkIn")).required(),
    guests: Joi.number().integer().min(1).max(20).required(),
    notes: Joi.string().allow("").max(500).optional()
  }).required()
});
module.exports.blockedDateSchema = Joi.object({
  blockedDate: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref("startDate")).required(),
    note: Joi.string().allow("").max(300).optional()
  }).required()
});

