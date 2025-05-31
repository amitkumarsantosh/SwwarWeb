const Listing = require("./schemas/listing")
const Review = require("./schemas/Review")
module.exports.isLoggedIn= (req, res, next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
    
        req.flash("error", "you must be logged in");
        return res.redirect("/login")
    
    }
    next();
}
module.exports.saveRedirectUrl =(req, res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner= async (req, res, next)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!req.user || !listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You don't have authority to do this operation");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You dont have permission to delete")
        return res.redirect(`/listings/${id}`);

    }
    next();

    
}