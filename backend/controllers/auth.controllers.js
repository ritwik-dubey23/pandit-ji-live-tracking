    import User from "../models/user.models.js"
    import bcrypt from "bcrypt"
    import gentoken from "../utils/token.js"

    import { sendOtpMail } from "../utils/mail.js"

    ///1. sign up logic new acount 
    export const signUp = async(req, res) => {

        try {

            // fromtend from se data la re h and then db me store kare ge 
            const { fullName, email, password, mobile, role } = req.body;


            //if agar  user ki email already exits  karti h DB me to phir se na ho paye

            // user variable me email la re h ;;

            let user = await User.findOne({ email })
            if (user) {
                return res.status(400).json({ message: "User email Already exists , Please Enter  a new Valid Email'id.." })
            }

            if (password < 6) {
                return res.status(400).json({ message: "Password must be contain at least 6  characters" })
            }
            if (!/^[A-Za-z ]{3,}$/.test(fullName.trim())) {
                return res.status(400).json({
                    message: "Enter a valid full name (min 3 letters, only alphabets)."
                });
            }

            if (mobile.length !== 10) {
                return res.status(400).json({
                    message: "Mobile number must be exactly 10 digits."
                });
            }


            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({
                    message: "Enter a valid email address."
                });
            }


            // creating hash from of the password
            const hashPassword = await bcrypt.hash(password, 10);

            // DB me save kare ge user ko with hash passwordd
            user = await User.create({
                fullName,
                email,
                role,
                mobile,
                password: hashPassword
                    // agar value:key same h to sriph  value pass kr skte hhn 
            })


            // token me save karege jwt token jo aya utils/ token.js
            //seee         yha se usme User ki ### id  jo MONGODB GENTRATE  KRTA HHH     pass karege haamm
            const token = await gentoken(user._id)
                // browser me cookie me id store krne ke liyeee

            res.cookie("token", token, {
                secure: false,
                sameSite: "strict",
                maxAge: 15 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })

            return res.status(201).json(user)

        } catch (error) {
            //500 matlb server error
            return res.status(500).json(`sginn up Error${error}`)
        }
    }





    ///2.login logicexisting acount 



    export const signIn = async(req, res) => {

        try {

            // fromtend from se data la re h and then db me store kare ge 
            const { fullName, email, password, mobile, role } = req.body;


            //if agar  user ki email already exits  karti h DB me to phir se na ho paye

            // user variable me email la re h ;;

            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: "User email Does Not exists , Please Create a  account Frist " })
            }

            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be contain at least 6  characters" })

            }


            // if (mobile.length < 10) {
            //     return res.status(400).json({ message: "Mobile no. is invalid it must conatain atleast 10 digits.." })
            // }
            /// ## for login WE have to match   password   with  help bcrypt   with the hashpassword        

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Password is Incorrect ...." })

            }


            //### sab sahi h to login ho jayegaaa



            // token me save karege jwt token jo aya utils/ token.js
            //seee         yha se usme User ki ### id  jo MONGODB GENTRATE  KRTA HHH     pass karege haamm
            const token = await gentoken(user._id)
                // browser me cookie me id store krne ke liyeee

            res.cookie("token", token, {
                secure: false,
                sameSite: "strict",
                maxAge: 15 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })

            return res.status(200).json(user)

        } catch (error) {
            //500 matlb server error
            return res.status(500).json(`sginn In  (login) Error   ${error}`)

        }
    }


    //3,sginn out

    export const signOut = async(req, res) => {
        try {
            res.clearCookie("token");
            return res.status(200).json({
                message: " User logut sucessfully"
            });

        } catch (error) {

            return res.status(500).json(`logout   (logout ) Error  ===   ${error}`)
        }
    }

































    //#1



    //otp  forgotpssword walii functionityyy
    // 
    // 
    // //reset




    export const sendOtp = async(req, res) => {
        try {
            const { email } = req.body
            const user = await User.findOne({ email })

            if (!user) {

                return res.status(400).json({ message: "User does not exists ....." })





            }
            // email pe otp send kara 

            // and db me match krne ke liye save kiya h

            const otp = Math.floor(1000 + Math.random() * 9000).toString()
            user.resetOtp = otp
            user.otpExpires = Date.now() + 5 * 60 * 1000
            user.isotpVerified = false
            await user.save()

            await sendOtpMail(email, otp)
            return res.status(200).json({ message: " otp sent sucessfully " })



        } catch (error) {
            return res.status(400).json({ message: "otp send error  in # authcontroller  .....", error })

        }
    }






    // verify   krne ke liye   otp ko jo db me save h and jo user daal ra he

    //#2

    export const verifyOtp = async(req, res) => {


        try {

            const { email, otp } = req.body;

            // email se find karenge ki DB me user h ki ni
            const user = await User.findOne({ email })


            // agr user nhi h db me

            // ya otp resetOtp wla ni h 
            // ya otp Expired  ho  gya h 5 se jda time ho gya h 
            if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {

                return res.status(400).json({
                    message: "Invalid/Expired otp "
                })

            }
            user.isotpVerified = true
            user.resetOtp = undefined
            user.otpExpires = undefined
            await user.save();
            return res.status(200).json({ message: "OTP is  verified  as Sucessfully" })

        } catch (error) {
            return res.status(400).json({ message: "otp verify otp in #fn  ==verifyOtp   error  in # authcontroller  .....", error })

        }



    }


    //#3
    //       reseting the password

    export const resetPassword = async(req, res) => {



        try {
            const { email, newPassword } = req.body
            const user = await User.findOne({ email })

            if (!user || !user.isotpVerified) {

                return res.status(400).json({ message: "OTP verification is required...." })





            }
            const hashPassword = await bcrypt.hash(newPassword, 10)
                // here 10 is slat for hashingg

            user.password = hashPassword

            user.isotpVerified = false

            await user.save();
            return res.status(200).json({ message: "Password is reset  sucessfully...." })



        } catch (error) {
            return res.status(400).json({ message: "Password reset   error  in # authcontroller  .....", error })
        }
    }



    //google authentication   ke data ko DBme save  krengee


    export const googleAuth = async(req, res) => {

        try {
            const { fullName, email, mobile, role } = req.body

            let user = await User.findOne({ email })

            // signUp ni h to ye create kr dega user koo
            if (!user) {
                user = await User.create({
                    fullName,
                    email,
                    mobile,
                    role
                })
            }



            // mil gya user to login 

            // $$ genrate the token


            // token me save karege jwt token jo aya utils/ token.js
            //seee         yha se usme User ki ### id  jo MONGODB GENTRATE  KRTA HHH     pass karege haamm
            const token = await gentoken(user._id)
                // browser me cookie me id store krne ke liyeee

            res.cookie("token", token, {
                secure: false,
                sameSite: "strict",
                maxAge: 15 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })

            return res.status(200).json(user)




        } catch (error) {
            return res.status(400).json({ message: "Google auth error    error  in # authcontroller  .....", error })

        }


    }