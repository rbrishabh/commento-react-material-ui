# commento-react-material-ui

### **Warning** ⚠ : This package is not ready to be used in production, also the current layout of the application is synchronized for a special internal usecase. Hence, it won't work with a regular commento installation.

### **Future Releases**: The plan is to make this package work cohesively with a regular commento installtion as described on Commento.io

### **Future Releases**: The plan is to make this package work cohesively with a regular commento installtion as described on Commento.io

### This package has been derived from [![NPM](https://img.shields.io/npm/v/commento-react.svg)](https://www.npmjs.com/package/commento-react) COMMENTO-REACT npm package.

### Your project must use material-ui to use this as a dependency.

> A react based frontend for Commento

> Visit [Commento.io](https://commento.io/) to know more about how to setup the backend.

## Install

```bash
npm i commento-react-material-ui
```

## Usage

```tsx
import React from 'react'

import { CommnetoAuthProvider, CommentsPage } from 'commento-react-material-ui'
import 'commento-react/dist/commento-style.css'
const dummyAuthToken = process.env.REACT_APP_AUTH_TOKEN

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
          commentSystem={'organization'}>
      </CommnetoAuthProvider>
    </div>
  )
}
```

## License

MIT © [rbrishabh](https://github.com/rbrishabh)
