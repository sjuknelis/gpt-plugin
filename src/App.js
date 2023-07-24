import { useState } from 'react';
import Navbar from './components/Navbar';
import InterviewChatbot from './routes/InterviewChatbot';
import SettingsMenu from './routes/SettingsMenu';
import TimelineChatbot from './routes/TimelineChatbot';

export default function App() {
    const [activeRoute,setActiveRoute] = useState("settings");

    const routes = {
        settings: <SettingsMenu />,
        interview: <InterviewChatbot />,
        timeline: <TimelineChatbot />
    };

    return (
        <>
            <Navbar routes={routes} activeRoute={activeRoute} setActiveRoute={setActiveRoute} />
            { routes[activeRoute] }
        </>
    );
}