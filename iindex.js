/* =========================================================
   MEOWPLE RUSH — MASTER GAME UPDATE
   Complete replacement for iindex.js

   Features:
   - Snake chase AI
   - Progressive difficulty
   - Round 50+ longer snakes
   - Apple progression
   - 5 points per apple
   - Slower cat at 3 lives or below
   - High score
   - Local score history
   - Settings
   - Sound/music/vibration
   - Round messages
   - Progressive badges
   - Game Over humor
   - High-round humor
   - Winning fireworks
   - Game Over effects
   - Keyboard controls
   - Mobile controls
========================================================= */

(() => {
    "use strict";

    /* =========================================================
       CORE SETTINGS
    ========================================================= */

    const STARTING_LIVES = 5;
    const BASE_APPLES = 10;
    const APPLE_POINTS = 5;

    const NUMBER_OF_SNAKES = 4;
    const SNAKE_MOVE_INTERVAL = 55;

    const STORAGE = {
        settings: "meowpleRushSettings",
        highScore: "meowpleRushHighScore",
        history: "meowpleRushScoreHistory",
        badge: "meowpleRushHighestBadge"
    };

    const DEFAULT_SETTINGS = {
        sound: true,
        music: true,
        vibration: true,
        messages: true,
        effects: true
    };


    /* =========================================================
       ROUND MESSAGES
       ROUND 1–10 — EXISTING MESSAGES
    ========================================================= */

    const roundNotes = {

        1: "Kaya mo naman pala eh, pero bakit sa akin hirap na hirap ka, emee!!! 😂",

        2: "Ay wow, umabot ka pa dito? 😏",

        3: "Hindi ka pa sumusuko? Sige nga! 😂",

        4: "Medyo seryoso ka na ah! 👀",

        5: "INYAKITDENN! 😂",

        6: "Uy, buhay ka pa! 😭",

        7: "Akala mo madali pa rin? 😈",

        8: "Wag kang kampante! 🐍😂",

        9: "Malapit ka na... or baka hindi. 😏",

        10: "IMMORTAL YARN! 🔥🐱",


        /* =====================================================
           ROUND 11–20 — EXACT REQUESTED MESSAGES
        ===================================================== */

        11: "Nadali mo Jorge!!!",

        12: "KAYA NA TALAGA!",

        13: "OA na siya",

        14: "Nalaingka Ngarud",

        15: "Nakss! Sige pahabol ka pa sa ahas, chor",

        16: "Edi Wow",

        17: "Round 18 na ngani",

        18: "Happi ka na niyan",

        19: "Isa na lang malalaman mo na kung San ka nagkulang",

        20: "PALDO!!!"
    };


    /* =========================================================
       ROUND 21–100 HUMOR
    ========================================================= */

    const round21to100 = [

        "Aba, may stamina! Akala ko hanggang Round 20 ka lang. 😂",

        "Jorge, wag kang masyadong confident, may ahas din silang pangarap. 🐍",

        "Naks! Certified apple collector ka na. 🍎",

        "Uy, hindi na ito warm-up. Lock in! 😭",

        "Ahas said: 'Boss, habulin ko na ba?' 💀",

        "Ayos ka ah, parang may unfinished business sa apples. 😂",

        "Sige lang, ilaban mo. Nandito lang ang stress. 😌",

        "Nalaingka met! Pero may snake tax mamaya. 🐍",

        "Round cleared! Aba, may plot armor. ✨",

        "You are cooking... sana hindi ikaw ang ma-cook. 😭",

        "Grabe, seryoso na ang catto. 🐱🔥",

        "Apple after apple. Ahas after you. Fair trade. 😂",

        "Hala, lumalakas ka. Delikado ka nang kalabanin. 😈",

        "Tuloy mo lang, baka mauna pang mapagod ang ahas. 😂",

        "Uy! May resibo ang bawat galaw mo. 👀",

        "Round cleared, pero ang peace of mind mo hindi. 💀",

        "Kaya pa? Sabi ng ahas, sure ka ba diyan? 🐍",

        "Aba, may focus! Huwag lang matapilok sa sariling confidence. 😂",

        "Ilaban mo, bossing. One apple at a time. 🍎",

        "Mabuti pa ang cat, may direction. Ikaw meron din sana. 😭",

        "Certified paldo behavior. 🏆",

        "Ay wow, umabot ka na naman. Consistency yarn? 😂",

        "Snake POV: 'Bakit ang bilis nitong pusang ito?' 🐍",

        "Nagrereklamo na ang ahas, ikaw tuloy-tuloy pa rin. 😂",

        "Awan ti surrender! Ilaban mo dayta! 🔥",

        "Main character energy detected. 🐱✨",

        "Hindi na casual gaming 'to. May career na dito. 😭",

        "Round cleared! Pakihinaan lang ang yabang. 😂",

        "Sige, dagdagan natin ang pressure. 😈",

        "Apple hunter mode: ACTIVATED. 🍎",

        "Ahas is typing... 🐍⌨️",

        "Naks, may technique! O baka swerte lang? 👀",

        "You survived. The snakes are taking notes. 😂",

        "Agbiag ka pay! Pero careful. 🐱",

        "Aba, umabot ka dito nang walang drama? Impossible. 😂",

        "The cat has entered serious mode. 🔥",

        "Habulan na talaga ito, bestie. 🐍💨",

        "Round cleared. Confidence +10, danger +20. 😂",

        "Nasa high-level territory ka na. Good luck, boss. 👑",

        "Wag mo sabihing easy. Naririnig ka ng ahas. 😭",

        "Apple collector with a side quest of survival. 🍎",

        "Ayan na, gumaganda na ang laban. 🔥",

        "Kung may exam ito, ahas ang proctor. 💀",

        "Sige lang, baka ikaw na ang final boss. 😈",

        "Ilocano confidence: mataas. Snake patience: mababa. 😂",

        "The cat is locked in! 🐱🔒",

        "Nasa momentum ka na. Huwag kang magpabiktima. 🐍",

        "Aba, may clutch moments! 👀",

        "Round after round, grabe ka na. 😂",

        "Nagsisimula nang personal ang laban. 😭",

        "Keep moving, keep munching, keep surviving. 🍎",

        "Ahas: 'Pwede ba break muna?' 😂",

        "May plot twist ba? Baka ikaw ang plot twist. 💀",

        "Okay, this is getting serious. 🔥",

        "Awan ti atras! Pero may atras button... char. 😂",

        "Round cleared. Another day, another apple. 🍎",

        "You are officially making the snakes nervous. 🐍",

        "Naks! Hindi ka na beginner. Don't celebrate too early. 😏",

        "Catto speedrun incoming. 🐱💨",

        "Kung confidence ang points, 100 na. 😂",

        "The field is smaller only in your imagination. 😭",

        "Ahas season na, pero ikaw bida. 🐍✨",

        "Laban lang! Ti kayat mo, maala mo. 🔥",

        "Round cleared. Wala nang atrasan. 😈",

        "Mayabang ka na? Sige, prove it. 😂",

        "Your cat has trust issues with snakes now. 🐱",

        "Apple count rising, survival odds questionable. 💀",

        "Aba, hindi ka nagpapatalo. Respect. 🫡",

        "Snake AI is learning your moves. 👀",

        "Nasa danger zone ka na, pero chill pa rin. 😂",

        "Round cleared! Bigyan ng medal ang reflexes. 🏅",

        "The cat said: 'One more round.' The cat is brave. 😭",

        "Ahas: 0? Ikaw: still alive. Good enough. 😂",

        "High round behavior. Wag kang bibitaw. 🔥",

        "Sige pa, baka legendary na ito. 👑",

        "You made it this far. The roast budget is increasing. 😂"
    ];


    /* =========================================================
       GAME OVER MESSAGES
    ========================================================= */

    const gameOverNotes = [

        "AYAN! NAGPAHULI KA 😂",

        "Naglaro ka ba talaga o nagpa-catch? 😭",

        "Teh... yung ahas na mismo nahabol ka. 😭",

        "Skill issue daw sabi ng ahas. 🐍",

        "Nagsimula kang hunter, naging hunted. 💀",

        "Ahas: 1 — Ikaw: 0. 🐍",

        "Ay wow, mabilis ka... matalo. 😂",

        "The cat has left the chat. 🐱💀",

        "Pahinga ka muna, baka pati Round 1 ma-trauma. 💀",

        "Ahas got the plot twist. 😭🐍",

        "Naku po, na-checkmate ng ahas. 😂",

        "Catto said 'meow'... snake said 'gotcha.' 💀",

        "Habol sana, kaso ikaw ang nahabol. 😭",

        "Arayy, bitin ang apple collection. 🍎💀",

        "Sabi ko nga wag kampante. 😭",

        "Ahas: 'Thank you for playing.' 🐍😂",

        "Round ended. Confidence also ended. 💀",

        "Okay lang yan... practice round daw. 😂",

        "Naging snack ang hunter. 🐱💀"
    ];


    /* =========================================================
       HIGH ROUND ROASTS
    ========================================================= */

    const highRoundRoasts = [

        "Arayy mo Round {round}... tapos . 💀👏",

        "ROUND {round}?! Tapos ganito ending? 😭👏",

        "Umabot ng {round} para lang ma-roast ng ahas. Legendary. 😂",

        "Round {round} is impressive. Yung ending lang ang medyo suspicious. 💀",

        "At least umabot ka ng {round}. The snakes respect you... a little. 🐍",

        "Round {round} ka na, tapos nahuli pa rin. Cinema. 🎬💀",

        "Hindi biro ang {round}. Pero hindi rin biro ang pagkakamali mo. 😂",

        "High-round survivor sana... kaso survivor na lang ang memory. 😭",

        "Round {round}: solid run. Game Over: very dramatic. 💀👏"
    ];


    /* =========================================================
       VARIABLES
    ========================================================= */

    let settings = loadJSON(STORAGE.settings, DEFAULT_SETTINGS);

    settings = {
        ...DEFAULT_SETTINGS,
        ...settings
    };

    let score = 0;

    let lives = STARTING_LIVES;

    let round = 1;

    let appleCount = 0;

    let highScore =
        Number(localStorage.getItem(STORAGE.highScore) || 0);

    let history =
        loadJSON(STORAGE.history, []);

    let highestBadgeRound =
        Number(localStorage.getItem(STORAGE.badge) || 0);

    let gameRunning = false;

    let gamePaused = false;

    let roundTransition = false;

    let catX = 0;

    let catY = 0;

    let apples = [];

    let snakes = [];

    let animationFrame = null;

    let snakeTimer = null;

    let lifeHitCooldown = false;

    let audioContext = null;

    let masterGain = null;

    let musicTimer = null;

    let musicStarted = false;

    let lastGameOverNote = "";

    let lastRoundNote = "";


    /* =========================================================
       DOM HELPERS
    ========================================================= */

    const $ = id => document.getElementById(id);

    const game = $("game");

    const cat = $("cat");

    const scoreDisplay = $("score");

    const livesDisplay = $("lives");

    const roundDisplay = $("round");

    const appleGoalDisplay = $("appleGoal");

    const startScreen = $("startScreen");

    const roundComplete = $("roundComplete");

    const pauseScreen = $("pauseScreen");

    const gameOverScreen = $("gameOverScreen");

    const startButton = $("startButton");

    const nextRoundButton = $("nextRoundButton");

    const restartButton = $("restart");

    const restartGameButton = $("restartGameButton");

    const pauseButton = $("pauseButton");

    const resumeButton = $("resumeButton");

    const roundTitle = $("roundTitle");

    const roundNote = $("roundNote");

    const gameOverNote = $("gameOverNote");

    const finalRound = $("finalRound");

    const upButton = $("up");

    const downButton = $("down");

    const leftButton = $("left");

    const rightButton = $("right");


    if (!game || !cat) {

        console.error(
            "Meowple Rush: #game or #cat is missing from the HTML."
        );

        return;
    }


    /* =========================================================
       STORAGE
    ========================================================= */

    function loadJSON(key, fallback) {

        try {

            const value =
                JSON.parse(localStorage.getItem(key));

            return value ?? fallback;

        } catch {

            return fallback;

        }
    }


    function saveSettings() {

        localStorage.setItem(
            STORAGE.settings,
            JSON.stringify(settings)
        );

    }


    function updateSettingsScore() {

        const current =
            $("meowpleCurrentScore");

        const high =
            $("meowpleHighScore");

        if (current) {

            current.textContent = score;

        }

        if (high) {

            high.textContent = highScore;

        }

    }


    /* =========================================================
       DYNAMIC STYLES
    ========================================================= */

    function injectExtraStyles() {

        if ($("meowpleMasterStyles")) return;

        const style =
            document.createElement("style");

        style.id =
            "meowpleMasterStyles";

        style.textContent = `

        #meowpleSettingsButton {

            position: fixed;

            top: 14px;

            right: 14px;

            z-index: 500;

            border: 0;

            border-radius: 50%;

            width: 48px;

            height: 48px;

            background: #fffaf0;

            box-shadow:
                0 4px 0 #d6ae78,
                0 8px 16px rgba(0,0,0,.15);

            font-size: 24px;

            cursor: pointer;
        }


        #meowpleBadge {

            display: inline-flex;

            align-items: center;

            gap: 6px;

            margin-left: 8px;

            padding: 7px 12px;

            border-radius: 18px;

            background: #fffaf0;

            border: 2px solid #efd5a7;

            box-shadow:
                0 3px 0 #d6ae78;

            font-weight: 900;

            font-size: 14px;
        }


        #meowpleBadge.pop {

            animation:
                meowpleBadgePop .6s ease;

        }


        @keyframes meowpleBadgePop {

            0% {

                transform:
                    scale(.5)
                    rotate(-8deg);

                opacity: 0;

            }

            70% {

                transform:
                    scale(1.15)
                    rotate(3deg);

                opacity: 1;

            }

            100% {

                transform:
                    scale(1)
                    rotate(0);

                opacity: 1;

            }

        }


        #meowpleSettingsOverlay {

            position: fixed;

            inset: 0;

            z-index: 1000;

            display: none;

            align-items: center;

            justify-content: center;

            padding: 18px;

            background:
                rgba(45,25,15,.58);

            backdrop-filter: blur(6px);

        }


        #meowpleSettingsBox {

            width: min(94vw,560px);

            max-height: 88vh;

            overflow: auto;

            padding: 22px;

            border-radius: 28px;

            background:
                linear-gradient(
                    145deg,
                    #fffaf0,
                    #ffedcf
                );

            border:
                4px dashed #e5bd7c;

            box-shadow:
                0 10px 0 #d2a567,
                0 20px 35px rgba(0,0,0,.25);

            text-align: left;

        }


        #meowpleSettingsBox h2,
        #meowpleSettingsBox h3 {

            text-align: center;

            color: #70401f;

        }


        .meowpleSettingRow {

            display: flex;

            justify-content: space-between;

            align-items: center;

            gap: 12px;

            padding: 10px 4px;

            border-bottom:
                1px solid #ead5b7;

            font-weight: 800;

        }


        .meowpleToggle {

            border: 0;

            border-radius: 18px;

            padding: 7px 14px;

            min-width: 76px;

            font-weight: 900;

            cursor: pointer;

            background: #d8e8bd;

            color: #42621f;

        }


        .meowpleToggle.off {

            background: #ead7d1;

            color: #7a4034;

        }


        #meowpleHistory {

            margin:
                8px 0 12px;

            padding: 0;

            list-style: none;

            max-height: 180px;

            overflow: auto;

        }


        #meowpleHistory li {

            padding: 7px 8px;

            margin: 4px 0;

            border-radius: 10px;

            background:
                rgba(255,255,255,.55);

        }


        .meowpleSettingsAction {

            width: 100%;

            margin-top: 10px;

            padding: 12px 16px;

            border: 0;

            border-radius: 18px;

            font-weight: 900;

            cursor: pointer;

        }


        #meowpleResetHistory {

            background: #e77b6e;

            color: white;

        }


        #meowpleDone {

            background: #ad7541;

            color: white;

        }


        #meowpleToast {

            position: fixed;

            left: 50%;

            top: 50%;

            transform:
                translate(-50%,-50%);

            z-index: 1200;

            display: none;

            padding: 18px 24px;

            border-radius: 20px;

            background: #fffaf0;

            border:
                3px solid #e5bd7c;

            box-shadow:
                0 8px 25px rgba(0,0,0,.25);

            font-weight: 900;

            font-size: 20px;

        }


        .meowpleFirework {

            position: absolute;

            z-index: 90;

            pointer-events: none;

            font-size: 28px;

            animation:
                meowpleFirework 1.1s
                ease-out forwards;

        }


        @keyframes meowpleFirework {

            0% {

                transform:
                    scale(.2);

                opacity: 0;

            }

            25% {

                transform:
                    scale(1.4);

                opacity: 1;

            }

            100% {

                transform:
                    scale(2.2)
                    translateY(-25px);

                opacity: 0;

            }

        }


        .snakeBody {

            position: absolute;

            width: 100%;

            height: 100%;

            display: flex;

            align-items: center;

            justify-content: center;

            pointer-events: none;

        }


        .snakeSegment {

            position: absolute;

            font-size: .82em;

            transform:
                translateX(-22px);

        }


        .snakeHead {

            position: relative;

            z-index: 2;

        }


        .meowpleBadgeMini {

            font-size: 18px;

        }


        @media(max-width:700px) {

            #meowpleSettingsButton {

                top: 8px;

                right: 8px;

                width: 42px;

                height: 42px;

                font-size: 21px;

            }


            #meowpleSettingsBox {

                padding: 16px;

                border-radius: 22px;

            }


            .meowpleSettingRow {

                font-size: 14px;

            }

        }

    `;

        document.head.appendChild(style);

    }


    /* =========================================================
       DYNAMIC UI
    ========================================================= */

    function createDynamicUI() {

        injectExtraStyles();


        /* SETTINGS BUTTON */

        if (!$("meowpleSettingsButton")) {

            const button =
                document.createElement("button");

            button.id =
                "meowpleSettingsButton";

            button.type =
                "button";

            button.textContent =
                "⚙️";

            button.title =
                "Settings";

            document.body.appendChild(button);

        }


        /* BADGE */

        if (!$("meowpleBadge")) {

            const badge =
                document.createElement("span");

            badge.id =
                "meowpleBadge";

            badge.innerHTML =
                `<span class="meowpleBadgeMini">
                🐾
            </span>
            <span>NO BADGE</span>`;

            const actions =
                $("actions");

            if (actions) {

                actions.appendChild(badge);

            } else {

                document.body.appendChild(badge);

            }

        }


        /* SETTINGS OVERLAY */

        if (!$("meowpleSettingsOverlay")) {

            const overlay =
                document.createElement("div");

            overlay.id =
                "meowpleSettingsOverlay";

            overlay.innerHTML = `

            <div id="meowpleSettingsBox">

                <h2>
                    ⚙️ GAME SETTINGS
                </h2>


                <div class="meowpleSettingRow">

                    <span>
                        🔊 Sound
                    </span>

                    <button
                        class="meowpleToggle"
                        id="meowpleSoundToggle">
                    </button>

                </div>


                <div class="meowpleSettingRow">

                    <span>
                        🎵 Music
                    </span>

                    <button
                        class="meowpleToggle"
                        id="meowpleMusicToggle">
                    </button>

                </div>


                <div class="meowpleSettingRow">

                    <span>
                        📳 Vibration
                    </span>

                    <button
                        class="meowpleToggle"
                        id="meowpleVibrationToggle">
                    </button>

                </div>


                <div class="meowpleSettingRow">

                    <span>
                        💬 Round Messages
                    </span>

                    <button
                        class="meowpleToggle"
                        id="meowpleMessagesToggle">
                    </button>

                </div>


                <div class="meowpleSettingRow">

                    <span>
                        ✨ Effects
                    </span>

                    <button
                        class="meowpleToggle"
                        id="meowpleEffectsToggle">
                    </button>

                </div>


                <h3>
                    🏆 SCORE
                </h3>


                <p>

                    <strong>
                        Current Score:
                    </strong>

                    <span id="meowpleCurrentScore">
                        0
                    </span>

                </p>


                <p>

                    <strong>
                        Highest Score:
                    </strong>

                    <span id="meowpleHighScore">
                        0
                    </span>

                </p>


                <h3>
                    📊 SCORE HISTORY
                </h3>


                <ul id="meowpleHistory"></ul>


                <button
                    class="meowpleSettingsAction"
                    id="meowpleResetHistory">

                    RESET HISTORY

                </button>


                <button
                    class="meowpleSettingsAction"
                    id="meowpleDone">

                    ✓ DONE

                </button>

            </div>

        `;

            document.body.appendChild(overlay);

        }


        /* TOAST */

        if (!$("meowpleToast")) {

            const toast =
                document.createElement("div");

            toast.id =
                "meowpleToast";

            document.body.appendChild(toast);

        }


        updateSettingsUI();

        updateBadgeUI();

        updateSettingsScore();

    }


    /* =========================================================
       SETTINGS UI
    ========================================================= */

    function updateSettingsUI() {

        const map = {

            sound:
                "meowpleSoundToggle",

            music:
                "meowpleMusicToggle",

            vibration:
                "meowpleVibrationToggle",

            messages:
                "meowpleMessagesToggle",

            effects:
                "meowpleEffectsToggle"

        };


        Object.entries(map).forEach(
            ([key,id]) => {

                const button = $(id);

                if (!button) return;


                button.textContent =
                    settings[key]
                        ? "ON"
                        : "OFF";


                button.classList.toggle(
                    "off",
                    !settings[key]
                );

            }
        );


        renderHistory();

    }


    /* =========================================================
       SCORE HISTORY
    ========================================================= */

    function renderHistory() {

        const list =
            $("meowpleHistory");

        if (!list) return;


        list.innerHTML = "";


        if (!history.length) {

            const li =
                document.createElement("li");

            li.textContent =
                "No score history yet. Go get paldo! 🐱";

            list.appendChild(li);

            return;

        }


        history
            .slice()
            .sort(
                (a,b) =>
                    b.round - a.round ||
                    b.score - a.score
            )
            .slice(0,30)
            .forEach(item => {

                const li =
                    document.createElement("li");

                li.textContent =
                    `Round ${item.round} — ${item.score} pts`;

                list.appendChild(li);

            });

    }


    function recordHistory(
        roundReached,
        finalScore
    ) {

        if (roundReached < 1) return;


        history.push({

            round:
            roundReached,

            score:
            finalScore,

            date:
                new Date().toISOString()

        });


        history =
            history
                .sort(
                    (a,b) =>
                        b.round - a.round ||
                        b.score - a.score
                )
                .slice(0,100);


        localStorage.setItem(
            STORAGE.history,
            JSON.stringify(history)
        );


        renderHistory();

    }


    function resetHistory() {

        if (
            !confirm(
                "Reset all Score History? This cannot be undone."
            )
        ) {

            return;

        }


        history = [];


        localStorage.removeItem(
            STORAGE.history
        );


        renderHistory();


        showToast(
            "Score History reset."
        );

    }


    /* =========================================================
       SETTINGS
    ========================================================= */

    function openSettings() {

        gamePaused =
            gameRunning
                ? true
                : gamePaused;


        stopMovement();


        const overlay =
            $("meowpleSettingsOverlay");


        if (overlay) {

            overlay.style.display =
                "flex";

        }


        updateSettingsUI();

        updateSettingsScore();

    }


    function closeSettings() {

        const overlay =
            $("meowpleSettingsOverlay");


        if (overlay) {

            overlay.style.display =
                "none";

        }


        if (
            gameRunning &&
            !roundTransition
        ) {

            gamePaused = false;

        }

    }


    function toggleSetting(key) {

        settings[key] =
            !settings[key];


        saveSettings();

        updateSettingsUI();


        if (
            key === "music" &&
            settings.music &&
            gameRunning
        ) {

            startMusic();

        }


        if (
            key === "music" &&
            !settings.music
        ) {

            stopMusic();

        }


        if (key === "vibration") {

            vibrate(20);

        }


        playSound("click");

    }


    function showToast(message) {

        const toast =
            $("meowpleToast");

        if (!toast) return;


        toast.textContent =
            message;


        toast.style.display =
            "block";


        setTimeout(
            () => {

                toast.style.display =
                    "none";

            },
            1200
        );

    }


    /* =========================================================
       AUDIO
    ========================================================= */

    function ensureAudio() {

        if (!audioContext) {

            const AC =
                window.AudioContext ||
                window.webkitAudioContext;


            if (!AC) {

                return false;

            }


            audioContext =
                new AC();


            masterGain =
                audioContext.createGain();


            masterGain.gain.value =
                0.12;


            masterGain.connect(
                audioContext.destination
            );

        }


        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();

        }


        return true;

    }


    function tone(
        frequency,
        duration = .08,
        type = "sine",
        volume = .18,
        delay = 0
    ) {

        if (
            !settings.sound ||
            !ensureAudio()
        ) {

            return;

        }


        const now =
            audioContext.currentTime +
            delay;


        const osc =
            audioContext.createOscillator();


        const gain =
            audioContext.createGain();


        osc.type =
            type;


        osc.frequency.setValueAtTime(
            frequency,
            now
        );


        gain.gain.setValueAtTime(
            0.0001,
            now
        );


        gain.gain.exponentialRampToValueAtTime(
            volume,
            now + .01
        );


        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + duration
        );


        osc.connect(gain);

        gain.connect(masterGain);


        osc.start(now);

        osc.stop(
            now + duration + .02
        );

    }


    function playSound(name) {

        if (!settings.sound) return;


        switch (name) {

            case "apple":

                tone(
                    660,
                    .07,
                    "sine",
                    .16
                );

                tone(
                    990,
                    .09,
                    "sine",
                    .12,
                    .045
                );

                break;


            case "warning":

                tone(
                    120,
                    .12,
                    "sawtooth",
                    .08
                );

                break;


            case "life":

                tone(
                    150,
                    .16,
                    "square",
                    .13
                );

                tone(
                    90,
                    .18,
                    "square",
                    .09,
                    .08
                );

                break;


            case "round":

                tone(
                    523,
                    .10,
                    "triangle",
                    .12
                );

                tone(
                    659,
                    .10,
                    "triangle",
                    .12,
                    .09
                );

                tone(
                    784,
                    .16,
                    "triangle",
                    .13,
                    .18
                );

                break;


            case "badge":

                [523,659,784,1047]
                    .forEach(
                        (f,i) =>
                            tone(
                                f,
                                .12,
                                "triangle",
                                .13,
                                i * .09
                            )
                    );

                break;


            case "high":

                [659,784,988,1318]
                    .forEach(
                        (f,i) =>
                            tone(
                                f,
                                .14,
                                "sine",
                                .14,
                                i * .08
                            )
                    );

                break;


            case "gameover":

                tone(
                    220,
                    .18,
                    "sawtooth",
                    .11
                );

                tone(
                    165,
                    .25,
                    "sawtooth",
                    .10,
                    .14
                );

                break;


            case "win":

                [523,659,784,1047]
                    .forEach(
                        (f,i) =>
                            tone(
                                f,
                                .13,
                                "sine",
                                .14,
                                i * .08
                            )
                    );

                break;


            case "fireworks":

                [784,988,1175,1568]
                    .forEach(
                        (f,i) =>
                            tone(
                                f,
                                .08,
                                "sine",
                                .08,
                                i * .07
                            )
                    );

                break;


            case "click":

                tone(
                    420,
                    .035,
                    "square",
                    .06
                );

                break;


            default:

                break;

        }

    }


    /* =========================================================
       BACKGROUND MUSIC
    ========================================================= */

    function startMusic() {

        if (
            !settings.music ||
            musicStarted ||
            !ensureAudio()
        ) {

            return;

        }


        musicStarted =
            true;


        const notes = [

            261.63,
            329.63,
            392,
            329.63,
            293.66,
            349.23,
            440,
            392

        ];


        let index = 0;


        const tick = () => {

            if (
                !musicStarted ||
                !settings.music ||
                !audioContext
            ) {

                return;

            }


            const f =
                notes[
                index++ %
                notes.length
                    ];


            tone(
                f,
                .18,
                "triangle",
                .025
            );


            musicTimer =
                setTimeout(
                    tick,
                    360
                );

        };


        tick();

    }


    function stopMusic() {

        musicStarted =
            false;


        if (musicTimer) {

            clearTimeout(
                musicTimer
            );

        }


        musicTimer =
            null;

    }


    function vibrate(ms = 30) {

        if (
            settings.vibration &&
            navigator.vibrate
        ) {

            navigator.vibrate(ms);

        }

    }


    /* =========================================================
       GAME DISPLAY
    ========================================================= */

    function getAppleGoal(
        targetRound = round
    ) {

        if (targetRound < 5) {

            return BASE_APPLES;

        }


        if (targetRound < 50) {

            return (
                BASE_APPLES +
                Math.floor(
                    (targetRound - 5) / 5
                ) +
                1
            );

        }


        return (
            BASE_APPLES +
            10 +
            ((targetRound - 50) * 5)
        );

    }


    function getAppleSize(
        targetRound = round
    ) {

        if (targetRound < 5) {

            return 40;

        }


        if (targetRound < 20) {

            return Math.max(
                30,
                40 - (targetRound - 4)
            );

        }


        if (targetRound < 50) {

            return Math.max(
                22,
                30 -
                Math.floor(
                    (targetRound - 20) / 3
                )
            );

        }


        return Math.max(
            14,
            22 -
            Math.floor(
                (targetRound - 50) / 8
            )
        );

    }


    function getCatSpeed() {

        if (lives <= 3) {

            return Math.max(
                2.5,
                5 -
                Math.min(
                    1.5,
                    (4 - lives) * .35
                )
            );

        }


        return 5;

    }


    function getSnakeSpeed() {

        const ramp =
            Math.min(
                2.8,
                (round - 1) * .045
            );


        if (round < 5) {

            return 1.45 + ramp * .45;

        }


        if (round < 20) {

            return 1.6 + ramp;

        }


        if (round < 50) {

            return 1.8 + ramp * 1.15;

        }


        return Math.min(
            4.9,
            2.3 +
            (round - 50) * .035
        );

    }


    function getSnakeLength() {

        if (round >= 50) {

            return 1 +
                (round - 50);

        }


        return 1;

    }


    function updateDisplay() {

        if (scoreDisplay) {

            scoreDisplay.textContent =
                score;

        }


        if (livesDisplay) {

            livesDisplay.textContent =
                lives;

        }


        if (roundDisplay) {

            roundDisplay.textContent =
                round;

        }


        if (appleGoalDisplay) {

            appleGoalDisplay.textContent =
                getAppleGoal();

        }


        updateSettingsScore();

        updateBadgeUI();

    }


    function getGameWidth() {

        return game.clientWidth;

    }


    function getGameHeight() {

        return game.clientHeight;

    }


    function positionCatAtStart() {

        catX =
            Math.max(
                20,
                Math.floor(
                    getGameWidth() * .08
                )
            );


        catY =
            Math.max(
                20,
                Math.floor(
                    getGameHeight() * .78
                )
            );


        keepCatInsideGame();

        updateCatPosition();

    }


    function keepCatInsideGame() {

        const maxX =
            Math.max(
                0,
                getGameWidth() -
                cat.offsetWidth
            );


        const maxY =
            Math.max(
                0,
                getGameHeight() -
                cat.offsetHeight
            );


        catX =
            Math.max(
                0,
                Math.min(
                    catX,
                    maxX
                )
            );


        catY =
            Math.max(
                0,
                Math.min(
                    catY,
                    maxY
                )
            );

    }


    function updateCatPosition() {

        cat.style.left =
            `${catX}px`;

        cat.style.top =
            `${catY}px`;

    }


    /* =========================================================
       ROUND CREATION
    ========================================================= */

    function startGame() {

        ensureAudio();

        stopMusic();


        score = 0;

        lives = STARTING_LIVES;

        round = 1;

        appleCount = 0;

        gameRunning = true;

        gamePaused = false;

        roundTransition = false;

        lifeHitCooldown = false;


        clearObjectsOnly();

        positionCatAtStart();

        updateDisplay();


        if (startScreen) {

            startScreen.style.display =
                "none";

        }


        if (roundComplete) {

            roundComplete.style.display =
                "none";

        }


        if (pauseScreen) {

            pauseScreen.style.display =
                "none";

        }


        if (gameOverScreen) {

            gameOverScreen.style.display =
                "none";

        }


        if (pauseButton) {

            pauseButton.textContent =
                "⏸️ Pause";

        }


        createRound();

        startGameLoop();

        startSnakeTimer();

        startMusic();

        playSound("click");

        vibrate(25);

    }


    function createRound() {

        clearObjectsOnly();

        appleCount = 0;

        positionCatAtStart();

        createApples();

        createSnakes();

        updateDisplay();

    }


    function clearObjectsOnly() {

        apples.forEach(
            apple =>
                apple.element.remove()
        );

        apples = [];


        snakes.forEach(
            snake =>
                snake.element.remove()
        );

        snakes = [];

    }


    function getRandomPosition(
        width,
        height
    ) {

        return {

            x: Math.max(
                5,
                Math.random() *
                Math.max(
                    10,
                    getGameWidth() -
                    width
                )
            ),

            y: Math.max(
                5,
                Math.random() *
                Math.max(
                    10,
                    getGameHeight() -
                    height
                )
            )

        };

    }


    function distance(
        x1,
        y1,
        x2,
        y2
    ) {

        return Math.sqrt(
            (x1 - x2) ** 2 +
            (y1 - y2) ** 2
        );

    }


    function isNearCat(
        x,
        y,
        distanceAmount
    ) {

        return distance(
            x,
            y,
            catX,
            catY
        ) < distanceAmount;

    }


    function createApples() {

        const goal =
            getAppleGoal();


        for (
            let i = 0;
            i < goal;
            i++
        ) {

            createApple();

        }

    }


    function createApple() {

        const apple =
            document.createElement("div");


        apple.className =
            "apple";


        apple.textContent =
            "🍎";


        const size =
            getAppleSize();


        apple.style.width =
            `${size}px`;


        apple.style.height =
            `${size}px`;


        apple.style.fontSize =
            `${Math.max(
                12,
                size * .85
            )}px`;


        let position;

        let attempts = 0;


        do {

            position =
                getRandomPosition(
                    size,
                    size
                );

            attempts++;

        }

        while (
            isNearCat(
                position.x,
                position.y,
                120
            ) &&
            attempts < 100
            );


        apple.style.left =
            `${position.x}px`;


        apple.style.top =
            `${position.y}px`;


        game.appendChild(
            apple
        );


        apples.push({

            element:
            apple,

            x:
            position.x,

            y:
            position.y,

            size:
            size

        });

    }


    /* =========================================================
       SNAKES
    ========================================================= */

    function createSnakes() {

        const anchors = [

            {
                x: .90,
                y: .08
            },

            {
                x: .88,
                y: .82
            },

            {
                x: .52,
                y: .08
            },

            {
                x: .12,
                y: .10
            }

        ];


        for (
            let i = 0;
            i < NUMBER_OF_SNAKES;
            i++
        ) {

            createSnake(
                anchors[
                i %
                anchors.length
                    ],
                i
            );

        }

    }


    function createSnake(
        anchor,
        index
    ) {

        const snake =
            document.createElement("div");


        snake.className =
            "snake";


        snake.innerHTML =
            `
        <span class="snakeHead">
            🐍
        </span>

        <span class="snakeBody"></span>
        `;


        const width =
            getGameWidth();


        const height =
            getGameHeight();


        let x =
            Math.floor(
                width * anchor.x
            );


        let y =
            Math.floor(
                height * anchor.y
            );


        x =
            Math.max(
                10,
                Math.min(
                    x,
                    Math.max(
                        10,
                        width - 55
                    )
                )
            );


        y =
            Math.max(
                10,
                Math.min(
                    y,
                    Math.max(
                        10,
                        height - 45
                    )
                )
            );


        if (
            distance(
                x,
                y,
                catX,
                catY
            ) < 190
        ) {

            x =
                index % 2 === 0
                    ? width - 70
                    : 25;


            y =
                index % 2 === 0
                    ? 25
                    : 40;

        }


        snake.style.left =
            `${x}px`;


        snake.style.top =
            `${y}px`;


        game.appendChild(
            snake
        );


        const body =
            snake.querySelector(
                ".snakeBody"
            );


        const length =
            getSnakeLength();


        for (
            let i = 1;
            i < length;
            i++
        ) {

            const seg =
                document.createElement(
                    "span"
                );


            seg.className =
                "snakeSegment";


            seg.textContent =
                i % 2
                    ? "🟢"
                    : "🟩";


            seg.style.transform =
                `translateX(${
                    -22 - i * 16
                }px)`;


            body.appendChild(
                seg
            );

        }


        const angle =
            Math.random() *
            Math.PI *
            2;


        const speed =
            getSnakeSpeed();


        snakes.push({

            element:
            snake,

            x:
            x,

            y:
            y,

            dx:
                Math.cos(angle) *
                speed,

            dy:
                Math.sin(angle) *
                speed,

            speed:
            speed,

            turnTimer:
                0,

            index:
            index

        });

    }


    /* =========================================================
       GAME LOOP
    ========================================================= */

    function startGameLoop() {

        if (animationFrame) {

            cancelAnimationFrame(
                animationFrame
            );

        }


        const loop = () => {

            if (
                gameRunning &&
                !gamePaused &&
                !roundTransition
            ) {

                moveCat();

                checkAppleCollisions();

                checkSnakeCollisions();

            }


            animationFrame =
                requestAnimationFrame(
                    loop
                );

        };


        loop();

    }


    function moveCat() {

        let moving = false;


        const speed =
            getCatSpeed();


        if (movement.up) {

            catY -= speed;

            moving = true;

        }


        if (movement.down) {

            catY += speed;

            moving = true;

        }


        if (movement.left) {

            catX -= speed;

            moving = true;

        }


        if (movement.right) {

            catX += speed;

            moving = true;

        }


        keepCatInsideGame();

        updateCatPosition();


        cat.classList.toggle(
            "moving",
            moving
        );

    }


    function startSnakeTimer() {

        if (snakeTimer) {

            clearInterval(
                snakeTimer
            );

        }


        snakeTimer =
            setInterval(
                moveSnakes,
                SNAKE_MOVE_INTERVAL
            );

    }


    function moveSnakes() {

        if (
            !gameRunning ||
            gamePaused ||
            roundTransition
        ) {

            return;

        }


        const width =
            getGameWidth();


        const height =
            getGameHeight();


        snakes.forEach(
            snake => {

                const dx =
                    catX -
                    snake.x;


                const dy =
                    catY -
                    snake.y;


                const dist =
                    Math.max(
                        1,
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        )
                    );


                snake.turnTimer++;


                const aggression =
                    Math.min(
                        .92,
                        .18 +
                        round * .008
                    );


                const chaseX =
                    (dx / dist) *
                    aggression;


                const chaseY =
                    (dy / dist) *
                    aggression;


                snake.dx +=
                    chaseX * .08;


                snake.dy +=
                    chaseY * .08;


                if (
                    snake.turnTimer >
                    Math.max(
                        10,
                        65 -
                        round * .35
                    )
                ) {

                    const randomAngle =
                        Math.random() *
                        Math.PI *
                        2;


                    snake.dx +=
                        Math.cos(
                            randomAngle
                        ) * .35;


                    snake.dy +=
                        Math.sin(
                            randomAngle
                        ) * .35;


                    snake.turnTimer = 0;

                }


                const currentSpeed =
                    Math.sqrt(
                        snake.dx *
                        snake.dx +
                        snake.dy *
                        snake.dy
                    ) || 1;


                const targetSpeed =
                    snake.speed;


                snake.dx =
                    (snake.dx /
                        currentSpeed) *
                    targetSpeed;


                snake.dy =
                    (snake.dy /
                        currentSpeed) *
                    targetSpeed;


                snake.x +=
                    snake.dx;


                snake.y +=
                    snake.dy;


                if (
                    snake.x <= 5 ||
                    snake.x >= width - 50
                ) {

                    snake.dx *= -1;


                    snake.x =
                        Math.max(
                            5,
                            Math.min(
                                snake.x,
                                width - 50
                            )
                        );

                }


                if (
                    snake.y <= 5 ||
                    snake.y >= height - 40
                ) {

                    snake.dy *= -1;


                    snake.y =
                        Math.max(
                            5,
                            Math.min(
                                snake.y,
                                height - 40
                            )
                        );

                }


                snake.element.style.left =
                    `${snake.x}px`;


                snake.element.style.top =
                    `${snake.y}px`;

            }
        );

    }


    /* =========================================================
       COLLISIONS
    ========================================================= */

    function objectsCollide(
        x1,
        y1,
        w1,
        h1,
        x2,
        y2,
        w2,
        h2
    ) {

        return (

            x1 <
            x2 + w2 &&

            x1 + w1 >
            x2 &&

            y1 <
            y2 + h2 &&

            y1 + h1 >
            y2

        );

    }


    function checkAppleCollisions() {

        for (
            let i =
                apples.length - 1;

            i >= 0;

            i--
        ) {

            const apple =
                apples[i];


            const size =
                apple.size ||
                30;


            if (
                objectsCollide(

                    catX,

                    catY,

                    cat.offsetWidth *
                    .75,

                    cat.offsetHeight *
                    .75,

                    apple.x,

                    apple.y,

                    size,

                    size

                )
            ) {

                apple.element.remove();


                apples.splice(
                    i,
                    1
                );


                appleCount++;


                score +=
                    APPLE_POINTS;


                if (
                    score >
                    highScore
                ) {

                    highScore =
                        score;


                    localStorage.setItem(
                        STORAGE.highScore,
                        String(highScore)
                    );


                    playSound(
                        "high"
                    );

                } else {

                    playSound(
                        "apple"
                    );

                }


                vibrate(18);


                updateDisplay();


                if (
                    appleCount >=
                    getAppleGoal()
                ) {

                    completeRound();

                    return;

                }

            }

        }

    }


    function checkSnakeCollisions() {

        if (lifeHitCooldown) return;


        for (
            const snake of snakes
            ) {

            const bodyLength =
                getSnakeLength();


            const snakeWidth =
                42 +
                Math.min(
                    120,
                    bodyLength * 5
                );


            if (
                objectsCollide(

                    catX,

                    catY,

                    cat.offsetWidth *
                    .72,

                    cat.offsetHeight *
                    .72,

                    snake.x -
                    snakeWidth +
                    42,

                    snake.y,

                    snakeWidth,

                    35

                )
            ) {

                loseLife();

                return;

            }

        }

    }


    /* =========================================================
       LIVES
    ========================================================= */

    function loseLife() {

        if (
            !gameRunning ||
            gamePaused ||
            lifeHitCooldown
        ) {

            return;

        }


        lifeHitCooldown =
            true;


        lives--;


        updateDisplay();


        playSound(
            "life"
        );


        vibrate(120);


        stopMovement();


        positionCatAtStart();


        cat.style.opacity =
            ".35";


        if (lives <= 3) {

            cat.style.filter =
                "drop-shadow(2px 3px 2px rgba(0,0,0,.25)) grayscale(.2)";

        }


        setTimeout(
            () => {

                cat.style.opacity =
                    "1";


                lifeHitCooldown =
                    false;

            },
            700
        );


        if (lives <= 0) {

            setTimeout(
                endGame,
                400
            );

        } else {

            setTimeout(
                () =>
                    playSound(
                        "warning"
                    ),
                120
            );

        }

    }


    /* =========================================================
       ROUND MESSAGES
    ========================================================= */

    function getRoundMessage(
        targetRound
    ) {

        if (
            roundNotes[targetRound]
        ) {

            return roundNotes[
                targetRound
                ];

        }


        if (targetRound >= 21) {

            const pool =
                round21to100;


            const candidates =
                pool.filter(
                    note =>
                        note !==
                        lastRoundNote
                );


            const note =
                candidates[
                    Math.floor(
                        Math.random() *
                        candidates.length
                    )
                    ] ||
                pool[0];


            lastRoundNote =
                note;


            return note;

        }


        return "You made it! 🐱";

    }


    /* =========================================================
       ROUND COMPLETE
    ========================================================= */

    function completeRound() {

        if (
            !gameRunning ||
            roundTransition
        ) {

            return;

        }


        gameRunning =
            false;


        roundTransition =
            true;


        stopMovement();


        clearObjectsOnly();


        recordHistory(
            round,
            score
        );


        const message =
            getRoundMessage(
                round
            );


        if (roundTitle) {

            roundTitle.textContent =
                `🏆 ROUND ${round} COMPLETE! 🏆`;

        }


        if (roundNote) {

            roundNote.textContent =
                settings.messages
                    ? message
                    : "Round complete! 🐱";

        }


        updateBadgeUI();


        playSound(
            "win"
        );


        vibrate(
            [50,30,80]
        );


        if (roundComplete) {

            roundComplete.style.display =
                "flex";

        }


        if (settings.effects) {

            setTimeout(
                () => {

                    createFireworks();

                    playSound(
                        "fireworks"
                    );

                },
                650
            );

        }

    }


    /* =========================================================
       NEXT ROUND
    ========================================================= */

    function nextRound() {

        round++;


        roundTransition =
            false;


        gameRunning =
            true;


        gamePaused =
            false;


        if (roundComplete) {

            roundComplete.style.display =
                "none";

        }


        if (pauseScreen) {

            pauseScreen.style.display =
                "none";

        }


        if (pauseButton) {

            pauseButton.textContent =
                "⏸️ Pause";

        }


        updateDisplay();


        positionCatAtStart();


        createRound();


        playSound(
            "round"
        );


        vibrate(35);


        startMusic();

    }


    /* =========================================================
       GAME OVER
    ========================================================= */

    function getGameOverMessage(
        targetRound
    ) {

        if (
            targetRound >= 71
        ) {

            const pool =
                highRoundRoasts.filter(
                    x =>
                        x !==
                        lastGameOverNote
                );


            const raw =
                pool[
                    Math.floor(
                        Math.random() *
                        pool.length
                    )
                    ] ||
                highRoundRoasts[0];


            lastGameOverNote =
                raw;


            return raw.replaceAll(
                "{round}",
                targetRound
            );

        }


        let pool;


        if (
            targetRound <= 10
        ) {

            pool =
                gameOverNotes.slice(
                    0,
                    6
                );

        } else if (
            targetRound <= 30
        ) {

            pool =
                gameOverNotes.slice(
                    0,
                    13
                );

        } else {

            pool =
                gameOverNotes;

        }


        const candidates =
            pool.filter(
                note =>
                    note !==
                    lastGameOverNote
            );


        const note =
            candidates[
                Math.floor(
                    Math.random() *
                    candidates.length
                )
                ] ||
            pool[0];


        lastGameOverNote =
            note;


        return note;

    }


    /* =========================================================
       END GAME
    ========================================================= */

    function endGame() {

        if (
            !gameRunning &&
            !roundTransition
        ) {

            return;

        }


        const finalScoreValue =
            score;


        const finalRoundValue =
            round;


        gameRunning =
            false;


        gamePaused =
            false;


        roundTransition =
            true;


        stopMovement();


        clearObjectsOnly();


        stopMusic();


        recordHistory(
            finalRoundValue,
            finalScoreValue
        );


        if (
            finalScoreValue >
            highScore
        ) {

            highScore =
                finalScoreValue;


            localStorage.setItem(
                STORAGE.highScore,
                String(highScore)
            );

        }


        const note =
            getGameOverMessage(
                finalRoundValue
            );


        if (gameOverNote) {

            gameOverNote.textContent =
                settings.messages
                    ? note
                    : "GAME OVER";

        }


        if (finalRound) {

            finalRound.innerHTML =

                `Final Score:
            <strong>
                ${finalScoreValue}
            </strong>
            pts
            <br>

            Round Reached:
            <strong>
                ${finalRoundValue}
            </strong>

            <br>

            🏆 High Score:
            <strong>
                ${highScore}
            </strong>`;

        }


        playSound(
            "gameover"
        );


        vibrate(
            [100,50,150]
        );


        if (gameOverScreen) {

            gameOverScreen.style.display =
                "flex";

        }


        if (settings.effects) {

            setTimeout(
                () => {

                    createGameOverEffect();

                },
                700
            );

        }


        updateSettingsScore();


        /* Current run resets */

        score = 0;

        appleCount = 0;


        updateDisplay();

    }


    /* =========================================================
       GAME OVER EFFECT
    ========================================================= */

    function createGameOverEffect() {

        if (!settings.effects) return;


        const effect =
            document.createElement(
                "div"
            );


        effect.className =
            "meowpleFirework";


        effect.textContent =
            "💥";


        effect.style.left =
            `${35 +
            Math.random() * 30}%`;


        effect.style.top =
            `${30 +
            Math.random() * 30}%`;


        game.appendChild(
            effect
        );


        setTimeout(
            () =>
                effect.remove(),
            1200
        );

    }


    /* =========================================================
       FIREWORKS
    ========================================================= */

    function createFireworks() {

        if (!settings.effects) return;


        const icons = [
            "✨",
            "🎆",
            "⭐",
            "💫",
            "🎉"
        ];


        for (
            let i = 0;
            i < 12;
            i++
        ) {

            setTimeout(
                () => {

                    const f =
                        document.createElement(
                            "div"
                        );


                    f.className =
                        "meowpleFirework";


                    f.textContent =
                        icons[
                            Math.floor(
                                Math.random() *
                                icons.length
                            )
                            ];


                    f.style.left =
                        `${10 +
                        Math.random() *
                        80}%`;


                    f.style.top =
                        `${10 +
                        Math.random() *
                        70}%`;


                    game.appendChild(
                        f
                    );


                    setTimeout(
                        () =>
                            f.remove(),
                        1200
                    );

                },
                i * 80
            );

        }

    }


    /* =========================================================
       PAUSE
    ========================================================= */

    function togglePause() {

        if (!gameRunning) return;


        gamePaused =
            !gamePaused;


        if (gamePaused) {

            stopMovement();


            if (pauseScreen) {

                pauseScreen.style.display =
                    "flex";

            }


            if (pauseButton) {

                pauseButton.textContent =
                    "▶️ Resume";

            }

        } else {

            if (pauseScreen) {

                pauseScreen.style.display =
                    "none";

            }


            if (pauseButton) {

                pauseButton.textContent =
                    "⏸️ Pause";

            }


            startMusic();

        }


        playSound(
            "click"
        );

    }


    /* =========================================================
       RESTART
    ========================================================= */

    function restartGame() {

        stopMovement();

        stopMusic();


        gameRunning =
            false;


        gamePaused =
            false;


        roundTransition =
            false;


        clearObjectsOnly();


        score =
            0;


        lives =
            STARTING_LIVES;


        round =
            1;


        appleCount =
            0;


        lifeHitCooldown =
            false;


        cat.style.opacity =
            "1";


        cat.style.filter =
            "drop-shadow(2px 3px 2px rgba(0,0,0,.25))";


        updateDisplay();


        positionCatAtStart();


        if (roundComplete) {

            roundComplete.style.display =
                "none";

        }


        if (pauseScreen) {

            pauseScreen.style.display =
                "none";

        }


        if (gameOverScreen) {

            gameOverScreen.style.display =
                "none";

        }


        if (startScreen) {

            startScreen.style.display =
                "flex";

        }


        if (pauseButton) {

            pauseButton.textContent =
                "⏸️ Pause";

        }

    }


    /* =========================================================
       BADGES
       20
       50
       80
       110
       140
       170
       200
       etc.
    ========================================================= */

    function getBadgeForRound(r) {

        if (r >= 200) {

            return {
                icon: "👑",
                name: "MYTHIC RUSH",
                round: 200
            };

        }


        if (r >= 170) {

            return {
                icon: "🔥",
                name: "INFERNO RUSH",
                round: 170
            };

        }


        if (r >= 140) {

            return {
                icon: "✨",
                name: "STAR RUSH",
                round: 140
            };

        }


        if (r >= 110) {

            return {
                icon: "👑",
                name: "ROYAL RUSH",
                round: 110
            };

        }


        if (r >= 80) {

            return {
                icon: "💎",
                name: "DIAMOND RUSH",
                round: 80
            };

        }


        if (r >= 50) {

            return {
                icon: "🏆",
                name: "CHAMPION RUSH",
                round: 50
            };

        }


        if (r >= 20) {

            return {
                icon: "🥉",
                name: "FIRST RUSH",
                round: 20
            };

        }


        return null;

    }


    function updateBadgeUI() {

        const badge =
            $("meowpleBadge");


        if (!badge) return;


        const info =
            getBadgeForRound(
                round
            );


        if (!info) {

            badge.innerHTML =
                `
            <span
                class="meowpleBadgeMini">
                🐾
            </span>

            <span>
                NO BADGE
            </span>
            `;

            return;

        }


        badge.innerHTML =
            `
        <span
            class="meowpleBadgeMini">
            ${info.icon}
        </span>

        <span>
            ${info.name}
        </span>
        `;


        if (
            round >= info.round &&
            highestBadgeRound <
            info.round
        ) {

            highestBadgeRound =
                info.round;


            localStorage.setItem(
                STORAGE.badge,
                String(
                    highestBadgeRound
                )
            );


            badge.classList.remove(
                "pop"
            );


            void badge.offsetWidth;


            badge.classList.add(
                "pop"
            );


            playSound(
                "badge"
            );


            vibrate(
                [50,40,100]
            );


            showToast(
                `${info.icon}
            ${info.name}
            UNLOCKED!`
            );

        }

    }


    /* =========================================================
       MOVEMENT
    ========================================================= */

    const movement = {

        up: false,

        down: false,

        left: false,

        right: false

    };


    document.addEventListener(
        "keydown",
        event => {

            const key =
                event.key.toLowerCase();


            const keys = [

                "arrowup",

                "arrowdown",

                "arrowleft",

                "arrowright",

                "w",

                "a",

                "s",

                "d",

                " "

            ];


            if (
                keys.includes(key)
            ) {

                event.preventDefault();

            }


            if (
                key === "arrowup" ||
                key === "w"
            ) {

                movement.up =
                    true;

            }


            if (
                key === "arrowdown" ||
                key === "s"
            ) {

                movement.down =
                    true;

            }


            if (
                key === "arrowleft" ||
                key === "a"
            ) {

                movement.left =
                    true;

            }


            if (
                key === "arrowright" ||
                key === "d"
            ) {

                movement.right =
                    true;

            }


            if (
                key === " " &&
                gameRunning
            ) {

                togglePause();

            }

        }
    );


    document.addEventListener(
        "keyup",
        event => {

            const key =
                event.key.toLowerCase();


            if (
                key === "arrowup" ||
                key === "w"
            ) {

                movement.up =
                    false;

            }


            if (
                key === "arrowdown" ||
                key === "s"
            ) {

                movement.down =
                    false;

            }


            if (
                key === "arrowleft" ||
                key === "a"
            ) {

                movement.left =
                    false;

            }


            if (
                key === "arrowright" ||
                key === "d"
            ) {

                movement.right =
                    false;

            }

        }
    );


    function stopMovement() {

        movement.up =
            false;


        movement.down =
            false;


        movement.left =
            false;


        movement.right =
            false;


        cat.classList.remove(
            "moving"
        );

    }


    /* =========================================================
       MOBILE MOVEMENT BUTTONS
    ========================================================= */

    function setupMoveButton(
        button,
        direction
    ) {

        if (!button) return;


        const startMove =
            event => {

                event.preventDefault();


                if (
                    !gameRunning ||
                    gamePaused
                ) {

                    return;

                }


                movement[
                    direction
                    ] = true;


                button.classList.add(
                    "active"
                );

            };


        const stopMove =
            event => {

                event.preventDefault();


                movement[
                    direction
                    ] = false;


                button.classList.remove(
                    "active"
                );

            };


        button.addEventListener(
            "touchstart",
            startMove,
            {
                passive: false
            }
        );


        button.addEventListener(
            "touchend",
            stopMove,
            {
                passive: false
            }
        );


        button.addEventListener(
            "touchcancel",
            stopMove,
            {
                passive: false
            }
        );


        button.addEventListener(
            "mousedown",
            startMove
        );


        button.addEventListener(
            "mouseup",
            stopMove
        );


        button.addEventListener(
            "mouseleave",
            stopMove
        );


        button.addEventListener(
            "pointerdown",
            startMove
        );


        button.addEventListener(
            "pointerup",
            stopMove
        );


        button.addEventListener(
            "pointercancel",
            stopMove
        );

    }


    setupMoveButton(
        upButton,
        "up"
    );


    setupMoveButton(
        downButton,
        "down"
    );


    setupMoveButton(
        leftButton,
        "left"
    );


    setupMoveButton(
        rightButton,
        "right"
    );


    document.addEventListener(
        "touchmove",
        event => {

            if (
                event.target.closest(
                    "#mobileControls"
                )
            ) {

                event.preventDefault();

            }

        },
        {
            passive: false
        }
    );


    /* =========================================================
       BUTTON EVENTS
    ========================================================= */

    function bindButton(
        button,
        handler
    ) {

        if (button) {

            button.addEventListener(
                "click",
                handler
            );

        }

    }


    /*
       IMPORTANT:

       Settings buttons are created dynamically.
       Therefore we bind them AFTER
       createDynamicUI().
    */

    function bindAllButtons() {

        bindButton(
            startButton,
            startGame
        );


        bindButton(
            nextRoundButton,
            nextRound
        );


        bindButton(
            restartButton,
            restartGame
        );


        bindButton(
            restartGameButton,
            startGame
        );


        bindButton(
            pauseButton,
            togglePause
        );


        bindButton(
            resumeButton,
            togglePause
        );


        /* SETTINGS */

        bindButton(
            $("meowpleSettingsButton"),
            openSettings
        );


        bindButton(
            $("meowpleDone"),
            closeSettings
        );


        bindButton(
            $("meowpleResetHistory"),
            resetHistory
        );


        /* SETTINGS TOGGLES */

        bindButton(
            $("meowpleSoundToggle"),
            () =>
                toggleSetting("sound")
        );


        bindButton(
            $("meowpleMusicToggle"),
            () =>
                toggleSetting("music")
        );


        bindButton(
            $("meowpleVibrationToggle"),
            () =>
                toggleSetting("vibration")
        );


        bindButton(
            $("meowpleMessagesToggle"),
            () =>
                toggleSetting("messages")
        );


        bindButton(
            $("meowpleEffectsToggle"),
            () =>
                toggleSetting("effects")
        );


        const settingsOverlay =
            $("meowpleSettingsOverlay");


        if (settingsOverlay) {

            settingsOverlay.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        settingsOverlay
                    ) {

                        closeSettings();

                    }

                }
            );

        }

    }


    /* =========================================================
       RESIZE
    ========================================================= */

    window.addEventListener(
        "resize",
        () => {

            keepCatInsideGame();

            updateCatPosition();


            const width =
                getGameWidth();


            const height =
                getGameHeight();


            snakes.forEach(
                snake => {

                    snake.x =
                        Math.max(
                            5,
                            Math.min(
                                snake.x,
                                Math.max(
                                    5,
                                    width - 50
                                )
                            )
                        );


                    snake.y =
                        Math.max(
                            5,
                            Math.min(
                                snake.y,
                                Math.max(
                                    5,
                                    height - 40
                                )
                            )
                        );


                    snake.element.style.left =
                        `${snake.x}px`;


                    snake.element.style.top =
                        `${snake.y}px`;

                }
            );

        }
    );


    /* =========================================================
       INITIALIZE
    ========================================================= */

    createDynamicUI();

    /*
       Bind buttons AFTER the dynamic Settings
       interface has been created.
    */

    bindAllButtons();

    updateDisplay();

    positionCatAtStart();

    restartGame();

})();