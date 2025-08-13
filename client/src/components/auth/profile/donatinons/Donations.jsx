import React from "react";
import { motion } from "framer-motion";
import DonateItem from "./DonateItem";
import ViewDonations from "./ViewDonations";
import MyDonations from "./MyDonations";
import MyClaims from "./MyClaims";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
};

const sectionVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const Donations = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        maxWidth: "1200px",
        margin: "auto",
        padding: "20px",
        display: "grid",
        gap: "20px",
        background: "#f5f5f5",
        borderRadius: "10px",
      }}
    >
      <motion.div variants={sectionVariants} style={{ background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}>
        <DonateItem />
      </motion.div>

      <motion.div variants={sectionVariants} style={{ background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}>
        <MyDonations />
      </motion.div>

      <motion.div variants={sectionVariants} style={{ background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}>
        <MyClaims />
      </motion.div>

      <motion.div variants={sectionVariants} style={{ background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}>
        <ViewDonations />
      </motion.div>
    </motion.div>
  );
};

export default Donations;
