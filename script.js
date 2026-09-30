/* =====================================================
   SMART ELECTRICITY USAGE PREDICTOR
   COMPLETE MODIFIED JAVASCRIPT
===================================================== */


/* =====================================================
   1. AC / LIGHTS ON-OFF BUTTON
===================================================== */

function toggleButton(id) {

    const button = document.getElementById(id);

    if (!button) {
        return;
    }

    button.classList.toggle("on");

    if (button.classList.contains("on")) {
        button.innerText = "ON";
    } else {
        button.innerText = "OFF";
    }
}


/* =====================================================
   2. GET DATE IN YYYY-MM-DD FORMAT
===================================================== */

function getDateString(date = new Date()) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* =====================================================
   3. PREDICT ELECTRICITY USAGE
===================================================== */

async function predictUsage() {

    /* -------------------------------------------------
       GET INPUT ELEMENTS
    ------------------------------------------------- */

    const roomElement =
        document.getElementById("room");

    const studentsElement =
        document.getElementById("students");

    const temperatureElement =
        document.getElementById("temperature");

    const dayElement =
        document.getElementById("day");

    const timeElement =
        document.getElementById("time");

    const acElement =
        document.getElementById("ac");

    const lightsElement =
        document.getElementById("lights");


    /* -------------------------------------------------
       CHECK ELEMENTS
    ------------------------------------------------- */

    if (
        !roomElement ||
        !studentsElement ||
        !temperatureElement ||
        !dayElement ||
        !timeElement ||
        !acElement ||
        !lightsElement
    ) {

        alert("Some input fields are missing.");

        return;
    }


    /* -------------------------------------------------
       GET USER INPUT
    ------------------------------------------------- */

    const room =
        roomElement.value;

    const students =
        Number(studentsElement.value);

    const temperature =
        Number(temperatureElement.value);

    const day =
        Number(dayElement.value);

    const time =
        timeElement.value;

    const ac =
        acElement.classList.contains("on");

    const lights =
        lightsElement.classList.contains("on");


    /* -------------------------------------------------
       VALIDATION
    ------------------------------------------------- */

    if (!room) {

        alert("Please select a room.");

        return;
    }


    if (
        isNaN(students) ||
        students <= 0
    ) {

        alert(
            "Number of students must be greater than 0."
        );

        return;
    }


    if (
        isNaN(temperature) ||
        temperature <= 0
    ) {

        alert(
            "Please enter a valid temperature."
        );

        return;
    }


    if (!time) {

        alert(
            "Please select a time."
        );

        return;
    }


    /* =================================================
       SHOW PREDICTING
    ================================================= */

    const resultElement =
        document.getElementById("result");

    const statusElement =
        document.getElementById("status");


    if (resultElement) {

        resultElement.innerText =
            "Predicting...";

    }


    if (statusElement) {

        statusElement.innerText =
            "Please wait...";

    }


    /* =================================================
       DATA SENT TO FLASK
    ================================================= */

    const requestData = {

        room: room,

        students: students,

        temperature: temperature,

        day: day,

        time: time,

        ac: ac,

        lights: lights

    };


    console.log(
        "Sending to backend:",
        requestData
    );


    /* =================================================
       CALL FLASK ML BACKEND
    ================================================= */

    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/predict",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            requestData
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                "Backend request failed."
            );

        }


        /* -------------------------------------------------
           GET BACKEND RESULT
        ------------------------------------------------- */

        const result =
            await response.json();


        console.log(
            "Backend result:",
            result
        );


        /* =================================================
           GET PREDICTED VALUE
        ================================================= */

        const predictedUsage =
            Number(
                result.predicted_usage
            );


        if (isNaN(predictedUsage)) {

            throw new Error(
                "Invalid predicted value."
            );

        }


        /* =================================================
           DISPLAY PREDICTED VALUE
        ================================================= */

        if (resultElement) {

            resultElement.innerText =
                predictedUsage.toFixed(2) +
                " kWh";

        }


        /* =================================================
           DISPLAY STATUS
        ================================================= */

        if (statusElement) {

            statusElement.innerText =
                result.status;

        }


        /* =================================================
           DISPLAY ROOM
        ================================================= */

        const resultRoom =
            document.getElementById(
                "resultRoom"
            );


        if (resultRoom) {

            resultRoom.innerText =
                result.room === "lab"
                    ? "Laboratory"
                    : "Classroom";

        }


        /* =================================================
           DISPLAY STUDENTS
        ================================================= */

        const resultStudents =
            document.getElementById(
                "resultStudents"
            );


        if (resultStudents) {

            resultStudents.innerText =
                result.students;

        }


        /* =================================================
           DISPLAY TEMPERATURE
        ================================================= */

        const resultTemp =
            document.getElementById(
                "resultTemp"
            );


        if (resultTemp) {

            resultTemp.innerText =
                result.temperature +
                " °C";

        }


        /* =================================================
           DISPLAY AC
        ================================================= */

        const resultAC =
            document.getElementById(
                "resultAC"
            );


        if (resultAC) {

            resultAC.innerText =
                result.ac
                    ? "ON"
                    : "OFF";

        }


        /* =================================================
           DISPLAY LIGHTS
        ================================================= */

        const resultLights =
            document.getElementById(
                "resultLights"
            );


        if (resultLights) {

            resultLights.innerText =
                result.lights
                    ? "ON"
                    : "OFF";

        }


        /* =================================================
           DISPLAY TIME
        ================================================= */

        const resultTime =
            document.getElementById(
                "resultTime"
            );


        if (resultTime) {

            resultTime.innerText =
                result.time;

        }


        /* =================================================
           IMPORTANT:
           CREATE TODAY'S COMPLETE RECORD
        ================================================= */

        const today =
            getDateString();


        const predictionData = {

            /* ML predicted value */
            usage:
                Number(
                    predictedUsage.toFixed(2)
                ),

            /* USER INPUT */
            room:
                result.room === "lab"
                    ? "Laboratory"
                    : "Classroom",

            students:
                Number(
                    result.students
                ),

            temperature:
                Number(
                    result.temperature
                ),

            day:
                Number(
                    result.day
                ),

            time:
                result.time,

            ac:
                Boolean(
                    result.ac
                ),

            lights:
                Boolean(
                    result.lights
                ),

            status:
                result.status,

            /* VERY IMPORTANT */
            date:
                today,

            createdAt:
                new Date().toISOString()

        };


        console.log(
            "COMPLETE DATA TO SAVE:",
            predictionData
        );


        /* =================================================
           GET OLD HISTORY
        ================================================= */

        let history = [];


        try {

            history =
                JSON.parse(
                    localStorage.getItem(
                        "energyHistory"
                    )
                ) || [];

        }
        catch (error) {

            console.error(
                "History error:",
                error
            );

            history = [];

        }


        /* =================================================
           SAVE NEW PREDICTION
        ================================================= */

        history.push(
            predictionData
        );


        /* =================================================
           SAVE COMPLETE HISTORY
        ================================================= */

        localStorage.setItem(
            "energyHistory",
            JSON.stringify(
                history
            )
        );


        /* =================================================
           SAVE LATEST PREDICTION
        ================================================= */

        localStorage.setItem(
            "todayEnergy",
            JSON.stringify(
                predictionData
            )
        );


        /* =================================================
           KEEP OLD energyData ALSO
        ================================================= */

        localStorage.setItem(
            "energyData",
            JSON.stringify(
                predictionData
            )
        );


        console.log(
            "Prediction successfully saved!"
        );


        /* =================================================
           SUCCESS
        ================================================= */

        alert(
            "Prediction completed successfully!\n\n" +

            "Predicted Usage: " +

            predictedUsage.toFixed(2) +

            " kWh"
        );


    }
    catch (error) {

        console.error(
            "Prediction error:",
            error
        );


        if (resultElement) {

            resultElement.innerText =
                "-- kWh";

        }


        if (statusElement) {

            statusElement.innerText =
                "Prediction failed";

        }


        alert(
            "Could not connect to Flask backend.\n\n" +
            "Please run:\n" +
            "python app.py"
        );

    }

}


/* =====================================================
   4. GET DAY DATA
===================================================== */

function getDayData(records) {

    if (
        !records ||
        records.length === 0
    ) {

        return null;

    }


    /* -------------------------------------------------
       TOTAL USAGE
    ------------------------------------------------- */

    let totalUsage = 0;


    records.forEach(
        function (item) {

            totalUsage +=
                Number(item.usage) || 0;

        }
    );


    /* -------------------------------------------------
       AVERAGE USAGE
    ------------------------------------------------- */

    const averageUsage =
        totalUsage /
        records.length;


    /* -------------------------------------------------
       LATEST USER INPUT
    ------------------------------------------------- */

    const latest =
        records[
            records.length - 1
        ];


    return {

        usage:
            Number(
                averageUsage.toFixed(2)
            ),

        room:
            latest.room || "-",

        students:
            latest.students || 0,

        temperature:
            latest.temperature || 0,

        ac:
            latest.ac,

        lights:
            latest.lights,

        time:
            latest.time || "-",

        status:
            latest.status || "-"

    };

}


/* =====================================================
   5. LOAD DASHBOARD
===================================================== */

function loadDashboard() {

    console.log(
        "========== DASHBOARD LOADING =========="
    );


    /* -------------------------------------------------
       GET HISTORY
    ------------------------------------------------- */

    let history = [];


    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "energyHistory"
                )
            ) || [];

    }
    catch (error) {

        console.error(
            "Cannot read history:",
            error
        );

        history = [];

    }


    console.log(
        "Stored History:",
        history
    );


    /* =================================================
       TODAY
    ================================================= */

    const today =
        new Date();


    const todayString =
        getDateString(
            today
        );


    /* =================================================
       YESTERDAY
    ================================================= */

    const yesterday =
        new Date();


    yesterday.setDate(
        yesterday.getDate() - 1
    );


    const yesterdayString =
        getDateString(
            yesterday
        );


    console.log(
        "Today:",
        todayString
    );


    console.log(
        "Yesterday:",
        yesterdayString
    );


    /* =================================================
       GET TODAY RECORDS
    ================================================= */

    const todayRecords =
        history.filter(
            function (item) {

                return (
                    item.date ===
                    todayString
                );

            }
        );


    /* =================================================
       GET YESTERDAY RECORDS
    ================================================= */

    const yesterdayRecords =
        history.filter(
            function (item) {

                return (
                    item.date ===
                    yesterdayString
                );

            }
        );


    console.log(
        "Today's records:",
        todayRecords
    );


    console.log(
        "Yesterday records:",
        yesterdayRecords
    );


    /* =================================================
       GET DATA
    ================================================= */

    const todayData =
        getDayData(
            todayRecords
        );


    const yesterdayData =
        getDayData(
            yesterdayRecords
        );


    /* =================================================
       TODAY USAGE
    ================================================= */

    const todayUsage =
        document.getElementById(
            "todayUsage"
        );


    if (todayUsage) {

        todayUsage.innerText =
            todayData
                ? todayData.usage.toFixed(2) +
                  " kWh"
                : "-- kWh";

    }


    /* =================================================
       YESTERDAY USAGE
    ================================================= */

    const yesterdayUsage =
        document.getElementById(
            "yesterdayUsage"
        );


    if (yesterdayUsage) {

        yesterdayUsage.innerText =
            yesterdayData
                ? yesterdayData.usage.toFixed(2) +
                  " kWh"
                : "-- kWh";

    }


    /* =================================================
       TODAY DATE
    ================================================= */

    const todayDate =
        document.getElementById(
            "todayDate"
        );


    if (todayDate) {

        todayDate.innerText =
            todayData
                ? todayString
                : "No data";

    }


    /* =================================================
       YESTERDAY DATE
    ================================================= */

    const yesterdayDate =
        document.getElementById(
            "yesterdayDate"
        );


    if (yesterdayDate) {

        yesterdayDate.innerText =
            yesterdayData
                ? yesterdayString
                : "No data";

    }


    /* =================================================
       DIFFERENCE
    ================================================= */

    const differenceElement =
        document.getElementById(
            "difference"
        );


    const differenceTextElement =
        document.getElementById(
            "differenceText"
        );


    if (
        todayData &&
        yesterdayData
    ) {

        const difference =
            Number(
                (
                    todayData.usage -
                    yesterdayData.usage
                ).toFixed(2)
            );


        if (differenceElement) {

            differenceElement.innerText =
                (
                    difference > 0
                        ? "+"
                        : ""
                ) +
                difference +
                " kWh";

        }


        if (differenceTextElement) {

            if (difference > 0) {

                differenceTextElement.innerText =
                    "Electricity usage increased today.";

            }
            else if (difference < 0) {

                differenceTextElement.innerText =
                    "Electricity usage decreased today.";

            }
            else {

                differenceTextElement.innerText =
                    "Electricity usage is the same.";

            }

        }

    }
    else {

        if (differenceElement) {

            differenceElement.innerText =
                "-- kWh";

        }


        if (differenceTextElement) {

            differenceTextElement.innerText =
                "Need data for both days.";

        }

    }


    /* =================================================
       BAR CHART
    ================================================= */

    const yesterdayBar =
        document.getElementById(
            "yesterdayBar"
        );


    const todayBar =
        document.getElementById(
            "todayBar"
        );


    const yesterdayBarValue =
        document.getElementById(
            "yesterdayBarValue"
        );


    const todayBarValue =
        document.getElementById(
            "todayBarValue"
        );


    const yesterdayValue =
        yesterdayData
            ? yesterdayData.usage
            : 0;


    const todayValue =
        todayData
            ? todayData.usage
            : 0;


    const maxUsage =
        Math.max(
            yesterdayValue,
            todayValue,
            1
        );


    const yesterdayHeight =
        yesterdayData
            ? (
                yesterdayValue /
                maxUsage
            ) * 250
            : 10;


    const todayHeight =
        todayData
            ? (
                todayValue /
                maxUsage
            ) * 250
            : 10;


    if (yesterdayBar) {

        yesterdayBar.style.height =
            `${yesterdayHeight}px`;

    }


    if (todayBar) {

        todayBar.style.height =
            `${todayHeight}px`;

    }


    if (yesterdayBarValue) {

        yesterdayBarValue.innerText =
            yesterdayData
                ? yesterdayValue.toFixed(2)
                : "0";

    }


    if (todayBarValue) {

        todayBarValue.innerText =
            todayData
                ? todayValue.toFixed(2)
                : "0";

    }


    /* =================================================
       YESTERDAY DETAILS
    ================================================= */

    if (yesterdayData) {

        const yRoom =
            document.getElementById(
                "yRoom"
            );

        const yStudents =
            document.getElementById(
                "yStudents"
            );

        const yTemperature =
            document.getElementById(
                "yTemperature"
            );

        const yAC =
            document.getElementById(
                "yAC"
            );

        const yLights =
            document.getElementById(
                "yLights"
            );


        if (yRoom) {

            yRoom.innerText =
                yesterdayData.room;

        }


        if (yStudents) {

            yStudents.innerText =
                yesterdayData.students;

        }


        if (yTemperature) {

            yTemperature.innerText =
                yesterdayData.temperature +
                "°C";

        }


        if (yAC) {

            yAC.innerText =
                yesterdayData.ac
                    ? "ON"
                    : "OFF";

        }


        if (yLights) {

            yLights.innerText =
                yesterdayData.lights
                    ? "ON"
                    : "OFF";

        }

    }


    /* =================================================
       TODAY DETAILS
    ================================================= */

    if (todayData) {

        const tRoom =
            document.getElementById(
                "tRoom"
            );

        const tStudents =
            document.getElementById(
                "tStudents"
            );

        const tTemperature =
            document.getElementById(
                "tTemperature"
            );

        const tAC =
            document.getElementById(
                "tAC"
            );

        const tLights =
            document.getElementById(
                "tLights"
            );


        if (tRoom) {

            tRoom.innerText =
                todayData.room;

        }


        if (tStudents) {

            tStudents.innerText =
                todayData.students;

        }


        if (tTemperature) {

            tTemperature.innerText =
                todayData.temperature +
                "°C";

        }


        if (tAC) {

            tAC.innerText =
                todayData.ac
                    ? "ON"
                    : "OFF";

        }


        if (tLights) {

            tLights.innerText =
                todayData.lights
                    ? "ON"
                    : "OFF";

        }

    }


    console.log(
        "========== DASHBOARD LOADED =========="
    );

}


/* =====================================================
   6. CREATE TEST YESTERDAY DATA
===================================================== */

function createTestYesterdayData() {

    const yesterday =
        new Date();


    yesterday.setDate(
        yesterday.getDate() - 1
    );


    const yesterdayString =
        getDateString(
            yesterday
        );


    const testData = {

        usage: 8.40,

        room:
            "Laboratory",

        students:
            35,

        temperature:
            27,

        day:
            yesterday.getDay(),

        time:
            "10:00",

        ac:
            false,

        lights:
            true,

        status:
            "Moderate electricity consumption",

        date:
            yesterdayString,

        createdAt:
            "Test Yesterday Data"

    };


    let history = [];


    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "energyHistory"
                )
            ) || [];

    }
    catch (error) {

        history = [];

    }


    /* Remove old test record */

    history =
        history.filter(
            function (item) {

                return !(
                    item.date ===
                    yesterdayString &&

                    item.createdAt ===
                    "Test Yesterday Data"
                );

            }
        );


    /* Add test record */

    history.push(
        testData
    );


    /* Save */

    localStorage.setItem(
        "energyHistory",
        JSON.stringify(history)
    );


    /* Refresh */

    loadDashboard();


    alert(
        "Yesterday test data created successfully!\n\n" +

        "Usage: 8.40 kWh\n" +

        "Room: Laboratory\n" +

        "Students: 35\n" +

        "Temperature: 27°C\n" +

        "AC: OFF\n" +

        "Lights: ON"
    );

}


/* =====================================================
   7. CLEAR ALL DATA
===================================================== */

function clearEnergyData() {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete all energy data?"
        );


    if (!confirmDelete) {

        return;

    }


    localStorage.removeItem(
        "energyHistory"
    );

    localStorage.removeItem(
        "energyData"
    );

    localStorage.removeItem(
        "todayEnergy"
    );


    alert(
        "All energy data has been cleared."
    );


    location.reload();

}


/* =====================================================
   8. AUTOMATICALLY LOAD DASHBOARD
===================================================== */

window.addEventListener(
    "load",
    function () {

        if (
            document.getElementById(
                "todayUsage"
            )
        ) {

            loadDashboard();
            loadPredictionHistory();
            loadUsageTrend();
            loadRecommendation();
            loadStatistics();

        }

    }
);


/* =====================================================
   9. DOM CONTENT LOADED
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            document.getElementById(
                "todayUsage"
            )
        ) {

            loadDashboard();

        }

    }
);


/* =====================================================
   10. JAVASCRIPT LOADED
===================================================== */

console.log(
    "Smart Electricity Predictor JavaScript loaded successfully."
);
function loadPredictionHistory() {

    const tableBody = document.getElementById("historyTableBody");

    if (!tableBody) {
        return;
    }

    let history = [];

    try {
        history = JSON.parse(
            localStorage.getItem("energyHistory")
        ) || [];
    } catch (error) {
        history = [];
    }

    if (history.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9">
                    No prediction history available.
                </td>
            </tr>
        `;

        return;
    }

    // Latest predictions first
    history.reverse();

    tableBody.innerHTML = "";

    history.forEach(function (item) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.date || "-"}</td>

            <td>${item.time || "-"}</td>

            <td>${item.room || "-"}</td>

            <td>${item.students ?? "-"}</td>

            <td>${item.temperature ?? "-"}°C</td>

            <td>${item.ac ? "ON" : "OFF"}</td>

            <td>${item.lights ? "ON" : "OFF"}</td>

            <td>
                <strong>
                    ${Number(item.usage || 0).toFixed(2)} kWh
                </strong>
            </td>

            <td class="${
    item.status === "High electricity consumption"
        ? "status-high"
        : item.status === "Moderate electricity consumption"
        ? "status-moderate"
        : "status-low"
}">
    ${item.status || "-"}
</td>
        `;

        tableBody.appendChild(row);

    });
}
function loadUsageTrend() {

    const chart = document.getElementById("trendChart");
    const noData = document.getElementById("noTrendData");

    if (!chart) {
        return;
    }

    let history = [];

    try {
        history = JSON.parse(
            localStorage.getItem("energyHistory")
        ) || [];
    } catch (error) {
        history = [];
    }

    if (history.length === 0) {

        if (noData) {
            noData.style.display = "block";
        }

        return;
    }

    if (noData) {
        noData.style.display = "none";
    }

    // Remove old bars
    chart.innerHTML = "";

    // Show only latest 10 predictions
    const data = history.slice(-10);

    // Find highest usage
    const maxUsage = Math.max(
        ...data.map(item => Number(item.usage) || 0)
    );

    data.forEach(function (item) {

        const usage = Number(item.usage) || 0;

        const height = maxUsage > 0
            ? (usage / maxUsage) * 100
            : 0;

        const barContainer = document.createElement("div");

        barContainer.className = "trend-bar-container";

        barContainer.innerHTML = `

            <div class="trend-value">
                ${usage.toFixed(2)} kWh
            </div>

            <div
                class="trend-bar"
                style="height: ${height}%"
            ></div>

            <div class="trend-time">
                ${item.time || "--"}
            </div>

        `;

        chart.appendChild(barContainer);

    });
}
function loadRecommendation() {

    const card =
        document.getElementById("recommendationCard");

    const title =
        document.getElementById("recommendationTitle");

    const text =
        document.getElementById("recommendationText");


    if (!card || !title || !text) {
        return;
    }


    // Remove old recommendation classes
    card.classList.remove(
        "recommendation-low",
        "recommendation-moderate",
        "recommendation-high"
    );


    // Get prediction history
    let history = [];

    try {

        history =
            JSON.parse(
                localStorage.getItem("energyHistory")
            ) || [];

    } catch (error) {

        history = [];
    }


    // No prediction available
    if (history.length === 0) {

        title.innerText =
            "No recommendation yet";

        text.innerText =
            "Make a prediction to receive an energy-saving suggestion.";

        return;
    }


    // Get latest prediction
    const latest =
        history[history.length - 1];


    const usage =
        Number(latest.usage) || 0;


    // ==========================================
    // HIGH USAGE
    // ==========================================

    if (usage >= 12) {

        card.classList.add(
            "recommendation-high"
        );

        title.innerText =
            "High Energy Usage";

        text.innerText =
            "Consider reducing unnecessary AC usage and switching OFF unused lights or electrical appliances.";
    }


    // ==========================================
    // MODERATE USAGE
    // ==========================================

    else if (usage >= 7) {

        card.classList.add(
            "recommendation-moderate"
        );

        title.innerText =
            "Moderate Energy Usage";

        text.innerText =
            "Try switching OFF unnecessary lights and optimizing AC usage when possible.";
    }


    // ==========================================
    // LOW USAGE
    // ==========================================

    else {

        card.classList.add(
            "recommendation-low"
        );

        title.innerText =
            "Efficient Energy Usage";

        text.innerText =
            "Your predicted electricity usage is relatively low. Continue using electrical appliances efficiently.";
    }
}
function loadStatistics() {

    const totalElement =
        document.getElementById("totalPredictions");

    const averageElement =
        document.getElementById("averageUsage");

    const highestElement =
        document.getElementById("highestUsage");

    const lowestElement =
        document.getElementById("lowestUsage");

    if (
        !totalElement ||
        !averageElement ||
        !highestElement ||
        !lowestElement
    ) {
        return;
    }

    let history = [];

    try {

        history = JSON.parse(
            localStorage.getItem("energyHistory")
        ) || [];

    } catch (error) {

        history = [];

    }

    if (history.length === 0) {

        totalElement.innerText = "0";
        averageElement.innerText = "0.00 kWh";
        highestElement.innerText = "0.00 kWh";
        lowestElement.innerText = "0.00 kWh";

        return;
    }

    const usages = history.map(function (item) {

        return Number(item.usage) || 0;

    });

    const total = usages.length;

    const sum = usages.reduce(
        function (a, b) {
            return a + b;
        },
        0
    );

    const average = sum / total;

    const highest = Math.max(...usages);

    const lowest = Math.min(...usages);

    totalElement.innerText = total;

    averageElement.innerText =
        average.toFixed(2) + " kWh";

    highestElement.innerText =
        highest.toFixed(2) + " kWh";

    lowestElement.innerText =
        lowest.toFixed(2) + " kWh";
}