import { useState, useEffect } from "react";

export default function useSettings() {
    const [settings,setSettings] = useState(
        localStorage.getItem("settings") ?
        JSON.parse(localStorage.getItem("settings")) :
        {resume: "", jobDescription: ""}
    );

    useEffect(() => {
        localStorage.setItem("settings",JSON.stringify(settings));
    },[settings]);

    return [settings,setSettings];
}