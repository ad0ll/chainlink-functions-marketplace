import React from "react";
import {useKonami} from "react-konami-code";
import {useCookies} from "react-cookie";
import {toast} from "react-toastify";

// TODO not sure if ergo keyboard or broken
// Shows some convenience controls in the UI, like raw dumps of form data and buttons to pre-fill forms
export const DevMode: React.FC = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['devMode']);

    const notifyDevMode = () => toast("Brrap brrap pew pew"); // https://www.youtube.com/watch?v=KPFBokh3u0w

    useKonami(() => {
        cookies.devMode === "true" ? removeCookie("devMode") : setCookie("devMode", "true")
        notifyDevMode()
        console.log("dev mode toggled")
    })

    return <div/>
}