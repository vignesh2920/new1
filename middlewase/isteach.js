module.exports = (req,res,next)=>{
    if (req.session.user.teachOrstud === 'teacher') {
        next();         
    } else {
        return res.redirect('/home');   
    }
}