import React from 'react'
import DonateItem from './DonateItem'
import ViewDonations from './ViewDonations'
import MyDonations from './MyDonations'
import MyClaims from './MyClaims'

const Donations = () => {
  return (
    <div>
      <DonateItem/>
      <MyDonations />
      <MyClaims />
      <ViewDonations />
    </div>
  )
}

export default Donations;
