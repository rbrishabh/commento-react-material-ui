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
        <CommentsPage pageId={'2MsuNQY7Cav9mXRmVynY0d-[mag-f4767kbj7mmy2-collection]-collection'} allowOnlyOneRootComment={true} />
      </CommnetoAuthProvider>
    </div>
  )
}

export default App
