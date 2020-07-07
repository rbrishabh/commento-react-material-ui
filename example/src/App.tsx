import React from 'react'

import { CommnetoAuthProvider, CommentsPage } from 'commento-react-material-ui'
import 'commento-react-material-ui/dist/commento-style.css'

const dummyAuthToken = process.env.REACT_APP_AUTH_TOKEN
console.log(dummyAuthToken)
const App = () => {
  return (
    <div>
      <CommnetoAuthProvider
        sso={true}
        commentoOrigin={process.env.REACT_APP_COMMENTO_ORIGIN as string}
        ssoToken={dummyAuthToken}
      >
        <CommentsPage
          pageId={
            '2qwheYL25ctjDFrdEqr3Kg-[1e3daaa8-1c6b-4759-9694-25ad20902d13]-organization'
          }
          pageType={'popup'}
          height={750}
          width={400}
          commentSystem={'team'}
        />
      </CommnetoAuthProvider>
    </div>
  )
}

export default App
