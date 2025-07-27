import React, { useEffect } from "react";
import MyReviews from "./review/MyRewiews";
import ReviewForm from "./review/ReviewForm";
import apis from "../../../assets/utils/apis";
import httpAction from "../../../assets/utils/httpAction";

const Rewiews = () => {
  const fetchReviews = async () => {
    const data = { url: apis().getMyReviews, method: 'GET' };
    const result = await httpAction(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);
  return (
    <>
      <ReviewForm onReviewCreated={fetchReviews} />
      <MyReviews />
    </>
  );
};

export default Rewiews;
