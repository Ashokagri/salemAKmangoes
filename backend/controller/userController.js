import handleAsyncError from '../middleware/handleAsyncError.js';
import crypto from 'crypto';
import HandleError from '../utils/handleError.js'
import User from '../models/userModel.js';
import { sendToken } from '../utils/jwtToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import {v2 as cloudinary} from 'cloudinary';

export const registerUser=handleAsyncError(async(req , res , next)=>{
    try {
        const {name,email,password,avatar}=req.body;
        console.log("Registering user:", { name, email, hasAvatar: !!avatar });

        // Profile picture is optional - use default if not provided
        let avatarData = {
            public_id: "default_avatar_id",
            url: "/images/profile.png"
        };

        // Only upload to Cloudinary if avatar is provided as base64 string
        if (avatar && typeof avatar === "string" && avatar.startsWith("data:image")) {
            console.log("Attempting Cloudinary upload for avatar...");
            try {
                const myCloud = await cloudinary.uploader.upload(avatar,{
                    folder:'avatars',
                    width:150,
                    crop:'scale'
                });
                avatarData = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
                console.log("Avatar uploaded successfully");
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                // If upload fails, proceed with default avatar instead of failing registration
                console.log("Using default avatar due to upload error");
            }
        } else {
            console.log("No avatar provided or invalid format. Using default avatar.");
        }

        const user=await User.create({
            name,
            email,
            password,
            avatar: avatarData
        });
        sendToken(user,201,res);
    } catch (err) {
        console.error("Signup Error Details:", err);
        return next(new HandleError(err.message || "Registration failed", 500));
    }
});

// Login
export const loginUser=handleAsyncError(async(req , res, next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return next(new HandleError("Email or password cannot be empty",400))
    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new HandleError("Invalid Email or password",401))
    }
    const isPasswordValid=await user.verifyPassword(password);
    if(!isPasswordValid){
        return next(new HandleError("Invalid Email or password",401))
    }
    sendToken(user,200,res)
})

// /Logout
export const logout=handleAsyncError(async(req , res , next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success: true,
        message:"Successfully Logged out"
    })
})

// Forgot Password 
export const requestPasswordReset=handleAsyncError(async(req,res,next)=>{
    const {email}=req.body
    const user=await User.findOne({email});
    if(!user){
        return next(new HandleError("User doesn't exist",400))
    }
    let resetToken;
    try{
        resetToken=user.generatePasswordResetToken()
        await user.save({validateBeforeSave:false})
        
    }catch(error){
        return next(new HandleError("Could not save reset token, please try again later",500))
    }
    const resetPasswordURL=`${req.protocol}://${req.get('host')}/reset/${resetToken}`;
    const message = `Use the following link to reset your password: ${resetPasswordURL}. \n\n This link will expire in 30 minutes.\n\n If you didn’t request a password reset, please ignore this message.`;
    try{
// Send Email
        await sendEmail({
            email:user.email,
            subject:'Password Reset Request',
            message
        })
        res.status(200).json({
            success:true,
            message:`Email is sent to ${user.email} successfully`
        })
    }catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false})
        return next(new HandleError("Email couldn't be sent , please try again later",500))
    }
    
})

//Reset Password
export const resetPassword=handleAsyncError(async(req ,res,next)=>{
const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");
const user=await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt:Date.now()}
})
if(!user){
    return next(new HandleError("Reset Password token is invalid or has been expired",400))
}
const {password,confirmPassword}=req.body;
if(password!==confirmPassword){
    return next(new HandleError("Password doesn't match",400))
}
user.password=password;
user.resetPasswordToken=undefined;
user.resetPasswordExpire=undefined;
await user.save();
sendToken(user,200,res)
})

// Get user details
export const getUserDetails=handleAsyncError(async(req , res , next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
 
    
})

//update password
export const updatePassword=handleAsyncError(async(req,res,next)=>{
    const {oldPassword,newPassword,confirmPassword}=req.body;
    const user=await User.findById(req.user.id).select('+password');
    const checkPasswordMatch=await user.verifyPassword(oldPassword);
    if(!checkPasswordMatch){
        return next(new HandleError('Old password is incorrect',400))
    }
    if(newPassword!==confirmPassword){
        return next(new HandleError("Password doesn't match",400))
    }
    user.password=newPassword;
    await user.save();
    sendToken(user,200,res);
})

//Updating user profile
export const updateProfile=handleAsyncError(async(req,res,next)=>{
    const {name,email,avatar}=req.body;
    const updateUserDetails={
        name,
        email
    }
    
    // Avatar update is OPTIONAL - only process if new avatar is provided
    if(avatar && typeof avatar === "string" && avatar.startsWith("data:image")){
        try {
            const user=await User.findById(req.user.id);
            const imageId=user.avatar.public_id
            
            // Don't try to destroy the default placeholder in Cloudinary
            if (imageId && imageId !== "default_avatar_id") {
                await cloudinary.uploader.destroy(imageId)
            }
            
            const myCloud=await cloudinary.uploader.upload(avatar,{
                folder:'avatars',
                width:150,
                crop:'scale'
            })

            updateUserDetails.avatar={
                public_id:myCloud.public_id,
                url:myCloud.secure_url,
            }
        } catch (uploadError) {
            console.error("Avatar upload error during profile update:", uploadError);
            // If avatar upload fails, continue with other profile updates instead of failing completely
            console.log("Proceeding with profile update without avatar change");
        }
    }
    
    const user=await User.findByIdAndUpdate(req.user.id,updateUserDetails,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        message:"Profile Updated Successfully",
        user
    })
})

// Admin- Getting user information
export const getUsersList=handleAsyncError(async(req,res,next)=>{
    const users=await User.find();
    res.status(200).json({
        success:true,
        users
    })
})

//Admin- Getting single user information
export const getSingleUser=handleAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new HandleError(`User doesn't exist with this id: ${req.params.id}`,400))
    }
    res.status(200).json({
        success: true,
        user
    })

    
})

//Admin- Changing user role
export const updateUserRole=handleAsyncError(async(req,res,next)=>{
    const {role}=req.body;
    const newUserData={
        role
    }
    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true
    })
    if(!user){
        return next(new HandleError("User doesn't exist",400))
    }
    res.status(200).json({
        success: true,
        user
    })

    
})


// Admin - Delete User Profile
export const deleteUser=handleAsyncError(async(req,res,next)=>{
   const user =await User.findById(req.params.id);
   if(!user){
    return next(new HandleError("User doesn't exist",400))
   }
   
   // Only delete avatar from Cloudinary if it's not the default placeholder
   const imageId=user.avatar?.public_id;
   if (imageId && imageId !== "default_avatar_id") {
       try {
           await cloudinary.uploader.destroy(imageId)
       } catch (error) {
           console.error("Error deleting avatar from Cloudinary:", error);
           // Continue with user deletion even if avatar deletion fails
       }
   }
   
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success:true,
        message: "User Deleted Successfully"
    })
})