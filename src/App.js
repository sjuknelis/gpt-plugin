import { useState } from 'react';
import InterviewChatbot from './routes/InterviewChatbot';
import SettingsMenu from './routes/SettingsMenu';
import Navbar from './components/Navbar';

export default function App() {
    const [activeRoute,setActiveRoute] = useState("settings");

    const routes = {
        settings: <SettingsMenu />,
        interview: <InterviewChatbot />
    };

    return (
        <>
            <Navbar routes={routes} activeRoute={activeRoute} setActiveRoute={setActiveRoute} />
            { routes[activeRoute] }
        </>
    );
}