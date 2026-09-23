const startButton = document.getElementById("startButton");
const gameContainer = document.querySelector(".game-container");
startButton.addEventListener("click", showTeamSetup);


function showTeamSetup() {

    const teamCount = Number(
        document.getElementById("teamCount").value
    );

    const difficulty =
        document.getElementById("difficulty").value;

    let teams = [];

    for (let i = 0; i < teamCount; i++) {

        teams.push({
            name: `Команда ${i + 1}`,
            players: []
        });

    }

    gameContainer.innerHTML = `
        
        <h1>👥 Настройка команд</h1>

        <p class="subtitle">
            Создайте команды и добавьте игроков
        </p>

        <div id="teamsContainer"></div>

        <div class="players-total">
            Всего игроков:
            <strong id="playersCount">0</strong> / 10
        </div>

        <div class="navigation-buttons">

            <button id="backButton" class="secondary-button">
                ← Назад
            </button>

            <button id="continueButton">
                Продолжить →
            </button>

        </div>

    `;

    const teamsContainer =
        document.getElementById("teamsContainer");

    teams.forEach((team, teamIndex) => {

        const teamElement =
            document.createElement("div");

        teamElement.className = "team-card";

        teamElement.innerHTML = `

            <h2>
                ${getTeamEmoji(teamIndex)}
                Команда ${teamIndex + 1}
            </h2>

            <input
                type="text"
                class="team-name"
                placeholder="Название команды"
                value="Команда ${teamIndex + 1}"
            >

            <div class="players-list"></div>

            <button
                class="add-player-button"
                data-team="${teamIndex}"
            >
                ＋ Добавить игрока
            </button>

        `;

        teamsContainer.appendChild(teamElement);

    });


    document
        .querySelectorAll(".add-player-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const teamIndex =
                        Number(button.dataset.team);

                    addPlayer(
                        teamIndex,
                        teams,
                        updatePlayersCount
                    );

                }
            );

        });


    document
        .getElementById("backButton")
        .addEventListener(
            "click",
            () => location.reload()
        );


    document
        .getElementById("continueButton")
        .addEventListener(
            "click",
            () => {

                if (getTotalPlayers(teams) < 2) {

                    alert(
                        "Добавьте минимум 2 игроков."
                    );

                    return;

                }

                startGame(
                    teams,
                    difficulty
                );

            }
        );


    function updatePlayersCount() {

        document.getElementById(
            "playersCount"
        ).textContent =
            getTotalPlayers(teams);

    }

}


function addPlayer(
    teamIndex,
    teams,
    updatePlayersCount
) {

    if (getTotalPlayers(teams) >= 10) {

        alert(
            "Максимальное количество игроков — 10."
        );

        return;

    }


    const playerName =
        prompt(
            "Введите имя игрока:"
        );


    if (!playerName || !playerName.trim()) {
        return;
    }


    teams[teamIndex].players.push(
        playerName.trim()
    );


    renderPlayers(
        teamIndex,
        teams
    );

    updatePlayersCount();

}


function renderPlayers(
    teamIndex,
    teams
) {

    const teamCards =
        document.querySelectorAll(
            ".team-card"
        );

    const playersList =
        teamCards[
            teamIndex
        ].querySelector(
            ".players-list"
        );


    playersList.innerHTML = "";


    teams[
        teamIndex
    ].players.forEach(
        (player, playerIndex) => {

            const playerElement =
                document.createElement(
                    "div"
                );

            playerElement.className =
                "player-row";


            playerElement.innerHTML = `

                <span>
                    👤 ${player}
                </span>

                <button
                    class="remove-player"
                    data-team="${teamIndex}"
                    data-player="${playerIndex}"
                >
                    🗑️
                </button>

            `;


            playersList.appendChild(
                playerElement
            );

        }
    );


    playersList
        .querySelectorAll(
            ".remove-player"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const team =
                        Number(
                            button.dataset.team
                        );

                    const player =
                        Number(
                            button.dataset.player
                        );


                    teams[
                        team
                    ].players.splice(
                        player,
                        1
                    );


                    renderPlayers(
                        team,
                        teams
                    );


                    document.getElementById(
                        "playersCount"
                    ).textContent =
                        getTotalPlayers(
                            teams
                        );

                }
            );

        });

}


function getTotalPlayers(teams) {

    return teams.reduce(
        (total, team) =>
            total + team.players.length,
        0
    );

}


function getTeamEmoji(index) {

    const emojis = [
        "🔵",
        "🔴",
        "🟢",
        "🟡",
        "🟣"
    ];

    return emojis[index] || "⚪";

}

function startGame(teams, difficulty) {

    gameState.teams = teams;
    gameState.difficulty = difficulty;

    gameState.currentRound = 1;
    gameState.currentTeamIndex = 0;
    gameState.currentPlayerIndex = 0;

    gameState.scoreThisTurn = 0;
    gameState.skippedThisTurn = 0;

    gameState.timeLeft = 60;

    gameState.currentWord = getRandomWord();


    gameContainer.innerHTML = `

        <div class="game-screen">

            <h1>🎮 Alias</h1>

            <div class="game-info">

                <div>
                    Раунд:
                    <strong>
                        ${gameState.currentRound}
                    </strong>
                    / ${gameState.totalRounds}
                </div>

                <div>
                    ⏱️
                    <strong id="timer">
                        60
                    </strong>
                    сек.
                </div>

            </div>


            <div class="current-team">

                <h2>
                    ${getTeamEmoji(gameState.currentTeamIndex)}
                    ${gameState.teams[gameState.currentTeamIndex].name}
                </h2>

                <p>
                    Объясняет:
                    <strong>
                        ${gameState.teams[gameState.currentTeamIndex].players[gameState.currentPlayerIndex]}
                    </strong>
                </p>

            </div>


            <div class="word-card">

                <p class="word-label">
                    Объясните слово:
                </p>

                <div id="currentWord">

                    ${gameState.currentWord}

                </div>

            </div>


            <div class="turn-score">

                Очки за ход:
                <strong id="turnScore">
                    0
                </strong>

            </div>


            <div class="game-buttons">

                <button id="correctButton">

                    ✅ Угадано

                </button>

                <button
                    id="skipButton"
                    class="secondary-button"
                >

                    ⏭ Пропустить

                </button>

            </div>

        </div>

    `;


    document
        .getElementById("correctButton")
        .addEventListener(
            "click",
            () => {

                gameState.scoreThisTurn++;

                document.getElementById(
                    "turnScore"
                ).textContent =
                    gameState.scoreThisTurn;

                gameState.currentWord =
                    getRandomWord();

                document.getElementById(
                    "currentWord"
                ).textContent =
                    gameState.currentWord;

            }
        );


    document
        .getElementById("skipButton")
        .addEventListener(
            "click",
            () => {

                gameState.skippedThisTurn++;

                gameState.currentWord =
                    getRandomWord();

                document.getElementById(
                    "currentWord"
                ).textContent =
                    gameState.currentWord;

            }
        );

}
// ================================
// НАСТРОЙКИ И СОСТОЯНИЕ ИГРЫ
// ================================

let gameState = {
    teams: [],
    difficulty: "easy",

    currentRound: 1,
    totalRounds: 10,

    currentTeamIndex: 0,
    currentPlayerIndex: 0,

    scoreThisTurn: 0,
    skippedThisTurn: 0,

    timer: null,
    timeLeft: 60,

    currentWord: "",
    usedWords: []
};

// ================================
// ВРЕМЕННЫЕ СЛОВА
// ПОКА НЕ ТРОГАЕМ words.json
// ================================
let words = {};

async function loadWords() {

    try {

        const response =
            await fetch("words.json");


        if (!response.ok) {

            throw new Error(
                "Не удалось загрузить words.json"
            );

        }


        words =
            await response.json();


        console.log(
            "Слова успешно загружены:",
            words
        );


    } catch (error) {

        console.error(
            "Ошибка загрузки слов:",
            error
        );


        alert(
            "Не удалось загрузить список слов."
        );

    }

}

loadWords();

// ================================
// КНОПКА «НАЧАТЬ ИГРУ»
// ================================

startButton.addEventListener(
    "click",
    showTeamSetup
);


// ================================
// ЭКРАН НАСТРОЙКИ КОМАНД
// ================================

function showTeamSetup() {

    const teamCount = Number(
        document.getElementById("teamCount").value
    );

    const difficulty =
        document.getElementById("difficulty").value;

    let teams = [];

    for (let i = 0; i < teamCount; i++) {

        teams.push({
    name: `Команда ${i + 1}`,
    players: [],
    score: 0
});

    }


    gameContainer.innerHTML = `

        <h1>👥 Настройка команд</h1>

        <p class="subtitle">
            Создайте команды и добавьте игроков
        </p>

        <div id="teamsContainer"></div>

        <div class="players-total">
            Всего игроков:
            <strong id="playersCount">0</strong> / 10
        </div>

        <div class="navigation-buttons">

            <button id="backButton" class="secondary-button">
                ← Назад
            </button>

            <button id="continueButton">
                Продолжить →
            </button>

        </div>

    `;


    const teamsContainer =
        document.getElementById("teamsContainer");


    teams.forEach((team, teamIndex) => {

        const teamElement =
            document.createElement("div");

        teamElement.className = "team-card";


        teamElement.innerHTML = `

            <h2>
                ${getTeamEmoji(teamIndex)}
                Команда ${teamIndex + 1}
            </h2>

            <input
                type="text"
                class="team-name"
                placeholder="Название команды"
                value="Команда ${teamIndex + 1}"
            >

            <div class="players-list"></div>

            <button
                class="add-player-button"
                data-team="${teamIndex}"
            >
                ＋ Добавить игрока
            </button>

        `;


        teamsContainer.appendChild(
            teamElement
        );

    });


    document
        .querySelectorAll(".add-player-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const teamIndex =
                        Number(button.dataset.team);

                    addPlayer(
                        teamIndex,
                        teams,
                        updatePlayersCount
                    );

                }
            );

        });


    document
        .getElementById("backButton")
        .addEventListener(
            "click",
            () => location.reload()
        );


    document
        .getElementById("continueButton")
        .addEventListener(
            "click",
            () => {

                if (getTotalPlayers(teams) < 2) {

                    alert(
                        "Добавьте минимум 2 игроков."
                    );

                    return;

                }


                // Сохраняем названия команд
                document
                    .querySelectorAll(".team-name")
                    .forEach(
                        (input, index) => {

                            teams[index].name =
                                input.value.trim()
                                || `Команда ${index + 1}`;

                        }
                    );


                // Сохраняем состояние игры

                gameState.teams = teams;
                gameState.difficulty = difficulty;

                gameState.currentRound = 1;
                gameState.currentTeamIndex = 0;
                gameState.currentPlayerIndex = 0;

                gameState.scoreThisTurn = 0;
                gameState.skippedThisTurn = 0;


                startTurn();

            }
        );


    function updatePlayersCount() {

        document.getElementById(
            "playersCount"
        ).textContent =
            getTotalPlayers(teams);

    }

}


// ================================
// ДОБАВЛЕНИЕ ИГРОКА
// ================================

function addPlayer(
    teamIndex,
    teams,
    updatePlayersCount
) {

    if (getTotalPlayers(teams) >= 10) {

        alert(
            "Максимальное количество игроков — 10."
        );

        return;

    }


    const playerName =
        prompt(
            "Введите имя игрока:"
        );


    if (
        !playerName ||
        !playerName.trim()
    ) {

        return;

    }


    teams[teamIndex].players.push(
        playerName.trim()
    );


    renderPlayers(
        teamIndex,
        teams
    );

    updatePlayersCount();

}


// ================================
// ОТОБРАЖЕНИЕ ИГРОКОВ
// ================================

function renderPlayers(
    teamIndex,
    teams
) {

    const teamCards =
        document.querySelectorAll(
            ".team-card"
        );


    const playersList =
        teamCards[
            teamIndex
        ].querySelector(
            ".players-list"
        );


    playersList.innerHTML = "";


    teams[
        teamIndex
    ].players.forEach(
        (player, playerIndex) => {

            const playerElement =
                document.createElement(
                    "div"
                );


            playerElement.className =
                "player-row";


            playerElement.innerHTML = `

                <span>
                    👤 ${player}
                </span>

                <button
                    class="remove-player"
                    data-team="${teamIndex}"
                    data-player="${playerIndex}"
                >
                    🗑️
                </button>

            `;


            playersList.appendChild(
                playerElement
            );

        }
    );


    playersList
        .querySelectorAll(
            ".remove-player"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const team =
                        Number(
                            button.dataset.team
                        );


                    const player =
                        Number(
                            button.dataset.player
                        );


                    teams[
                        team
                    ].players.splice(
                        player,
                        1
                    );


                    renderPlayers(
                        team,
                        teams
                    );


                    document.getElementById(
                        "playersCount"
                    ).textContent =
                        getTotalPlayers(
                            teams
                        );

                }
            );

        });

}


// ================================
// ОБЩЕЕ КОЛИЧЕСТВО ИГРОКОВ
// ================================

function getTotalPlayers(teams) {

    return teams.reduce(
        (total, team) =>
            total + team.players.length,
        0
    );

}


// ================================
// ЭМОДЗИ КОМАНД
// ================================

function getTeamEmoji(index) {

    const emojis = [
        "🔵",
        "🔴",
        "🟢",
        "🟡",
        "🟣"
    ];

    return emojis[index] || "⚪";

}


// ================================
// НАЧАЛО ХОДА ИГРОКА
// ================================

function startTurn() {

    clearInterval(
        gameState.timer
    );


    gameState.timeLeft = 60;

    gameState.scoreThisTurn = 0;

    gameState.skippedThisTurn = 0;


    const team =
        gameState.teams[
            gameState.currentTeamIndex
        ];


    const player =
        team.players[
            gameState.currentPlayerIndex
        ];
        let points = 1;


if (gameState.difficulty === "medium") {
    points = 2;
}


if (gameState.difficulty === "hard") {
    points = 3;
}


    gameContainer.innerHTML = `

        <div class="turn-ready">

            <div class="result-icon">
                🎮
            </div>


            <div class="game-header">

                <div>

                    <span class="round-label">
                        Раунд
                    </span>

                    <strong>
                        ${gameState.currentRound}
                        / ${gameState.totalRounds}
                    </strong>

                </div>

            </div>


            <div class="turn-info">

                <div class="team-title">

                    ${getTeamEmoji(
                        gameState.currentTeamIndex
                    )}

                    ${team.name}

                </div>


                <div class="player-title">

                    👤 ${player}

                </div>

            </div>


            <div class="ready-message">

                <h1>
                    Приготовьтесь!
                </h1>

                <p>
                    Объясняйте слова,
                    не называя их.
                </p>

            <p>
        ⏱️ На ход  <strong>60 секунд</strong>
            </p>

            <p>
        ✅ Угадали  <strong>+${points} ${points === 1 ? "очко" : "очка"}</strong>
            </p>

            <p>
        ❌ Пропустили  <strong>−${points} ${points === 1 ? "очко" : "очка"}</strong>
            </p>

            </div>


            <button id="startTurnButton">

                ▶ НАЧАТЬ ХОД

            </button>

        </div>

    `;


    document
        .getElementById(
            "startTurnButton"
        )
        .addEventListener(
            "click",
            startActualTurn
        );

}

function startActualTurn() {

    const team =
        gameState.teams[
            gameState.currentTeamIndex
        ];


    const player =
        team.players[
            gameState.currentPlayerIndex
        ];


    gameContainer.innerHTML = `

        <div class="game-header">

            <div>

                <span class="round-label">
                    Раунд
                </span>

                <strong>
                    ${gameState.currentRound}
                    / ${gameState.totalRounds}
                </strong>

            </div>


            <div class="timer">

                ⏱️

                <span id="timer">
                    60
                </span>

            </div>

        </div>


        <div class="turn-info">

            <div class="team-title">

                ${getTeamEmoji(
                    gameState.currentTeamIndex
                )}

                ${team.name}

            </div>


            <div class="player-title">

                👤 ${player}

            </div>

        </div>


        <div class="score-info">

            <span>

                За ход:
                <strong id="turnScore">
                    0
                </strong>

            </span>


            <span>

                Пропущено:
                <strong id="skipCount">
                    0
                </strong>

            </span>

        </div>

        <div class="word-card">

            <div id="word">
                Готово?
            </div>

        </div>


        <div class="game-buttons">

            <button
                id="correctButton"
                class="correct-button"
            >

                ✅ УГАДАЛИ

            </button>


            <button
                id="skipButton"
                class="skip-button"
            >

                ❌ ПРОПУСТИТЬ

            </button>

        </div>

    `;


    document
        .getElementById("correctButton")
        .addEventListener(
            "click",
            correctAnswer
        );


    document
        .getElementById("skipButton")
        .addEventListener(
            "click",
            skipWord
        );


    showNextWord();


    startTimer();

}

// ================================
// СЛЕДУЮЩЕЕ СЛОВО
// ================================

function showNextWord() {

    const availableWords =
        words[
            gameState.difficulty
        ];


    if (
        !availableWords ||
        availableWords.length === 0
    ) {

        gameState.currentWord =
            "Нет слов";

        const wordElement =
            document.getElementById(
                "word"
            );

        wordElement.textContent =
            gameState.currentWord;

        return;

    }


    if (
        !gameState.usedWords
    ) {

        gameState.usedWords = [];

    }


    let unusedWords =
        availableWords.filter(
            word =>
                !gameState.usedWords.includes(
                    word
                )
        );


    if (
        unusedWords.length === 0
    ) {

        gameState.usedWords = [];

        unusedWords =
            [...availableWords];

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            unusedWords.length
        );


    gameState.currentWord =
        unusedWords[
            randomIndex
        ];


    gameState.usedWords.push(
        gameState.currentWord
    );


    const wordElement =
        document.getElementById(
            "word"
        );


    /*
       Убираем старую анимацию,
       чтобы она могла запуститься
       снова.
    */

    wordElement.classList.remove(
        "word-changing"
    );


    /*
       Небольшая пауза заставляет
       браузер заново запустить
       animation.
    */

    void wordElement.offsetWidth;


    wordElement.textContent =
        gameState.currentWord;


    wordElement.classList.add(
        "word-changing"
    );

}

// ================================
// ПРАВИЛЬНЫЙ ОТВЕТ
// ================================

function correctAnswer() {

    let points = 1;


    if (gameState.difficulty === "medium") {
        points = 2;
    }


    if (gameState.difficulty === "hard") {
        points = 3;
    }


    gameState.scoreThisTurn += points;


    document.getElementById(
        "turnScore"
    ).textContent =
        gameState.scoreThisTurn;


    showNextWord();

}


// ================================
// ПРОПУСК
// ================================
function skipWord() {

    let points = 1;


    if (gameState.difficulty === "medium") {
        points = 2;
    }


    if (gameState.difficulty === "hard") {
        points = 3;
    }


    gameState.skippedThisTurn++;

    gameState.scoreThisTurn -= points;


    document.getElementById(
        "skipCount"
    ).textContent =
        gameState.skippedThisTurn;


    document.getElementById(
        "turnScore"
    ).textContent =
        gameState.scoreThisTurn;


    showNextWord();

}

// ================================
// ТАЙМЕР
// ================================
function playTimerSound(
    frequency = 700,
    duration = 180
) {

    const audioContext =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();


    const oscillator =
        audioContext.createOscillator();


    const gainNode =
        audioContext.createGain();


    oscillator.connect(
        gainNode
    );


    gainNode.connect(
        audioContext.destination
    );


    oscillator.type =
        "sine";


    oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
    );


    gainNode.gain.setValueAtTime(
        0.08,
        audioContext.currentTime
    );


    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime +
        duration / 1000
    );


    oscillator.start();


    oscillator.stop(
        audioContext.currentTime +
        duration / 1000
    );

}
function playCountdownNote(
    timeLeft
) {

    const notes = {

        5: 523.25,
        4: 587.33,
        3: 659.25,
        2: 783.99,
        1: 1046.50

    };


    const frequency =
        notes[timeLeft];


    if (!frequency) {
        return;
    }


    playTimerSound(
        frequency,
        180
    );

}
function startTimer() {

    const timerElement =
        document.getElementById(
            "timer"
        );


    gameState.timer =
        setInterval(
            () => {

                gameState.timeLeft--;


                timerElement.textContent =
                    gameState.timeLeft;


                // Обычное время

                if (
                    gameState.timeLeft > 30
                ) {

                    timerElement.classList.remove(
                        "timer-warning",
                        "timer-danger"
                    );

                }


                // Осталось 30 секунд или меньше

                else if (
                    gameState.timeLeft > 10
                ) {

                    timerElement.classList.remove(
                        "timer-danger"
                    );

                    timerElement.classList.add(
                        "timer-warning"
                    );

                }


                // Осталось 10 секунд или меньше

else if (
    gameState.timeLeft > 0
) {

    timerElement.classList.remove(
        "timer-warning"
    );

    timerElement.classList.add(
        "timer-danger"
    );


    // Музыка последних 5 секунд

    if (
        gameState.timeLeft <= 5
    ) {

        playCountdownNote(
            gameState.timeLeft
        );

    }

}


                // Время закончилось

                if (
                    gameState.timeLeft <= 0
                ) {

                    clearInterval(
                        gameState.timer
                    );


                    timerElement.textContent =
                        "0";


                    // Звук окончания времени

                    playTimerSound(
    392,
    600
);

setTimeout(
    () => {

        playTimerSound(
            523.25,
            400
        );

    },
    180
);


                    finishTurn();

                }

            },
            1000
        );

}

// ================================
// КОНЕЦ ХОДА
// ================================

function finishTurn() {

    clearInterval(
        gameState.timer
    );


    const team =
        gameState.teams[
            gameState.currentTeamIndex
        ];


    team.score +=
        gameState.scoreThisTurn;


    showTurnResult();

}


// ================================
// РЕЗУЛЬТАТ ХОДА
// ================================

function showTurnResult() {

    const team =
        gameState.teams[
            gameState.currentTeamIndex
        ];


    const player =
        team.players[
            gameState.currentPlayerIndex
        ];


    gameContainer.innerHTML = `

        <div class="result-screen">

            <div class="result-icon">
                ⏰
            </div>

            <h1>
                Время вышло!
            </h1>

            <p class="subtitle">
                ${getTeamEmoji(
                    gameState.currentTeamIndex
                )}
                ${team.name}
                — ${player}
            </p>


            <div class="turn-result-card">

                <div>
                    <span>
                        Угадано
                    </span>

                    <strong>
                        ${gameState.scoreThisTurn}
                    </strong>
                </div>


                <div>
                    <span>
                        Пропущено
                    </span>

                    <strong>
                        ${gameState.skippedThisTurn}
                    </strong>
                </div>


                <div>
                    <span>
                        Всего у команды
                    </span>

                    <strong>
                        ${team.score}
                    </strong>
                </div>

            </div>


            <button id="nextTurnButton">
                ➡ Следующий игрок
            </button>

        </div>

    `;


    document
        .getElementById(
            "nextTurnButton"
        )
        .addEventListener(
            "click",
            nextTurn
        );

}


// ================================
// ПЕРЕХОД К СЛЕДУЮЩЕМУ ИГРОКУ
// ================================
function nextTurn() {

    // Переходим к следующей команде
    gameState.currentTeamIndex++;


    // Если есть ещё команды в текущем раунде
    if (
        gameState.currentTeamIndex <
        gameState.teams.length
    ) {

        const nextTeam =
            gameState.teams[
                gameState.currentTeamIndex
            ];


        // Игрок выбирается в зависимости от номера раунда

        gameState.currentPlayerIndex =
            (gameState.currentRound - 1) %
            nextTeam.players.length;


        startTurn();

        return;

    }


    // Все команды сыграли текущий раунд

    gameState.currentTeamIndex = 0;

    finishRound();

}
// ================================
// КОНЕЦ РАУНДА
// ================================

function finishRound() {

    if (
        gameState.currentRound >=
        gameState.totalRounds
    ) {

        showFinalResults();

        return;

    }


    showRoundResult();

}


// ================================
// РЕЗУЛЬТАТ РАУНДА
// ================================

function showRoundResult() {

    const sortedTeams =
        [...gameState.teams]
            .sort(
                (a, b) =>
                    b.score - a.score
            );


    let scoresHTML = "";


    sortedTeams.forEach(
        (team, index) => {

            const originalIndex =
                gameState.teams.indexOf(
                    team
                );


            scoresHTML += `

                <div class="score-row">

                    <span>
                        ${getTeamEmoji(
                            originalIndex
                        )}
                        ${team.name}
                    </span>

                    <strong>
                        ${team.score}
                    </strong>

                </div>

            `;

        }
    );


    gameContainer.innerHTML = `

        <div class="round-result">

            <div class="result-icon">
                🎉
            </div>

            <h1>
                Раунд
                ${gameState.currentRound}
                завершён
            </h1>


            <div class="scores-table">

                ${scoresHTML}

            </div>


            <button id="nextRoundButton">
                ➡ Следующий раунд
            </button>

        </div>

    `;


   document
    .getElementById(
        "nextRoundButton"
    )
    .addEventListener(
        "click",
        () => {

            gameState.currentRound++;

            gameState.currentTeamIndex = 0;


            const firstTeam =
                gameState.teams[0];


            gameState.currentPlayerIndex =
                (gameState.currentRound - 1) %
                firstTeam.players.length;


            startTurn();

        }
    );

}


// ================================
// ФИНАЛЬНЫЙ РЕЗУЛЬТАТ
// ================================
function getPointsWord(number) {

    const absoluteNumber =
        Math.abs(number);

    const lastTwoDigits =
        absoluteNumber % 100;

    const lastDigit =
        absoluteNumber % 10;


    if (
        lastTwoDigits >= 11 &&
        lastTwoDigits <= 14
    ) {

        return "очков";

    }


    if (lastDigit === 1) {

        return "очко";

    }


    if (
        lastDigit >= 2 &&
        lastDigit <= 4
    ) {

        return "очка";

    }


    return "очков";

}
function showFinalResults() {

    const sortedTeams =
        [...gameState.teams]
            .sort(
                (a, b) =>
                    b.score - a.score
            );


    let scoresHTML = "";


    sortedTeams.forEach(
        (team, index) => {

            const originalIndex =
                gameState.teams.indexOf(
                    team
                );


            scoresHTML += `

                <div class="final-score-row">

                    <span>

                        ${index === 0
                            ? "🏆"
                            : `${index + 1}.`
                        }

                        ${getTeamEmoji(originalIndex)}

                        ${team.name}

                    </span>


                    <strong>

                        ${team.score}
${" " + getPointsWord(team.score)}

                    </strong>

                </div>

            `;

        }
    );


    gameContainer.innerHTML = `

        <div class="final-screen">

            <div class="result-icon">
                🏆
            </div>


            <h1>
                Игра окончена!
            </h1>


            <p class="subtitle">
                Результаты после
                ${gameState.totalRounds}
                раундов
            </p>


            <div class="final-scores">

                ${scoresHTML}

            </div>


            <div class="final-buttons">

                <button id="newGameButton">

                    🔄 Новая игра

                </button>


                <button
                    id="settingsButton"
                    class="secondary-button"
                >

                    ⚙️ Изменить настройки

                </button>

            </div>

        </div>

    `;


    document
        .getElementById(
            "newGameButton"
        )
        .addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Начать новую игру? Текущие результаты будут сброшены."
                    );


                if (!confirmed) {
                    return;
                }


                location.reload();

            }
        );


    document
        .getElementById(
            "settingsButton"
        )
        .addEventListener(
            "click",
            () => {

                location.reload();

            }
        );

}
// ========================================
// ИГРОВОЙ ПРОЦЕСС
// ========================================

function getRandomWord() {

    const availableWords = words[gameState.difficulty];

    if (!availableWords || availableWords.length === 0) {

        return "Нет слов";

    }

    const randomIndex =
        Math.floor(Math.random() * availableWords.length);

    return availableWords[randomIndex];

}