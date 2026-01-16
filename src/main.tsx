import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {GlobalProvider} from "./GlobalProvider.tsx";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GlobalProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </GlobalProvider>
    </StrictMode>,
)
