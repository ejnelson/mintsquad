import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'

// Use require instead of import, and order matters
require('@solana/wallet-adapter-react-ui/styles.css')
require('./index.css')

ReactDOM.render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById('root')
)
