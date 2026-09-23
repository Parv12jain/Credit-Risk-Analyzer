let currentStep = 1;


const steps =
    document.querySelectorAll(".form-step");


const currentStepText =
    document.getElementById("currentStep");



// =========================================================
// CUSTOM DROPDOWNS
// =========================================================


function closeAllDropdowns(except = null) {

    document
        .querySelectorAll(".custom-select")
        .forEach(select => {

            if (select !== except) {

                select.classList.remove(
                    "active"
                );

            }

        });

}



function initCustomDropdowns() {

    document
        .querySelectorAll(".custom-select")
        .forEach(select => {


            const trigger =
                select.querySelector(
                    ".select-trigger"
                );


            const options =
                select.querySelectorAll(
                    ".select-option"
                );


            const hiddenInput =
                select.querySelector(
                    'input[type="hidden"]'
                );


            const selectedText =
                select.querySelector(
                    ".selected-text"
                );


            const triggerIcon =
                select.querySelector(
                    ".trigger-icon"
                );


            if (!trigger || !hiddenInput) {

                return;

            }



            // OPEN / CLOSE DROPDOWN

            trigger.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();


                    const wasActive =
                        select.classList.contains(
                            "active"
                        );


                    closeAllDropdowns(
                        select
                    );


                    if (!wasActive) {

                        select.classList.add(
                            "active"
                        );

                    }

                }
            );



            // OPTION CLICK

            options.forEach(option => {


                option.addEventListener(
                    "click",
                    function(event) {

                        event.stopPropagation();


                        const value =
                            option.dataset.value;


                        const textElement =
                            option.querySelector(
                                "span:last-child"
                            );


                        const text =
                            textElement
                                ? textElement.innerText.trim()
                                : option.innerText.trim();



                        // SAVE VALUE

                        hiddenInput.value =
                            value;



                        // UPDATE VISIBLE TEXT

                        if (
                            select.dataset.name
                            === "loan_grade"
                        ) {

                            selectedText.textContent =
                                value;

                        }

                        else {

                            selectedText.textContent =
                                text;

                        }



                        // UPDATE ICON

                        const optionIcon =
                            option.querySelector(
                                ".option-icon, .grade-badge, .check-icon, .empty-check"
                            );


                        if (
                            optionIcon &&
                            triggerIcon
                        ) {


                            if (
                                select.dataset.name
                                === "loan_grade"
                            ) {

                                triggerIcon.textContent =
                                    value;

                            }

                            else if (
                                select.dataset.name
                                === "cb_person_default_on_file"
                            ) {

                                triggerIcon.textContent =
                                    value === "Y"
                                        ? "✓"
                                        : "○";

                            }

                            else {

                                triggerIcon.textContent =
                                    optionIcon
                                        .innerText
                                        .trim()
                                    || "•";

                            }

                        }



                        // SELECTED STATE

                        options.forEach(
                            item =>
                                item.classList.remove(
                                    "selected"
                                )
                        );


                        option.classList.add(
                            "selected"
                        );



                        // CLOSE

                        select.classList.remove(
                            "active"
                        );


                        hiddenInput.setCustomValidity(
                            ""
                        );

                    }
                );

            });

        });

}



// INITIALIZE

initCustomDropdowns();



// CLOSE WHEN CLICKING OUTSIDE

document.addEventListener(
    "click",
    function() {

        closeAllDropdowns();

    }
);



// =========================================================
// STEP NAVIGATION
// =========================================================


function showStep(step) {

    closeAllDropdowns();


    steps.forEach(element => {


        element.classList.remove(
            "active"
        );


        if (
            Number(
                element.dataset.step
            ) === step
        ) {

            element.classList.add(
                "active"
            );

        }

    });


    currentStepText.textContent =
        step;

}



function validateCurrentStep() {


    const current =
        document.querySelector(
            `.form-step[data-step="${currentStep}"]`
        );


    const inputs =
        current.querySelectorAll(
            "input, select"
        );


    for (
        const input of inputs
    ) {


        if (!input.checkValidity()) {


            // CUSTOM DROPDOWN

            if (
                input.type === "hidden"
            ) {


                const customSelect =
                    input.closest(
                        ".custom-select"
                    );


                if (customSelect) {


                    customSelect.classList.add(
                        "validation-error"
                    );


                    setTimeout(
                        () => {

                            customSelect.classList.remove(
                                "validation-error"
                            );

                        },
                        900
                    );


                    customSelect
                        .querySelector(
                            ".select-trigger"
                        )
                        ?.click();

                }

            }


            else {

                input.reportValidity();

            }


            return false;

        }

    }


    return true;

}



function nextStep() {


    if (
        !validateCurrentStep()
    ) {

        return;

    }


    if (
        currentStep < 3
    ) {

        currentStep++;

        showStep(
            currentStep
        );

    }

}



function previousStep() {


    if (
        currentStep > 1
    ) {

        currentStep--;

        showStep(
            currentStep
        );

    }

}



// =========================================================
// FORM SUBMISSION
// =========================================================


document
    .getElementById("loanForm")
    .addEventListener(
        "submit",
        async function(event) {


            event.preventDefault();



            if (
                !validateCurrentStep()
            ) {

                return;

            }



            const predictButton =
                document.getElementById(
                    "predictBtn"
                );



            predictButton.disabled =
                true;



            predictButton.innerHTML = `

                <span>
                    Analyzing...
                </span>

                <span
                    class="loader-small"
                ></span>

            `;



            // HIDE INITIAL

            document
                .getElementById(
                    "initialResult"
                )
                .classList.add(
                    "hidden"
                );



            // SHOW LOADING

            document
                .getElementById(
                    "loadingResult"
                )
                .classList.remove(
                    "hidden"
                );



            document
                .getElementById(
                    "predictionResult"
                )
                .classList.add(
                    "hidden"
                );



            // =================================================
            // COLLECT FORM DATA
            // =================================================


            const data = {


                person_age:

                    Number(
                        document.getElementById(
                            "person_age"
                        ).value
                    ),



                person_income:

                    Number(
                        document.getElementById(
                            "person_income"
                        ).value
                    ),



                person_home_ownership:

                    document.getElementById(
                        "person_home_ownership"
                    ).value,



                person_emp_length:

                    Number(
                        document.getElementById(
                            "person_emp_length"
                        ).value
                    ),



                loan_intent:

                    document.getElementById(
                        "loan_intent"
                    ).value,



                loan_grade:

                    document.getElementById(
                        "loan_grade"
                    ).value,



                loan_amnt:

                    Number(
                        document.getElementById(
                            "loan_amnt"
                        ).value
                    ),



                loan_int_rate:

                    Number(
                        document.getElementById(
                            "loan_int_rate"
                        ).value
                    ),



                loan_percent_income:

                    Number(
                        document.getElementById(
                            "loan_percent_income"
                        ).value
                    ),



                cb_person_default_on_file:

                    document.getElementById(
                        "cb_person_default_on_file"
                    ).value,



                cb_person_cred_hist_length:

                    Number(
                        document.getElementById(
                            "cb_person_cred_hist_length"
                        ).value
                    )

            };



            try {


                // =================================================
                // API REQUEST
                // =================================================


                const response =
                    await fetch(
                        "/predict",
                        {

                            method: "POST",


                            headers: {

                                "Content-Type":
                                    "application/json"

                            },


                            body:
                                JSON.stringify(
                                    data
                                )

                        }
                    );



                if (
                    !response.ok
                ) {

                    throw new Error(
                        `API Error: ${response.status}`
                    );

                }



                const result =
                    await response.json();



                // Small delay

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            700
                        )
                );



                showPrediction(
                    result
                );


            }


            catch (error) {


                console.error(
                    error
                );


                showError();


            }


            finally {


                predictButton.disabled =
                    false;


                predictButton.innerHTML = `

                    <span>
                        Analyze Risk
                    </span>

                    <span class="arrow">
                        →
                    </span>

                `;

            }

        }
    );



// =========================================================
// SHOW RESULT
// =========================================================


function showPrediction(result) {


    document
        .getElementById(
            "loadingResult"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "predictionResult"
        )
        .classList.remove(
            "hidden"
        );



    const probability =
        Number(
            result.default_probability
        );


    const percentage =
        probability * 100;


    const prediction =
        Number(
            result.default_prediction
        );



    const riskIcon =
        document.getElementById(
            "riskIcon"
        );


    const riskLabel =
        document.getElementById(
            "riskLabel"
        );


    const probabilityValue =
        document.getElementById(
            "probabilityValue"
        );


    const meterFill =
        document.getElementById(
            "meterFill"
        );


    const decision =
        document.getElementById(
            "decision"
        );


    const threshold =
        document.getElementById(
            "threshold"
        );



    // =================================================
    // RISK STATE
    // =================================================


    if (
        prediction === 1
    ) {


        riskIcon.className =
            "risk-icon high";


        riskIcon.textContent =
            "!";


        riskLabel.textContent =
            "HIGH RISK";


        decision.textContent =
            "High Risk";

    }


    else {


        riskIcon.className =
            "risk-icon low";


        riskIcon.textContent =
            "✓";


        riskLabel.textContent =
            "LOW RISK";


        decision.textContent =
            "Low Risk";

    }



    // =================================================
    // THRESHOLD
    // =================================================


    threshold.textContent =

        Number(
            result.threshold
        ).toFixed(3);



    // =================================================
    // PROBABILITY ANIMATION
    // =================================================


    animateNumber(
        probabilityValue,
        0,
        percentage,
        1200
    );



    // =================================================
    // METER
    // =================================================


    setTimeout(
        () => {


            meterFill.style.width =

                `${Math.min(
                    percentage,
                    100
                )}%`;


        },
        100
    );

}



// =========================================================
// NUMBER ANIMATION
// =========================================================


function animateNumber(
    element,
    start,
    end,
    duration
) {


    const startTime =
        performance.now();



    function update(
        currentTime
    ) {


        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed /
                    duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 -
                    progress,
                3
            );


        const value =

            start +
            (
                end -
                start
            ) *
            eased;



        element.textContent =

            value.toFixed(1) +
            "%";



        if (
            progress < 1
        ) {

            requestAnimationFrame(
                update
            );

        }

    }


    requestAnimationFrame(
        update
    );

}



// =========================================================
// ERROR
// =========================================================


function showError() {


    document
        .getElementById(
            "loadingResult"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "predictionResult"
        )
        .classList.remove(
            "hidden"
        );



    document
        .getElementById(
            "riskIcon"
        )
        .className =
            "risk-icon high";


    document
        .getElementById(
            "riskIcon"
        )
        .textContent =
            "!";


    document
        .getElementById(
            "riskLabel"
        )
        .textContent =
            "API ERROR";


    document
        .getElementById(
            "probabilityValue"
        )
        .textContent =
            "—";


    document
        .getElementById(
            "decision"
        )
        .textContent =
            "Unable to analyze";


    document
        .getElementById(
            "threshold"
        )
        .textContent =
            "—";


    document
        .getElementById(
            "meterFill"
        )
        .style.width =
            "0%";

}



// =========================================================
// RESET
// =========================================================


function resetPrediction() {


    document
        .getElementById(
            "predictionResult"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "initialResult"
        )
        .classList.remove(
            "hidden"
        );


    document
        .getElementById(
            "loanForm"
        )
        .reset();



    // RESET CUSTOM DROPDOWNS


    document
        .querySelectorAll(
            ".custom-select"
        )
        .forEach(
            select => {


                select.classList.remove(
                    "active"
                );


                const hiddenInput =
                    select.querySelector(
                        'input[type="hidden"]'
                    );


                const selectedText =
                    select.querySelector(
                        ".selected-text"
                    );


                const triggerIcon =
                    select.querySelector(
                        ".trigger-icon"
                    );



                if (
                    hiddenInput
                ) {

                    hiddenInput.value =
                        "";

                }



                if (
                    selectedText
                ) {


                    if (
                        select.dataset.name
                        === "person_home_ownership"
                    ) {

                        selectedText.textContent =
                            "Select ownership";

                    }


                    else if (
                        select.dataset.name
                        === "loan_intent"
                    ) {

                        selectedText.textContent =
                            "Select purpose";

                    }


                    else if (
                        select.dataset.name
                        === "loan_grade"
                    ) {

                        selectedText.textContent =
                            "Select grade";

                    }


                    else {

                        selectedText.textContent =
                            "Select";

                    }

                }



                if (
                    triggerIcon
                ) {


                    if (
                        select.dataset.name
                        === "person_home_ownership"
                    ) {

                        triggerIcon.textContent =
                            "⌂";

                    }


                    else if (
                        select.dataset.name
                        === "loan_intent"
                    ) {

                        triggerIcon.textContent =
                            "◉";

                    }


                    else if (
                        select.dataset.name
                        === "loan_grade"
                    ) {

                        triggerIcon.textContent =
                            "★";

                    }


                    else {

                        triggerIcon.textContent =
                            "⚠";

                    }

                }



                select
                    .querySelectorAll(
                        ".select-option"
                    )
                    .forEach(
                        option =>
                            option.classList.remove(
                                "selected"
                            )
                    );

            }
        );



    currentStep =
        1;


    showStep(
        1
    );

}



// =========================================================
// INITIAL STATE
// =========================================================


showStep(1);