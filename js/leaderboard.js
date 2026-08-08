/* =========================================================
   🏆 HTML MASTER ACADEMY - LEADERBOARD SYSTEM
   File: leaderboard.js

   المسؤول عن:
   ✅ عرض أفضل الطلاب
   ✅ ترتيب الطلاب حسب النتيجة
   ✅ عرض المركز
   ✅ عرض اسم الطالب
   ✅ عرض الدرجة والنسبة
   ✅ تحديد الطالب الحالي
   ✅ عرض حالة النجاح
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       🔑 مفاتيح التخزين
       ===================================================== */

    const LEADERBOARD_KEY =
        "html_master_leaderboard";

    const CURRENT_USER_KEY =
        "html_master_current_user";


    /* =====================================================
       📦 الحصول على لوحة المتصدرين
       ===================================================== */

    function getLeaderboard() {

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(
                        LEADERBOARD_KEY
                    )
                );

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            console.error(
                "خطأ في قراءة لوحة المتصدرين:",
                error
            );

            return [];
        }
    }


    /* =====================================================
       👤 المستخدم الحالي
       ===================================================== */

    function getCurrentUser() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    CURRENT_USER_KEY
                )
            );

        } catch (error) {

            return null;
        }
    }


    /* =====================================================
       🏆 ترتيب المتصدرين
       ===================================================== */

    function sortLeaderboard(list) {

        return [...list].sort(
            function (a, b) {

                const percentageA =
                    Number(
                        a.percentage || 0
                    );

                const percentageB =
                    Number(
                        b.percentage || 0
                    );


                if (
                    percentageB !==
                    percentageA
                ) {

                    return (
                        percentageB -
                        percentageA
                    );
                }


                const scoreA =
                    Number(
                        a.score || 0
                    );

                const scoreB =
                    Number(
                        b.score || 0
                    );


                return (
                    scoreB -
                    scoreA
                );
            }
        );
    }


    /* =====================================================
       🥇 أيقونة المركز
       ===================================================== */

    function getRankIcon(rank) {

        if (rank === 1) {

            return "🥇";
        }

        if (rank === 2) {

            return "🥈";
        }

        if (rank === 3) {

            return "🥉";
        }

        return "🏅";
    }


    /* =====================================================
       🎯 معرفة المستخدم الحالي
       ===================================================== */

    function isCurrentUser(user) {

        const currentUser =
            getCurrentUser();


        if (!currentUser) {

            return false;
        }


        /*
         * الأفضل الاعتماد على البريد
         * لأنه مميز لكل حساب.
         */

        if (
            currentUser.email &&
            user.email
        ) {

            return (
                currentUser.email ===
                user.email
            );
        }


        return (
            currentUser.name ===
            user.name
        );
    }


    /* =====================================================
       🏆 إنشاء صف الطالب
       ===================================================== */

    function createRow(
        user,
        rank
    ) {

        const row =
            document.createElement(
                "div"
            );


        row.className =
            "leaderboard-row";


        if (
            isCurrentUser(user)
        ) {

            row.classList.add(
                "current-user"
            );
        }


        const icon =
            getRankIcon(rank);


        const name =
            escapeHTML(
                user.name ||
                "طالب HTML"
            );


        const score =
            Number(
                user.score || 0
            );


        const total =
            Number(
                user.total || 0
            );


        const percentage =
            Number(
                user.percentage || 0
            );


        const passed =
            user.passed === true ||
            percentage >= 70;


        row.innerHTML = `

            <div class="leaderboard-rank">

                <span class="rank-icon">
                    ${icon}
                </span>

                <span class="rank-number">
                    ${rank}
                </span>

            </div>


            <div class="leaderboard-user">

                <div class="leaderboard-avatar">
                    ${getInitial(name)}
                </div>

                <div>

                    <strong>
                        ${name}
                    </strong>

                    ${
                        isCurrentUser(user)
                        ? `
                            <small>
                                👈 أنت
                            </small>
                        `
                        : ""
                    }

                </div>

            </div>


            <div class="leaderboard-score">

                <strong>
                    ${score}/${total}
                </strong>

                <span>
                    ${percentage}%
                </span>

            </div>


            <div class="leaderboard-status">

                ${
                    passed
                    ? `
                        <span class="status-success">
                            ✅ ناجح
                        </span>
                    `
                    : `
                        <span class="status-failed">
                            📚 يحتاج مراجعة
                        </span>
                    `
                }

            </div>

        `;


        return row;
    }


    /* =====================================================
       🔤 أول حرف من الاسم
       ===================================================== */

    function getInitial(name) {

        if (!name) {

            return "👤";
        }


        return name
            .trim()
            .charAt(0)
            .toUpperCase();
    }


    /* =====================================================
       🛡️ حماية النص من HTML
       ===================================================== */

    function escapeHTML(text) {

        const div =
            document.createElement(
                "div"
            );

        div.textContent =
            text;

        return div.innerHTML;
    }


    /* =====================================================
       📊 عرض اللوحة
       ===================================================== */

    function renderLeaderboard() {

        const container =
            document.getElementById(
                "leaderboardList"
            );


        if (!container) {

            return;
        }


        let leaderboard =
            getLeaderboard();


        leaderboard =
            sortLeaderboard(
                leaderboard
            );


        /*
         * لا يوجد طلاب
         */

        if (
            leaderboard.length === 0
        ) {

            container.innerHTML = `

                <div class="leaderboard-empty">

                    <div>
                        🏆
                    </div>

                    <h2>
                        لا توجد نتائج حتى الآن
                    </h2>

                    <p>
                        كن أول طالب يدخل الامتحان
                        ويضع اسمه في لوحة المتصدرين!
                    </p>

                </div>

            `;

            updateMyRank([]);

            return;
        }


        /*
         * تنظيف القائمة
         */

        container.innerHTML = "";


        /*
         * عرض أفضل 100 طالب
         */

        leaderboard
            .slice(0, 100)
            .forEach(
                function (user, index) {

                    const rank =
                        index + 1;


                    const row =
                        createRow(
                            user,
                            rank
                        );


                    container.appendChild(
                        row
                    );
                }
            );


        /*
         * تحديث مركز المستخدم الحالي
         */

        updateMyRank(
            leaderboard
        );
    }


    /* =====================================================
       👤 مركز الطالب الحالي
       ===================================================== */

    function updateMyRank(
        leaderboard
    ) {

        const rankBox =
            document.getElementById(
                "myRank"
            );


        if (!rankBox) {

            return;
        }


        const currentUser =
            getCurrentUser();


        if (!currentUser) {

            rankBox.innerHTML = `

                <p>
                    🔐 سجل الدخول لمعرفة مركزك.
                </p>

            `;

            return;
        }


        const index =
            leaderboard.findIndex(
                function (user) {

                    return isCurrentUser(
                        user
                    );
                }
            );


        if (index === -1) {

            rankBox.innerHTML = `

                <p>
                    📚 لم تدخل الامتحان النهائي بعد.
                </p>

            `;

            return;
        }


        const rank =
            index + 1;


        const user =
            leaderboard[index];


        rankBox.innerHTML = `

            <div class="my-rank-content">

                <span>
                    🏆 مركزك
                </span>

                <strong>
                    #${rank}
                </strong>

                <span>
                    ${Number(
                        user.percentage || 0
                    )}%
                </span>

            </div>

        `;
    }


    /* =====================================================
       🔄 تحديث تلقائي
       ===================================================== */

    function refreshLeaderboard() {

        renderLeaderboard();
    }


    /* =====================================================
       🚀 تشغيل الصفحة
       ===================================================== */

    function initLeaderboard() {

        renderLeaderboard();


        /*
         * تحديث اللوحة عند الرجوع للصفحة
         */

        window.addEventListener(
            "pageshow",
            refreshLeaderboard
        );


        /*
         * تحديث اللوحة عند تغيير
         * localStorage من صفحة أخرى.
         */

        window.addEventListener(
            "storage",
            function (event) {

                if (
                    event.key ===
                    LEADERBOARD_KEY
                ) {

                    renderLeaderboard();
                }
            }
        );
    }


    /* =====================================================
       🌍 إتاحة النظام لباقي الموقع
       ===================================================== */

    window.HTMLMasterLeaderboard = {

        get:
            getLeaderboard,

        render:
            renderLeaderboard,

        refresh:
            refreshLeaderboard
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
            initLeaderboard
        );

    } else {

        initLeaderboard();
    }


})();