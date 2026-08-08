/* =========================================================
   🌙 HTML MASTER ACADEMY
   Theme Toggle - Dark / Light Mode
   ========================================================= */

(function () {
    "use strict";

    /* ---------------------------------------------------------
       إعدادات الوضع
    --------------------------------------------------------- */

    const STORAGE_KEY = "site_theme";

    const DARK = "dark";
    const LIGHT = "light";

    /* ---------------------------------------------------------
       تطبيق الوضع
    --------------------------------------------------------- */

    function applyTheme(theme) {
        const isLight = theme === LIGHT;

        document.body.classList.toggle("light-mode", isLight);

        // تحديث جميع أزرار تغيير الوضع الموجودة في الصفحة
        const themeButtons = document.querySelectorAll(
            "#themeToggle, .theme-toggle, .theme-toggle-btn, [data-theme-toggle]"
        );

        themeButtons.forEach(function (button) {
            button.setAttribute(
                "aria-label",
                isLight ? "تفعيل الوضع الليلي" : "تفعيل الوضع الصباحي"
            );

            button.setAttribute(
                "title",
                isLight ? "الوضع الليلي" : "الوضع الصباحي"
            );

            // لو الزر فيه span مخصص للنص
            const textElement = button.querySelector(
                ".theme-text, .theme-label"
            );

            if (textElement) {
                textElement.textContent = isLight
                    ? "الوضع الليلي"
                    : "الوضع الصباحي";
            }

            // لو الزر عبارة عن زر عادي بدون عناصر داخلية
            if (!textElement && button.children.length === 0) {
                button.textContent = isLight ? "🌙" : "☀️";
            }
        });

        // حفظ الاختيار
        localStorage.setItem(STORAGE_KEY, theme);
    }

    /* ---------------------------------------------------------
       الحصول على الوضع المحفوظ
    --------------------------------------------------------- */

    function getSavedTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY);

        if (savedTheme === LIGHT || savedTheme === DARK) {
            return savedTheme;
        }

        return DARK;
    }

    /* ---------------------------------------------------------
       تغيير الوضع
    --------------------------------------------------------- */

    function toggleTheme() {
        const isCurrentlyLight =
            document.body.classList.contains("light-mode");

        const newTheme = isCurrentlyLight ? DARK : LIGHT;

        applyTheme(newTheme);
    }

    /* ---------------------------------------------------------
       تشغيل النظام
    --------------------------------------------------------- */

    function initTheme() {

        // تطبيق الوضع المحفوظ فورًا
        applyTheme(getSavedTheme());

        // البحث عن أزرار تغيير الوضع
        const themeButtons = document.querySelectorAll(
            "#themeToggle, .theme-toggle, .theme-toggle-btn, [data-theme-toggle]"
        );

        themeButtons.forEach(function (button) {

            // منع إضافة الحدث أكثر من مرة
            if (button.dataset.themeReady === "true") {
                return;
            }

            button.dataset.themeReady = "true";

            button.addEventListener("click", function (event) {
                event.preventDefault();
                toggleTheme();
            });
        });
    }

    /* ---------------------------------------------------------
       تشغيل بعد تحميل الصفحة
    --------------------------------------------------------- */

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initTheme);
    } else {
        initTheme();
    }

})();