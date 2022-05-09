// this middleware concept is used to allow users to like, delete, add posts to db
import jwt from "jsonwebtoken";
// 'next' in pram means do something and move to the next
const auth = async (req, res, next) => {
  try {
    // we will check if the user is really who he is claim to be and for that we will check his token, will get the token from frontend.
    const token = req.headers.authorization.split(" ")[1]; // first position in the array when we split it

    // now we will check the token is from google(if token length is > 500) or from own db
    const isCustomAuth = token.length < 500;

    let decodedData; // this is the data i-e(username & id) we get from the token its self.

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "test"); // this will give us the data from each specific token

      // as now we know which user is logged in and liking the post so we will store his id in req.body
      req.userId = decodedData?.id;
    } else {
      // if working with google auth token
      decodedData = jwt.decode(token); // we don't need to pass secret here

      req.userId = decodedData?.sub; // sub is a google name for specific id that differentiate every single google user.
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
