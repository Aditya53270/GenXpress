import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from'razorpay';

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success:false,message:'missing details' });
        }
        const existing = await userModel.findOne({ email });
        if (existing) {
            return res.json({ success:false, message:'Email already registered' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userData={ name, email, password: hashedPassword  };
        const newUser = new userModel(userData);
        const user=await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token, user:{name:user.name} });
    }catch(error){
        console.log(error);
        if (error && error.code === 11000) {
            return res.json({ success:false, message:'Email already registered' });
        }
        res.json({ success:false,message:error.message });
    }
}
const loginUser = async (req, res) => {
    try{
        const{email,password}=req.body;
        if(!email || !password){
            return res.json({success:false,message:'missing details'});
        }
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:'User does not exist'});

}
        const isMatch= await bcrypt.compare(password,user.password)
        if(isMatch){
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({success:true,token,user:{name:user.name}});

        }else{
            return res.json({success:false,message:'Invalid credentials'});
        }

    }catch (error){
        console.log(error);
        res.json({ success:false,message:error.message });

    }
}
const userCredits=async(req,res)=>{
    try{
        const userId = req.userId;
        const user=await userModel.findById(userId);
        if(!user){
            return res.json({success:false,message:'User not found'});
        }
        res.json({success:true,credits:user.creditBalance,user:{name:user.name}})

    } catch(error){
        console.log(error);
        res.json({success:false,message:error.message})

        }
}
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentRazorpay = async (req, res) => {
    try {
        const { userId, planID } = req.body;
        if (!userId || !planID) {
            return res.json({ success: false, message: 'missing details' });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        const plans = {
            basic: { amount: 50000, currency: 'INR', credits: 50 },
            pro: { amount: 100000, currency: 'INR', credits: 110 },
            premium: { amount: 200000, currency: 'INR', credits: 230 },
        };

        const plan = plans[planID];
        if (!plan) {
            return res.json({ success: false, message: 'Invalid plan ID' });
        }

        const options = {
            amount: plan.amount,
            currency: plan.currency,
            receipt: `rcpt_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(options);

        res.json({ success: true, order, plan: { credits: plan.credits } });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {registerUser,loginUser,userCredits,paymentRazorpay};
 