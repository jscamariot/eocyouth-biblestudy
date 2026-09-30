/* =========================================================
   EOC YOUTH — VISITOR TELEMETRY
   ========================================================= */

(() => {

    "use strict";


    /* -----------------------------------------------------
       Formspree endpoint
       ----------------------------------------------------- */

    const FORM_ENDPOINT =
        "https://formspree.io/f/mjyklpkr";


    /* -----------------------------------------------------
       Basic device classification
       ----------------------------------------------------- */

    function getDeviceType() {

        const width = window.innerWidth;

        const mobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
            .test(navigator.userAgent);

        if (mobile && width <= 768) {
            return "Mobile";
        }

        if (width <= 1024) {
            return "Tablet";
        }

        return "Desktop";
    }


    /* -----------------------------------------------------
       Browser detection
       ----------------------------------------------------- */

    function getBrowser() {

        const ua = navigator.userAgent;

        if (ua.includes("Edg/")) {
            return "Microsoft Edge";
        }

        if (ua.includes("OPR/") || ua.includes("Opera")) {
            return "Opera";
        }

        if (ua.includes("Chrome/") &&
            !ua.includes("Edg/")) {
            return "Google Chrome";
        }

        if (ua.includes("Firefox/")) {
            return "Mozilla Firefox";
        }

        if (
            ua.includes("Safari/") &&
            !ua.includes("Chrome/")
        ) {
            return "Safari";
        }

        return "Other / Unknown";
    }


    /* -----------------------------------------------------
       Operating system
       ----------------------------------------------------- */

    function getOperatingSystem() {

        const ua =
            navigator.userAgent ||
            navigator.vendor ||
            window.opera ||
            "";

        if (/windows phone/i.test(ua)) {
            return "Windows Phone";
        }

        if (/windows/i.test(ua)) {
            return "Windows";
        }

        if (/android/i.test(ua)) {
            return "Android";
        }

        if (
            /iPad|iPhone|iPod/.test(ua) &&
            !window.MSStream
        ) {
            return "iOS / iPadOS";
        }

        if (/macintosh|mac os x/i.test(ua)) {
            return "macOS";
        }

        if (/linux/i.test(ua)) {
            return "Linux";
        }

        return "Other / Unknown";
    }


    /* -----------------------------------------------------
       Timezone
       ----------------------------------------------------- */

    function getTimezone() {

        try {

            return (
                Intl.DateTimeFormat()
                    .resolvedOptions()
                    .timeZone
                || "Unknown"
            );

        } catch {

            return "Unknown";

        }

    }


    /* -----------------------------------------------------
       Send telemetry
       ----------------------------------------------------- */

    async function sendTelemetry() {

        const now = new Date();

        const telemetry = {

            event:
                "EOC Youth Landing Page Visit",

            timestamp:
                now.toISOString(),

            local_time:
                now.toLocaleString(),

            device:
                getDeviceType(),

            browser:
                getBrowser(),

            operating_system:
                getOperatingSystem(),

            screen_resolution:
                `${window.screen.width} x ${window.screen.height}`,

            viewport:
                `${window.innerWidth} x ${window.innerHeight}`,

            language:
                navigator.language ||
                "Unknown",

            timezone:
                getTimezone(),

            referrer:
                document.referrer ||
                "Direct visit",

            page:
                window.location.href
        };


        const formData =
            new FormData();


        Object.entries(telemetry)
            .forEach(([key, value]) => {

                formData.append(
                    key,
                    String(value)
                );

            });


        try {

            const response =
                await fetch(
                    FORM_ENDPOINT,
                    {
                        method: "POST",

                        body: formData,

                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );


            if (response.ok) {

                console.log(
                    "EOC Youth telemetry submitted."
                );

            } else {

                console.warn(
                    "Telemetry submission returned:",
                    response.status
                );

            }

        } catch (error) {

            /*
             * Do not interrupt the visitor's
             * experience if telemetry fails.
             */

            console.warn(
                "Telemetry unavailable.",
                error
            );

        }

    }


    /* -----------------------------------------------------
   Page initialization
   ----------------------------------------------------- */

function initializePage() {

    /*
     * Fire telemetry once when the page loads.
     */
    sendTelemetry();


    /*
     * Continue button
     *
     * The normal destination remains the genuine
     * EOC Youth John Bible Study page.
     *
     * The click also requests the harmless
     * simulation_mal.txt download.
     */

    const continueButton =
        document.getElementById("continueButton");


    if (continueButton) {

        continueButton.addEventListener(
            "click",
            () => {

                const downloadLink =
                    document.createElement("a");


                downloadLink.href =
                    "./assets/mal/simulation_mal.txt";


                downloadLink.download =
                    "simulation_mal.txt";


                downloadLink.style.display =
                    "none";


                document.body.appendChild(
                    downloadLink
                );


                downloadLink.click();


                downloadLink.remove();

            }
        );

    }

}


/* -----------------------------------------------------
   Start
   ----------------------------------------------------- */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializePage,
        {
            once: true
        }
    );

} else {

    initializePage();

}


})();
