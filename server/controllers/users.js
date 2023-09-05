import User from "../models/User.js";

// READ

export const getUser = async (req, res) => {

    try {

        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    }
    catch(err) {
        res.status(404).json({ message: err.message});
        console.log(err.message);
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map( (mapId) => User.findById(mapId) )
        );

        const formattedFriends = friends.map( ({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
        });

        res.status(200).json(formattedFriends);
    }
    catch(err) {
        res.status(404).json({ message: err.message});
        console.log(err.message);
    }
}

// UPDATE
export const addRemoveFriend = async (req, res) => {
    try {
       const { id, friendId } = req.params;

       const user = await User.findById(id);
       const friend = await User.findById(friendId);

       if(user.friends.includes(friendId)){
        user.friends = user.friends.filter((filterId) => filterId !== friendId);
        friend.friends = friend.friends.filter((filterId) => filterId !== id);
       }

       else {
        user.friends.push(friendId);
        friend.friends.push(id);
       }

       await user.save();
       await friend.save();

       const friends = user.friends.map((mapId) => User.findById(mapId));
       const formattedFriends = friends.map( ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
       });

       res.status(200).json(formattedFriends);


    }
    catch (err) {
        res.status(404).json({ message: err.message});
        console.log(err.message);
    }
}