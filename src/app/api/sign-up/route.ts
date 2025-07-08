import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: 'User with this Username already exists',
                },
                { status: 400 }
            );
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const existingUserByEmail = await UserModel.findOne({ email });
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'User with same email exists'
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                    existingUserByEmail.password = hashedPassword;
                    existingUserByEmail.verifyCode = verifyCode
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                    await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 2);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                isVerified: false,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                messages: [],
            });

            await newUser.save();
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }
        return Response.json(
            {
                success: true,
                message: 'User registered successfully,please verify your email',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error Registering User', error);
        return Response.json(
            {
                success: false,
                message: 'Error while Registering the user!',
            },
            {
                status: 500,
            }
        );
    }
}
