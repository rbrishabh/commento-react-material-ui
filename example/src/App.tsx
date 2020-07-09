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
            '2qwheYL25ctjDFrdEqr3Kg-[63bfd622-a23a-439c-ba36-f135c091e1ac]-organization'
          }
          pageType={'popup'}
          height={750}
          width={400}
          commentSystem={'personal'}
        />
      </CommnetoAuthProvider>
    </div>
  )
}

export default App
