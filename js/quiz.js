/* =========================================================
   📝 HTML MASTER ACADEMY - QUIZ SYSTEM
   File: quiz.js

   المسؤول عن:
   ✅ تصحيح اختبارات الدروس
   ✅ حساب الدرجة والنسبة
   ✅ إظهار الإجابات الصحيحة والخاطئة
   ✅ حفظ نتيجة كل درس
   ✅ حفظ أفضل نتيجة
   ✅ حفظ تقدم الطالب
   ✅ إعادة الاختبار
   ✅ دعم جميع الدروس
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       🔑 مفاتيح LocalStorage
       ===================================================== */

    const QUIZ_RESULTS_KEY =
        "html_master_quiz_results";

    const LESSON_PROGRESS_KEY =
        "html_master_lesson_progress";


    /* =====================================================
       📦 قراءة بيانات محفوظة
       ===================================================== */

    function getStoredData(key, defaultValue) {

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(key)
                );

            return data !== null
                ? data
                : defaultValue;

        } catch (error) {

            console.error(
                "خطأ في قراءة البيانات:",
                error
            );

            return defaultValue;
        }
    }


    /* =====================================================
       💾 حفظ بيانات
       ===================================================== */

    function saveData(key, data) {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );
    }


    /* =====================================================
       🔢 معرفة رقم الدرس
       ===================================================== */

    function getLessonNumber() {

        /*
         * الطريقة الأولى:
         * data-lesson="1"
         */

        const page =
            document.querySelector(
                "[data-lesson]"
            );

        if (page) {

            const number =
                parseInt(
                    page.dataset.lesson,
                    10
                );

            if (!isNaN(number)) {

                return number;
            }
        }


        /*
         * الطريقة الثانية:
         * lesson1.html
         * lesson2.html
         */

        const fileName =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        const match =
            fileName.match(
                /lesson[-_]?(\d+)/
            );


        if (match) {

            return parseInt(
                match[1],
                10
            );
        }


        /*
         * لو لم نجد رقم الدرس
         */

        return 1;
    }


    /* =====================================================
       📝 الحصول على أسئلة الاختبار
       ===================================================== */

    function getQuestions() {

        return Array.from(
            document.querySelectorAll(
                ".question-card"
            )
        );
    }


    /* =====================================================
       🎯 تصحيح الاختبار
       ===================================================== */

    function checkQuiz() {

        const questions =
            getQuestions();


        if (questions.length === 0) {

            console.warn(
                "لم يتم العثور على أسئلة الاختبار."
            );

            return;
        }


        let score = 0;

        let answered = 0;


        /*
         * تصحيح كل سؤال
         */

        questions.forEach(
            function (question) {

                /*
                 * إزالة النتائج القديمة
                 */

                question.classList.remove(
                    "correct-answer",
                    "wrong-answer",
                    "unanswered"
                );


                /*
                 * البحث عن الإجابة المختارة
                 */

                const selected =
                    question.querySelector(
                        'input[type="radio"]:checked'
                    );


                /*
                 * لا توجد إجابة
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
                 * تكون value="correct"
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
         * حفظ النتيجة
         */

        saveQuizResult(
            score,
            total,
            percentage
        );


        /*
         * إظهار النتيجة
         */

        showQuizResult(
            score,
            total,
            wrong,
            unanswered,
            percentage
        );


        /*
         * حفظ التقدم
         */

        saveLessonProgress(
            percentage
        );
    }


    /* =====================================================
       💾 حفظ نتيجة الاختبار
       ===================================================== */

    function saveQuizResult(
        score,
        total,
        percentage
    ) {

        const lessonNumber =
            getLessonNumber();


        const results =
            getStoredData(
                QUIZ_RESULTS_KEY,
                {}
            );


        const oldResult =
            results[lessonNumber];


        /*
         * نحفظ أفضل نتيجة فقط
         */

        if (
            !oldResult ||
            percentage > oldResult.percentage
        ) {

            results[lessonNumber] = {

                lesson:
                    lessonNumber,

                score:
                    score,

                total:
                    total,

                percentage:
                    percentage,

                date:
                    new Date().toISOString()
            };


            saveData(
                QUIZ_RESULTS_KEY,
                results
            );
        }
    }


    /* =====================================================
       📈 حفظ تقدم الدرس
       ===================================================== */

    function saveLessonProgress(
        percentage
    ) {

        const lessonNumber =
            getLessonNumber();


        const progress =
            getStoredData(
                LESSON_PROGRESS_KEY,
                {}
            );


        const oldProgress =
            Number(
                progress[lessonNumber] || 0
            );


        /*
         * لا ننقص التقدم القديم
         */

        if (
            percentage > oldProgress
        ) {

            progress[lessonNumber] =
                percentage;

            saveData(
                LESSON_PROGRESS_KEY,
                progress
            );
        }


        /*
         * لو الدرجة 70% أو أكثر
         * نعتبر الدرس مكتملًا.
         */

        if (percentage >= 70) {

            markLessonComplete();
        }
    }


    /* =====================================================
       🏁 إنهاء الدرس
       ===================================================== */

    function markLessonComplete() {

        const lessonNumber =
            getLessonNumber();


        const completed =
            getStoredData(
                "html_master_completed_lessons",
                []
            );


        if (
            !completed.includes(
                lessonNumber
            )
        ) {

            completed.push(
                lessonNumber
            );

            completed.sort(
                function (a, b) {
                    return a - b;
                }
            );

            saveData(
                "html_master_completed_lessons",
                completed
            );
        }
    }


    /* =====================================================
       📊 إظهار نتيجة الاختبار
       ===================================================== */

    function showQuizResult(
        score,
        total,
        wrong,
        unanswered,
        percentage
    ) {

        const resultBox =
            document.getElementById(
                "quizResult"
            );


        if (!resultBox) {

            console.warn(
                "لم يتم العثور على #quizResult"
            );

            return;
        }


        let message = "";


        if (percentage === 100) {

            message =
                "🏆 ممتاز جدًا! إجابة كاملة!";

        } else if (percentage >= 80) {

            message =
                "🎉 أحسنت! مستواك رائع.";

        } else if (percentage >= 70) {

            message =
                "👏 ممتاز! يمكنك الانتقال للدرس التالي.";

        } else if (percentage >= 50) {

            message =
                "💪 جيد، لكن أنصحك بمراجعة الدرس.";

        } else {

            message =
                "📚 محتاج تراجع الدرس مرة أخرى.";
        }


        resultBox.innerHTML = `

            <div class="quiz-result-content">

                <h2>
                    📊 نتيجة الاختبار
                </h2>

                <div class="quiz-score">

                    ${score}
                    /
                    ${total}

                </div>

                <p>
                    🎯 النسبة:
                    <strong>${percentage}%</strong>
                </p>

                <p>
                    ✅ إجابات صحيحة:
                    <strong>${score}</strong>
                </p>

                <p>
                    ❌ إجابات خاطئة:
                    <strong>${wrong}</strong>
                </p>

                <p>
                    ⚪ بدون إجابة:
                    <strong>${unanswered}</strong>
                </p>

                <p class="quiz-message">
                    ${message}
                </p>

            </div>

        `;


        resultBox.style.display =
            "block";


        /*
         * الانتقال للنتيجة
         */

        resultBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    /* =====================================================
       🔄 إعادة الاختبار
       ===================================================== */

    function resetQuiz() {

        const questions =
            getQuestions();


        questions.forEach(
            function (question) {

                /*
                 * إزالة تحديد الإجابات
                 */

                const radios =
                    question.querySelectorAll(
                        'input[type="radio"]'
                    );


                radios.forEach(
                    function (radio) {

                        radio.checked =
                            false;
                    }
                );


                /*
                 * إزالة ألوان التصحيح
                 */

                question.classList.remove(
                    "correct-answer",
                    "wrong-answer",
                    "unanswered"
                );

            }
        );


        /*
         * إخفاء النتيجة
         */

        const resultBox =
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
       🎯 زر إنهاء الدرس
       ===================================================== */

    function setupCompleteLesson() {

        const buttons =
            document.querySelectorAll(
                "[data-complete-lesson]"
            );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        markLessonComplete();


                        button.textContent =
                            "✅ تم إنهاء الدرس";


                        button.disabled =
                            true;


                        button.classList.add(
                            "completed"
                        );
                    }
                );

            }
        );
    }


    /* =====================================================
       🔘 ربط أزرار الاختبار
       ===================================================== */

    function setupQuizButtons() {

        const checkButton =
            document.getElementById(
                "checkQuiz"
            );


        const resetButton =
            document.getElementById(
                "resetQuiz"
            );


        if (checkButton) {

            checkButton.addEventListener(
                "click",
                checkQuiz
            );
        }


        if (resetButton) {

            resetButton.addEventListener(
                "click",
                resetQuiz
            );
        }
    }


    /* =====================================================
       🚀 تشغيل النظام
       ===================================================== */

    function initQuiz() {

        setupQuizButtons();

        setupCompleteLesson();
    }


    /* =====================================================
       🌍 إتاحة الوظائف لباقي الموقع
       ===================================================== */

    window.HTMLMasterQuiz = {

        check:
            checkQuiz,

        reset:
            resetQuiz,

        getLessonNumber:
            getLessonNumber,

        getResults:
            function () {

                return getStoredData(
                    QUIZ_RESULTS_KEY,
                    {}
                );

            },

        getProgress:
            function () {

                return getStoredData(
                    LESSON_PROGRESS_KEY,
                    {}
                );

            },

        markComplete:
            markLessonComplete
    };


    /* =====================================================
       ▶️ START
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initQuiz
        );

    } else {

        initQuiz();
    }


})();