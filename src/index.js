import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Outlet, RouterProvider, createHashRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import SettingsMenu from "./routes/SettingsMenu";
import InterviewChatbot from "./routes/InterviewChatbot";
import TimelineChatbot from "./routes/TimelineChatbot";
import FinancialChatbot from "./routes/FinancialChatbot";

const routes = [
    {
        index: true,
        element: <SettingsMenu />,
        title: "Settings"
    },
    {
        path: "/interview",
        element: <InterviewChatbot />,
        title: "Interview"
    },
    {
        path: "/timeline",
        element: <TimelineChatbot />,
        title: "Timeline"
    },
    {
        path: "/financial",
        element: <FinancialChatbot />,
        title: "Financial"
    }
];

const router = createHashRouter([
    {
        path: "/",
        element: (
            <>
                <Navbar routes={routes} />
                <Outlet />
            </>
        ),
        children: routes
    }
]);

const root = ReactDOM.createRoot(
    document.getElementById("root")
);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);