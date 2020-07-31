import React from 'react'

import { CommnetoAuthProvider } from 'commento-react-material-ui'
import 'commento-react-material-ui/dist/commento-style.css'
// import { CommentsCount as CommentsCountLib } from 'commento-react-material-ui'
import Comments from './comments'
const dummyAuthToken = process.env.REACT_APP_AUTH_TOKEN
// console.log(dummyAuthToken)
const App = () => {
  return (
    <div>
      <CommnetoAuthProvider
        sso={true}
        commentoOrigin={process.env.REACT_APP_COMMENTO_ORIGIN as string}
        ssoToken={dummyAuthToken}
      >
        <Comments />
      </CommnetoAuthProvider>
    </div>
  )
}

export default App
