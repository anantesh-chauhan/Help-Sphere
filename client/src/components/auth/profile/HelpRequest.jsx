import React from 'react'
import MyHelpRequests from './requests/MyHelpRequests'
import RequestHelp from './requests/RequestHelp'
import AllHelpRequests from './requests/AllHelpRequests'

const HelpRequest = () => {
  return (
    <div>
      <MyHelpRequests />
      <RequestHelp />
      <AllHelpRequests />
    </div>
  )
}

export default HelpRequest
