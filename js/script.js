/* =========================================================
   🚀 HTML MASTER ACADEMY - MAIN JAVASCRIPT
   File: script.js

   المسؤول عن:
   🌙 Dark / Light Mode
   📋 Copy Code
   📊 Progress Bar
   🎬 Animations
   🔘 الأزرار والتأثيرات
   💾 حفظ تقدم الدروس
   📱 تحسين تجربة الموقع
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       🔑 مفاتيح LocalStorage
       ===================================================== */

    const THEME_KEY =
        "html_master_theme";

    const PROGRESS_KEY =
        "html_master_lesson_progress";

    const COMPLETED_KEY =
        "html_master_completed_lessons";


    /* =====================================================
       🌙 الوضع الليلي والصباحي
       ===================================================== */

    function setupTheme() {

        const toggleButtons =
            document.querySelectorAll(
                "#themeToggle, [data-theme-toggle]"
            );


        /*
         * قراءة الوضع المحفوظ
         */

        const savedTheme =
            localStorage.getItem(
                THEME_KEY
            );


        if (
            savedTheme ===
            "light"
        ) {

            document.body.classList.add(
                "light-mode"
            );

        } else {

            document.body.classList.remove(
                "light-mode"
            );
        }


        updateThemeButtons();


        /*
         * ربط جميع أزرار الوضع
         */

        toggleButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    toggleTheme
                );

            }
        );
    }


    /* =====================================================
       🔄 تبديل الوضع
       ===================================================== */

    function toggleTheme() {

        const isLight =
            document.body.classList.toggle(
                "light-mode"
            );


        localStorage.setItem(
            THEME_KEY,
            isLight
                ? "light"
                : "dark"
        );


        updateThemeButtons();
    }


    /* =====================================================
       📝 تحديث نص زر الوضع
       ===================================================== */

    function updateThemeButtons() {

        const isLight =
            document.body.classList.contains(
                "light-mode"
            );


        const buttons =
            document.querySelectorAll(
                "#themeToggle, [data-theme-toggle]"
            );


        buttons.forEach(
            function (button) {

                button.textContent =
                    isLight
                        ? "🌙 الوضع الليلي"
                        : "☀️ الوضع الصباحي";

                button.setAttribute(
                    "aria-label",
                    isLight
                        ? "تفعيل الوضع الليلي"
                        : "تفعيل الوضع الصباحي"
                );

            }
        );
    }


    /* =====================================================
       📋 نسخ الأكواد
       ===================================================== */

    function setupCopyButtons() {

        const buttons =
            document.querySelectorAll(
                "[data-copy-code], .copy-code-btn, .copy-btn"
            );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        copyCodeFromButton(
                            button
                        );

                    }
                );

            }
        );
    }


    /* =====================================================
       📋 تحديد الكود المراد نسخه
       ===================================================== */

    async function copyCodeFromButton(
        button
    ) {

        let code = "";


        /*
         * الطريقة الأولى:
         * data-copy-code="#code1"
         */

        const selector =
            button.getAttribute(
                "data-copy-code"
            );


        if (selector) {

            const target =
                document.querySelector(
                    selector
                );


            if (target) {

                code =
                    target.innerText ||
                    target.textContent ||
                    "";

            }
        }


        /*
         * الطريقة الثانية:
         * الزر موجود بجوار code/pre
         */

        if (!code) {

            const parent =
                button.closest(
                    ".code-container, .code-box, .code-card, .card"
                );


            if (parent) {

                const codeElement =
                    parent.querySelector(
                        "pre code, pre, code"
                    );


                if (codeElement) {

                    code =
                        codeElement.innerText ||
                        codeElement.textContent ||
                        "";
                }
            }
        }


        /*
         * الطريقة الثالثة:
         * data-code="..."
         */

        if (!code) {

            code =
                button.getAttribute(
                    "data-code"
                ) ||
                "";
        }


        if (!code.trim()) {

            showToast(
                "⚠️ لم يتم العثور على الكود.",
                "error"
            );

            return;
        }


        try {

            await navigator.clipboard.writeText(
                code
            );


            const oldText =
                button.textContent;


            button.textContent =
                "✅ تم النسخ";


            button.classList.add(
                "copied"
            );


            showToast(
                "✅ تم نسخ الكود بنجاح!",
                "success"
            );


            setTimeout(
                function () {

                    button.textContent =
                        oldText;

                    button.classList.remove(
                        "copied"
                    );

                },
                1800
            );


        } catch (error) {

            /*
             * طريقة احتياطية
             */

            fallbackCopy(
                code,
                button
            );
        }
    }


    /* =====================================================
       📋 طريقة النسخ الاحتياطية
       ===================================================== */

    function fallbackCopy(
        text,
        button
    ) {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            text;


        textarea.style.position =
            "fixed";

        textarea.style.opacity =
            "0";


        document.body.appendChild(
            textarea
        );


        textarea.select();


        try {

            document.execCommand(
                "copy"
            );


            button.textContent =
                "✅ تم النسخ";


            showToast(
                "✅ تم نسخ الكود بنجاح!",
                "success"
            );


        } catch (error) {

            showToast(
                "❌ لم يتم نسخ الكود.",
                "error"
            );

        }


        document.body.removeChild(
            textarea
        );
    }


    /* =====================================================
       📊 شريط التقدم
       ===================================================== */

    function setupProgress() {

        const progressBars =
            document.querySelectorAll(
                "[data-progress]"
            );


        progressBars.forEach(
            function (bar) {

                let value =
                    parseInt(
                        bar.getAttribute(
                            "data-progress"
                        ),
                        10
                    );


                if (
                    isNaN(value)
                ) {

                    value = 0;
                }


                value =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            value
                        )
                    );


                animateProgress(
                    bar,
                    value
                );
            }
        );


        /*
         * شريط يعتمد على نسبة
         * progress داخل الصفحة
         */

        const dynamicBars =
            document.querySelectorAll(
                ".progress-fill[data-lesson-progress]"
            );


        dynamicBars.forEach(
            function (bar) {

                const lesson =
                    parseInt(
                        bar.getAttribute(
                            "data-lesson-progress"
                        ),
                        10
                    );


                const progress =
                    getLessonProgress(
                        lesson
                    );


                animateProgress(
                    bar,
                    progress
                );
            }
        );
    }


    /* =====================================================
       🎞️ تحريك شريط التقدم
       ===================================================== */

    function animateProgress(
        bar,
        value
    ) {

        requestAnimationFrame(
            function () {

                bar.style.width =
                    value + "%";

                bar.setAttribute(
                    "aria-valuenow",
                    value
                );

            }
        );
    }


    /* =====================================================
       📈 معرفة تقدم درس
       ===================================================== */

    function getLessonProgress(
        lessonNumber
    ) {

        try {

            const progress =
                JSON.parse(
                    localStorage.getItem(
                        PROGRESS_KEY
                    )
                ) || {};


            return Number(
                progress[lessonNumber] || 0
            );

        } catch (error) {

            return 0;
        }
    }


    /* =====================================================
       💾 حفظ تقدم درس
       ===================================================== */

    function saveLessonProgress(
        lessonNumber,
        percentage
    ) {

        if (
            !lessonNumber ||
            isNaN(percentage)
        ) {

            return;
        }


        let progress = {};


        try {

            progress =
                JSON.parse(
                    localStorage.getItem(
                        PROGRESS_KEY
                    )
                ) || {};

        } catch (error) {

            progress = {};
        }


        const oldValue =
            Number(
                progress[lessonNumber] || 0
            );


        /*
         * لا ننقص التقدم القديم
         */

        if (
            percentage > oldValue
        ) {

            progress[lessonNumber] =
                Math.min(
                    100,
                    percentage
                );


            localStorage.setItem(
                PROGRESS_KEY,
                JSON.stringify(
                    progress
                )
            );
        }
    }


    /* =====================================================
       🎓 تحديد الدرس الحالي
       ===================================================== */

    function getCurrentLesson() {

        const element =
            document.querySelector(
                "[data-lesson]"
            );


        if (element) {

            const number =
                parseInt(
                    element.dataset.lesson,
                    10
                );


            if (!isNaN(number)) {

                return number;
            }
        }


        const file =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        const match =
            file.match(
                /lesson[-_]?(\d+)/
            );


        if (match) {

            return parseInt(
                match[1],
                10
            );
        }


        return null;
    }


    /* =====================================================
       ✅ حفظ إكمال الدرس
       ===================================================== */

    function setupLessonCompletion() {

        const buttons =
            document.querySelectorAll(
                "[data-complete-lesson]"
            );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const lesson =
                            getCurrentLesson();


                        if (!lesson) {

                            return;
                        }


                        saveLessonProgress(
                            lesson,
                            100
                        );


                        markCompleted(
                            lesson
                        );


                        button.textContent =
                            "✅ تم إكمال الدرس";


                        button.classList.add(
                            "completed"
                        );


                        button.disabled =
                            true;


                        showToast(
                            "🎉 تم حفظ تقدمك!",
                            "success"
                        );

                    }
                );

            }
        );
    }


    /* =====================================================
       🏁 وضع الدرس كمكتمل
       ===================================================== */

    function markCompleted(
        lessonNumber
    ) {

        let completed = [];


        try {

            completed =
                JSON.parse(
                    localStorage.getItem(
                        COMPLETED_KEY
                    )
                ) || [];

        } catch (error) {

            completed = [];
        }


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


            localStorage.setItem(
                COMPLETED_KEY,
                JSON.stringify(
                    completed
                )
            );
        }
    }


    /* =====================================================
       🎬 Animations
       ===================================================== */

    function setupAnimations() {

        const elements =
            document.querySelectorAll(
                ".card, .question-card, .lesson-card, .feature-card, .hero, section"
            );


        if (
            !("IntersectionObserver" in window)
        ) {

            elements.forEach(
                function (element) {

                    element.classList.add(
                        "show-animation"
                    );

                }
            );

            return;
        }


        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "show-animation"
                                );


                                observer.unobserve(
                                    entry.target
                                );
                            }

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        elements.forEach(
            function (element) {

                element.classList.add(
                    "animate-on-scroll"
                );


                observer.observe(
                    element
                );

            }
        );
    }


    /* =====================================================
       ✨ تأثير الأزرار
       ===================================================== */

    function setupButtonEffects() {

        const buttons =
            document.querySelectorAll(
                ".btn, button"
            );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        if (
                            button.disabled
                        ) {

                            return;
                        }


                        /*
                         * تأثير Ripple
                         */

                        const ripple =
                            document.createElement(
                                "span"
                            );


                        ripple.className =
                            "button-ripple";


                        const rect =
                            button.getBoundingClientRect();


                        const x =
                            event.clientX -
                            rect.left;


                        const y =
                            event.clientY -
                            rect.top;


                        ripple.style.left =
                            x + "px";


                        ripple.style.top =
                            y + "px";


                        button.appendChild(
                            ripple
                        );


                        setTimeout(
                            function () {

                                ripple.remove();

                            },
                            600
                        );

                    }
                );

            }
        );
    }


    /* =====================================================
       📱 تحسين القائمة للموبايل
       ===================================================== */

    function setupMobileMenu() {

        const menuButton =
            document.querySelector(
                "[data-menu-toggle]"
            );


        const nav =
            document.querySelector(
                ".nav-links"
            );


        if (
            !menuButton ||
            !nav
        ) {

            return;
        }


        menuButton.addEventListener(
            "click",
            function () {

                nav.classList.toggle(
                    "mobile-open"
                );


                const expanded =
                    nav.classList.contains(
                        "mobile-open"
                    );


                menuButton.setAttribute(
                    "aria-expanded",
                    expanded
                );
            }
        );
    }


    /* =====================================================
       🔝 زر العودة لأعلى
       ===================================================== */

    function setupBackToTop() {

        const button =
            document.querySelector(
                "[data-back-to-top]"
            );


        if (!button) {

            return;
        }


        window.addEventListener(
            "scroll",
            function () {

                if (
                    window.scrollY > 500
                ) {

                    button.classList.add(
                        "show"
                    );

                } else {

                    button.classList.remove(
                        "show"
                    );
                }

            }
        );


        button.addEventListener(
            "click",
            function () {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );
    }


    /* =====================================================
       🔔 Toast Notifications
       ===================================================== */

    function showToast(
        message,
        type = "info"
    ) {

        let container =
            document.getElementById(
                "toastContainer"
            );


        /*
         * إنشاء الحاوية لو غير موجودة
         */

        if (!container) {

            container =
                document.createElement(
                    "div"
                );


            container.id =
                "toastContainer";


            document.body.appendChild(
                container
            );
        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "toast toast-" +
            type;


        toast.textContent =
            message;


        container.appendChild(
            toast
        );


        requestAnimationFrame(
            function () {

                toast.classList.add(
                    "show"
                );

            }
        );


        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );


                setTimeout(
                    function () {

                        toast.remove();

                    },
                    300
                );

            },
            2500
        );
    }


    /* =====================================================
       🔗 تأثير الروابط الداخلية
       ===================================================== */

    function setupSmoothLinks() {

        const links =
            document.querySelectorAll(
                'a[href^="#"]'
            );


        links.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        const id =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !id ||
                            id === "#"
                        ) {

                            return;
                        }


                        const target =
                            document.querySelector(
                                id
                            );


                        if (!target) {

                            return;
                        }


                        event.preventDefault();


                        target.scrollIntoView({

                            behavior:
                                "smooth",

                            block:
                                "start"

                        });

                    }
                );

            }
        );
    }


    /* =====================================================
       🖱️ تأثير حركة الماوس للكروت
       ===================================================== */

    function setupCardHover() {

        const cards =
            document.querySelectorAll(
                ".card, .lesson-card, .feature-card"
            );


        cards.forEach(
            function (card) {

                card.addEventListener(
                    "mousemove",
                    function (event) {

                        const rect =
                            card.getBoundingClientRect();


                        const x =
                            event.clientX -
                            rect.left;


                        const y =
                            event.clientY -
                            rect.top;


                        const centerX =
                            rect.width / 2;


                        const centerY =
                            rect.height / 2;


                        const rotateX =
                            ((y - centerY) /
                                centerY) *
                            -2;


                        const rotateY =
                            ((x - centerX) /
                                centerX) *
                            2;


                        card.style.transform =
                            `perspective(800px)
                             rotateX(${rotateX}deg)
                             rotateY(${rotateY}deg)
                             translateY(-3px)`;
                    }
                );


                card.addEventListener(
                    "mouseleave",
                    function () {

                        card.style.transform =
                            "";

                    }
                );

            }
        );
    }


    /* =====================================================
       🔒 منع إرسال النماذج بالضغط على Enter
       * فقط لو النموذج لا يحتوي على submit
       ===================================================== */

    function setupForms() {

        const forms =
            document.querySelectorAll(
                "form"
            );


        forms.forEach(
            function (form) {

                form.addEventListener(
                    "submit",
                    function () {

                        form.classList.add(
                            "form-submitting"
                        );

                    }
                );

            }
        );
    }


    /* =====================================================
       📊 حساب نسبة تقدم جميع الدروس
       ===================================================== */

    function getOverallProgress() {

        let completed = [];


        try {

            completed =
                JSON.parse(
                    localStorage.getItem(
                        COMPLETED_KEY
                    )
                ) || [];

        } catch (error) {

            completed = [];
        }


        const totalLessons =
            20;


        const completedCount =
            completed.filter(
                function (lesson) {

                    return (
                        lesson >= 1 &&
                        lesson <=
                            totalLessons
                    );

                }
            ).length;


        return Math.round(
            (
                completedCount /
                totalLessons
            ) * 100
        );
    }


    /* =====================================================
       📊 تحديث شريط التقدم العام
       ===================================================== */

    function updateOverallProgress() {

        const progress =
            getOverallProgress();


        const bars =
            document.querySelectorAll(
                "[data-overall-progress]"
            );


        bars.forEach(
            function (bar) {

                bar.style.width =
                    progress + "%";


                bar.setAttribute(
                    "aria-valuenow",
                    progress
                );

            }
        );


        const texts =
            document.querySelectorAll(
                "[data-overall-progress-text]"
            );


        texts.forEach(
            function (text) {

                text.textContent =
                    progress + "%";

            }
        );
    }


    /* =====================================================
       🌍 إتاحة الوظائف لباقي الملفات
       ===================================================== */

    window.HTMLMaster = {

        toggleTheme:
            toggleTheme,

        showToast:
            showToast,

        getLessonProgress:
            getLessonProgress,

        saveLessonProgress:
            saveLessonProgress,

        markCompleted:
            markCompleted,

        getCurrentLesson:
            getCurrentLesson,

        getOverallProgress:
            getOverallProgress

    };


    /* =====================================================
       🚀 تشغيل كل شيء
       ===================================================== */

    function init() {

        setupTheme();

        setupCopyButtons();

        setupProgress();

        setupLessonCompletion();

        setupAnimations();

        setupButtonEffects();

        setupMobileMenu();

        setupBackToTop();

        setupSmoothLinks();

        setupCardHover();

        setupForms();

        updateOverallProgress();

    }


    /* =====================================================
       ▶️ START
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();
    }


})();