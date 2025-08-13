import React, { useEffect } from "react";
import { motion } from "framer-motion";
import MyReviews from "./review/MyRewiews";
import ReviewForm from "./review/ReviewForm";
import apis from "../../../assets/utils/apis";
import httpAction from "../../../assets/utils/httpAction";

const Reviews = () => {
  const fetchReviews = async () => {
    const data = { url: apis().getMyReviews, method: "GET" };
    const result = await httpAction(data);
    // console.log fetched reviews with emoji
    console.log("📜 Reviews fetched:", result?.reviews || []);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      {/* 📝 Write a new review */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <ReviewForm onReviewCreated={fetchReviews} />
      </motion.div>

      {/* 📜 My previous reviews */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <MyReviews />
      </motion.div>
    </motion.div>
  );
};

export default Reviews;
