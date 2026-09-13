import User from "../models/user.models.js";

export const updateLocation = async (req, res) => {
    try {
        const { latitude, longitude, address, city, state } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (latitude && longitude) {
            user.location = {
                type: "Point",
                coordinates: [longitude, latitude]
            };
        }
        if (address) user.address = address;
        if (city) user.city = city;
        if (state) user.state = state;

        await user.save();
        return res.status(200).json({ message: "Location updated successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Error updating location" });
    }
};
