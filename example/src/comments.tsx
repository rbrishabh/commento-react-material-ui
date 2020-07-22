import React, { useState } from 'react'
import { CommentsPage } from 'commento-react-material-ui'

export default function Comments() {
  const [flag, setSwitch] = useState(false)

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CommentsPage
        pageId={
          flag
            ? '2qwheYL25ctjDFrdEqr3Kg-[63bfd622-a23a-439c-ba36-f135c091e1ac]-organization'
            : '4yjtdhs8LmZ2nQmeQC4Tv-[auth0|5edb8f3dc9db2e0d36a6d77c]-personal'
        }
        pageType={'popup'}
        width={400}
        key={flag ? 'organization' : 'personal'}
        label={flag ? 'Team Discussion' : 'Personal Notes'}
        commentSystem={flag ? 'organization' : 'personal'}
      />

      <button onClick={() => setSwitch(prev => !prev)}>Switch</button>
    </div>
  )
}
