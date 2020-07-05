import React from 'react'

import { CommnetoAuthProvider, CommentsPage } from 'commento-react'
import 'commento-react/dist/commento-style.css'

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
            'your-awesome-commento-pageid'
          }
          pageType={'popup'}
          height={600}
          width={400}
          commentSystem={'organization'}
        ></CommentsPage>
      </CommnetoAuthProvider>
    </div>
  )
}

export default App
