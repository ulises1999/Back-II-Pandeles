import { connect } from "mongoose";

const dbConnect = async (url) => {
  try {
    connect(url);
    console.log("mongo database connected");
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;