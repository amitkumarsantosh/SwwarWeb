const {listingSchema, reviewSchema}= require("./JOISchema")
const ExpressError = require('./utils/ExpressError');


const validateListingSchema = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
};

//review validation
const validateReview = (req, res, next)=>{
  let {error}= reviewSchema.validate(req.body);
  if(error){
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
}
module.exports= {validateListingSchema, validateReview};