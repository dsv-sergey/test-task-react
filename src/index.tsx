import '@epam/uui-components/styles.css';
import '@epam/uui/styles.css';
import './assets/theme/theme-faraway.scss';
import './index.module.scss';
//
import { StrictMode } from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from 'react-dom/client';
import { createBrowserHistory } from 'history';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import {
    DragGhost,
    HistoryAdaptedRouter,
    useUuiServices,
    UuiContext,
} from '@epam/uui-core';
import { ErrorHandler } from '@epam/uui';
import { Modals, Snackbar } from '@epam/uui-components';

import { MainPage } from './pages/MainPage';
import { PersonPage } from "./pages/PersonPage";
import { createQueryClient } from "./services";

const history = createBrowserHistory();
const router = new HistoryAdaptedRouter(history);
const queryClient = createQueryClient();

function UuiEnhancedApp() {
    const { services } = useUuiServices({ router });

    return (
        <UuiContext.Provider value={services}>
            <QueryClientProvider client={queryClient}>
            <ErrorHandler>
                <Router history={history}>
                    <Switch>
                        <Route exact path="/person/:id" component={PersonPage} />
                        <Route exact path="/person" component={MainPage} />
                        <Route exact path="/">
                            <Redirect to="/person" />
                        </Route>
                    </Switch>
                </Router>
                <Snackbar />
                <Modals />
                <DragGhost />
            </ErrorHandler>
            </QueryClientProvider>
        </UuiContext.Provider>
    );
}

function initApp() {
    const root = createRoot(window.document.getElementById('root') as Element);
    root.render(
        <StrictMode>
            <UuiEnhancedApp />
        </StrictMode>,
    );
}

initApp();
