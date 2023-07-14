import { useEffect, useState } from 'react';
import InterviewChatbot from './InterviewChatbot';
import SettingsMenu from './SettingsMenu';
import './App.css';

export default function App() {
    const [settings,setSettings] = useState(
        localStorage.getItem("settings") ?
        JSON.parse(localStorage.getItem("settings")) :
        {resume: "", jobDescription: ""}
    );

    useEffect(() => {
        localStorage.setItem("settings",JSON.stringify(settings));
    },[settings]);

    const [activeMenu,setActiveMenu] = useState("settings");

    const menus = {
        settings: <SettingsMenu settings={settings} setSettings={setSettings} />,
        interview: <InterviewChatbot settings={settings} />
    };

    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <>
            <div className="row menu">
                <div className="col">
                    <a className="menu-brand" href="#">GPT-Coworker</a>
                </div>
                {
                    Object.keys(menus).map(menu => (
                        <div className="col">
                            <a className={menu == activeMenu ? "active" : ""} onClick={() => setActiveMenu(menu)} href="#">{ capitalize(menu) }</a>
                        </div>
                    ))
                }
            </div>
            { menus[activeMenu] }
        </>
    );
}