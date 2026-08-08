/* =========================================================
   🎓 HTML MASTER ACADEMY - FINAL EXAM SYSTEM
   File: exam.js

   مسؤول عن:
   ✅ تصحيح الامتحان النهائي
   ✅ حساب الدرجة والنسبة
   ✅ إظهار النتيجة
   ✅ تحديد النجاح والرسوب
   ✅ حفظ أفضل نتيجة
   ✅ منع تكرار التصحيح أثناء نفس المحاولة
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       🔑 مفاتيح التخزين
       ===================================================== */

    const EXAM_RESULT_KEY =
        "html_master_final_exam";


    /* =====================================================
       📦 قراءة البيانات
       ===================================================== */

    function getResult() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    EXAM_RESULT_KEY
                )
            );

        } catch (error) {

            console.error(
                "حدث خطأ أثناء قراءة نتيجة الامتحان:",
                error
            );

            return null;
        }
    }


    /* =====================================================
       💾 حفظ النتيجة
       ===================================================== */

    function saveResult(result) {

        const oldResult =
            getResult();


        /*
         * نحفظ أفضل نتيجة فقط
         */

        if (
            !oldResult ||
            result.percentage >
            oldResult.percentage
        ) {

            localStorage.setItem(
                EXAM_RESULT_KEY,
                JSON.stringify(result)
            );
        }
    }


    /* =====================================================
       📝 الحصول على الأسئلة
       ===================================================== */

    function getQuestions() {

        return Array.from(
            document.querySelectorAll(
                ".question-card"
            )
        );
    }


    /* =====================================================
       🎯 تصحيح الامتحان
       ===================================================== */

    function checkExam() {

        const questions =
            getQuestions();


        if (questions.length === 0) {

            showMessage(
                "⚠️ لم يتم العثور على أسئلة الامتحان.",
                "error"
            );

            return;
        }


        let score = 0;

        let answered = 0;


        /* ================================================
           تصحيح الأسئلة
           ================================================= */

        questions.forEach(
            function (question) {

                question.classList.remove(
                    "correct-answer",
                    "wrong-answer",
                    "unanswered"
                );


                const selected =
                    question.querySelector(
                        'input[type="radio"]:checked'
                    );


                /*
                 * السؤال بدون إجابة
                 */

                if (!selected) {

                    question.classList.add(
                        "unanswered"
                    );

                    return;
                }


                answered++;


                /*
                 * الإجابة الصحيحة
                 */

                if (
                    selected.value ===
                    "correct"
                ) {

                    score++;

                    question.classList.add(
                        "correct-answer"
                    );

                } else {

                    question.classList.add(
                        "wrong-answer"
                    );
                }

            }
        );


        const total =
            questions.length;


        const wrong =
            answered - score;


        const unanswered =
            total - answered;


        const percentage =
            Math.round(
                (score / total) * 100
            );


        /*
         * نسبة النجاح
         */

        const PASS_PERCENTAGE = 70;


        const passed =
            percentage >= PASS_PERCENTAGE;


        /*
         * حفظ النتيجة
         */

        const result = {

            score:
                score,

            total:
                total,

            wrong:
                wrong,

            unanswered:
                unanswered,

            percentage:
                percentage,

            passed:
                passed,

            date:
                new Date().toISOString()

        };


        saveResult(result);


        /*
         * عرض النتيجة
         */

        showExamResult(result);


        /*
         * إرسال النتيجة إلى نظام المتصدرين
         */

        updateLeaderboard(result);
    }


    /* =====================================================
       🏆 عرض النتيجة
       ===================================================== */

    function showExamResult(result) {

        const resultBox =
            document.getElementById(
                "examResult"
            ) ||
            document.getElementById(
                "quizResult"
            );


        if (!resultBox) {

            console.warn(
                "لم يتم العثور على صندوق نتيجة الامتحان."
            );

            return;
        }


        let message = "";

        let icon = "";


        if (result.percentage === 100) {

            icon = "🏆";

            message =
                "مذهل! حصلت على الدرجة النهائية!";

        } else if (result.passed) {

            icon = "🎉";

            message =
                "مبروك! لقد اجتزت الامتحان بنجاح.";

        } else {

            icon = "📚";

            message =
                "لم تنجح هذه المرة، راجع الدروس وحاول مرة أخرى.";
        }


        resultBox.innerHTML = `

            <div class="exam-result-content">

                <div class="exam-result-icon">
                    ${icon}
                </div>

                <h2>
                    نتيجة الامتحان النهائي
                </h2>

                <div class="exam-score">
                    ${result.score}
                    /
                    ${result.total}
                </div>

                <p>
                    🎯 النسبة:
                    <strong>
                        ${result.percentage}%
                    </strong>
                </p>

                <p>
                    ✅ إجابات صحيحة:
                    <strong>
                        ${result.score}
                    </strong>
                </p>

                <p>
                    ❌ إجابات خاطئة:
                    <strong>
                        ${result.wrong}
                    </strong>
                </p>

                <p>
                    ⚪ بدون إجابة:
                    <strong>
                        ${result.unanswered}
                    </strong>
                </p>

                <p class="exam-message">
                    ${message}
                </p>

                ${
                    result.passed
                    ? `
                        <div class="exam-success">
                            🎓 مبروك! أكملت الامتحان النهائي.
                        </div>
                    `
                    : `
                        <div class="exam-failed">
                            💪 لا تستسلم، ارجع راجع الدروس وحاول مرة أخرى.
                        </div>
                    `
                }

            </div>

        `;


        resultBox.style.display =
            "block";


        resultBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    /* =====================================================
       🔄 إعادة الامتحان
       ===================================================== */

    function resetExam() {

        const questions =
            getQuestions();


        questions.forEach(
            function (question) {

                const inputs =
                    question.querySelectorAll(
                        'input[type="radio"]'
                    );


                inputs.forEach(
                    function (input) {

                        input.checked =
                            false;

                    }
                );


                question.classList.remove(
                    "correct-answer",
                    "wrong-answer",
                    "unanswered"
                );

            }
        );


        const resultBox =
            document.getElementById(
                "examResult"
            ) ||
            document.getElementById(
                "quizResult"
            );


        if (resultBox) {

            resultBox.style.display =
                "none";

            resultBox.innerHTML =
                "";
        }


        /*
         * العودة لأول سؤال
         */

        if (questions.length > 0) {

            questions[0].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }


    /* =====================================================
       💬 رسالة عامة
       ===================================================== */

    function showMessage(
        message,
        type
    ) {

        const box =
            document.getElementById(
                "examResult"
            );


        if (!box) {

            return;
        }


        box.innerHTML = `
            <div class="exam-message ${type}">
                ${message}
            </div>
        `;


        box.style.display =
            "block";
    }


    /* =====================================================
       🏆 تحديث لوحة المتصدرين
       ===================================================== */

    function updateLeaderboard(result) {

        let leaderboard = [];


        try {

            leaderboard =
                JSON.parse(
                    localStorage.getItem(
                        "html_master_leaderboard"
                    )
                ) || [];

        } catch (error) {

            leaderboard = [];
        }


        /*
         * الحصول على المستخدم الحالي
         */

        let user = null;


        try {

            user =
                JSON.parse(
                    localStorage.getItem(
                        "html_master_current_user"
                    )
                );

        } catch (error) {

            user = null;
        }


        const userName =
            user && user.name
                ? user.name
                : "طالب HTML";


        const userEmail =
            user && user.email
                ? user.email
                : "";


        /*
         * البحث عن المستخدم
         */

        const existingIndex =
            leaderboard.findIndex(
                function (item) {

                    if (
                        userEmail &&
                        item.email
                    ) {

                        return (
                            item.email ===
                            userEmail
                        );
                    }

                    return (
                        item.name ===
                        userName
                    );
                }
            );


        const entry = {

            name:
                userName,

            email:
                userEmail,

            score:
                result.score,

            total:
                result.total,

            percentage:
                result.percentage,

            passed:
                result.passed,

            date:
                result.date
        };


        /*
         * تحديث أفضل نتيجة
         */

        if (existingIndex !== -1) {

            const old =
                leaderboard[
                    existingIndex
                ];


            if (
                result.percentage >
                Number(
                    old.percentage || 0
                )
            ) {

                leaderboard[
                    existingIndex
                ] = entry;
            }

        } else {

            leaderboard.push(entry);
        }


        /*
         * ترتيب المتصدرين
         */

        leaderboard.sort(
            function (a, b) {

                return (
                    Number(
                        b.percentage || 0
                    ) -
                    Number(
                        a.percentage || 0
                    )
                );
            }
        );


        /*
         * الاحتفاظ بأفضل 100 طالب
         */

        leaderboard =
            leaderboard.slice(
                0,
                100
            );


        localStorage.setItem(
            "html_master_leaderboard",
            JSON.stringify(
                leaderboard
            )
        );
    }


    /* =====================================================
       🔘 ربط الأزرار
       ===================================================== */

    function setupButtons() {

        const checkButton =
            document.getElementById(
                "checkExam"
            );


        const resetButton =
            document.getElementById(
                "resetExam"
            );


        if (checkButton) {

            checkButton.addEventListener(
                "click",
                checkExam
            );
        }


        if (resetButton) {

            resetButton.addEventListener(
                "click",
                resetExam
            );
        }
    }


    /* =====================================================
       🌍 إتاحة النظام لباقي الملفات
       ===================================================== */

    window.HTMLMasterExam = {

        check:
            checkExam,

        reset:
            resetExam,

        getResult:
            getResult,

        getLeaderboard:
            function () {

                try {

                    return JSON.parse(
                        localStorage.getItem(
                            "html_master_leaderboard"
                        )
                    ) || [];

                } catch (error) {

                    return [];
                }
            }

    };


    /* =====================================================
       🚀 تشغيل النظام
       ===================================================== */

    function initExam() {

        setupButtons();
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initExam
        );

    } else {

        initExam();
    }


})();