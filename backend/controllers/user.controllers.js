import User from "../models/user.models.js";









// export const getCurrUser = async(req, res) => {
//     try {
//         const userId = req.userId;
//         if (!userId) {

//             return res.status(400).json({
//                 message: "UserID is Not  Found"
//             })
//         }
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(400).json({
//                 message: "User is Not  Found"
//             })
//         }
//         return res.status(200).json(user)









//     } catch (error) {
//         return res.status(500).json({
//             message: `get  current  user error${error}`
//         })
//     }
// }






export const getCurrUser = async(req, res) => {
    try {
        const userId = req.userId;

        // 1. Check userId
        if (!userId) {
            return res.status(400).json({
                message: "UserID is Not Found"
            });
        }

        // 2. Find user
        const user = await User.findById(userId);

        // 3. Check user exists
        if (!user) {
            return res.status(400).json({
                message: "User Not Found"
            });
        }

        // 4. Send response
        return res.status(200).json(user);

    } catch (error) {
        console.log("ERROR:", error);
        return res.status(500).json({
            message: `get current user error: ${error.message}`
        });
    }
};




// user location update controller
export const updateUserLocation = async(req, res) => {
    try {

        const { lat, lon } = req.body;
        const user = await User.findByIdAndUpdate(req.userId, { location: { type: 'Point', coordinates: [lon, lat] } }, { new: true });

        if (!user) {

            return res.status(400).json({ message: "User not found" });

        }


        return res.status(200).json({ message: "User location updated successfully", user });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating user location",
            error,
            error: error.message
        });

    }
}