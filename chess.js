/* =========================================================
   DARSHAN CHESS
   V2 — MOBILE + DESKTOP
   Difficulty corrected: EASY < MEDIUM < HARD
   Last computer move remains highlighted.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    if (typeof Chess === "undefined") {
        const status = document.getElementById("game-status");
        if (status) status.textContent = "Chess engine could not be loaded.";
        console.error("Chess.js library failed to load.");
        return;
    }

    const PIECES = {
        p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
        P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
    };

    const VALUE = {
        p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000
    };

    const boardEl = document.getElementById("chess-board");
    const statusEl = document.getElementById("game-status");
    const levelNumberEl = document.getElementById("chess-level");
    const levelNameEl = document.getElementById("chess-level-name");
    const newGameBtn = document.getElementById("new-game");
    const undoBtn = document.getElementById("undo-move");
    const diffEasyBtn = document.getElementById("diff-easy");
    const diffMediumBtn = document.getElementById("diff-medium");
    const diffHardBtn = document.getElementById("diff-hard");

    let game = new Chess();
    let selectedSquare = null;
    let difficulty = "easy";
    let lastComputerMove = null;
    let computerThinking = false;
    let thinkingTimer = null;

    function setStatus(text) {
        if (statusEl) statusEl.textContent = text;
    }

    function createBoard() {
        if (!boardEl) return;

        boardEl.innerHTML = "";
        const boardState = game.board();

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const squareEl = document.createElement("div");
                const squareName = String.fromCharCode(97 + col) + (8 - row);
                const isLight = (row + col) % 2 === 0;

                squareEl.className = `chess-square ${isLight ? "light" : "dark"}`;
                squareEl.dataset.square = squareName;
                squareEl.setAttribute("role", "gridcell");

                if (lastComputerMove) {
                    if (squareName === lastComputerMove.from) {
                        squareEl.classList.add("last-computer-move");
                    }
                    if (squareName === lastComputerMove.to) {
                        squareEl.classList.add("last-computer-move-to");
                    }
                }

                const piece = boardState[row][col];

                if (piece) {
                    const pieceEl = document.createElement("span");
                    pieceEl.className = "chess-piece";
                    const symbol = piece.color === "w"
                        ? piece.type.toUpperCase()
                        : piece.type.toLowerCase();
                    pieceEl.textContent = PIECES[symbol];
                    squareEl.appendChild(pieceEl);
                }

                if (
                    game.in_check() &&
                    piece &&
                    piece.type === "k" &&
                    piece.color === game.turn()
                ) {
                    squareEl.classList.add("in-check");
                }

                squareEl.addEventListener("pointerup", event => {
                    event.preventDefault();
                    handleSquareClick(squareName);
                }, { passive: false });

                boardEl.appendChild(squareEl);
            }
        }

        updateStatus();
    }

    function handleSquareClick(square) {
        if (game.game_over() || computerThinking || game.turn() !== "w") return;

        if (selectedSquare === null) {
            const piece = game.get(square);
            if (piece && piece.color === "w") {
                selectedSquare = square;
                highlightSquare(square);
                showLegalMoves(square);
            }
            return;
        }

        const move = tryPlayerMove(selectedSquare, square);

        if (!move) {
            const piece = game.get(square);

            if (piece && piece.color === "w") {
                clearHighlights();
                selectedSquare = square;
                highlightSquare(square);
                showLegalMoves(square);
                return;
            }

            selectedSquare = null;
            clearHighlights();
            return;
        }

        selectedSquare = null;
        clearHighlights();
        createBoard();

        if (!game.game_over()) {
            computerThinking = true;
            setStatus("Computer thinking...");
            thinkingTimer = setTimeout(() => {
                thinkingTimer = null;
                makeComputerMove();
            }, 250);
        }
    }

    function tryPlayerMove(from, to) {
        try {
            return game.move({ from, to, promotion: "q" });
        } catch (error) {
            return null;
        }
    }

    function highlightSquare(square) {
        const element = boardEl.querySelector(`[data-square="${square}"]`);
        if (element) element.classList.add("selected");
    }

    function showLegalMoves(square) {
        game.moves({ square, verbose: true }).forEach(move => {
            const target = boardEl.querySelector(`[data-square="${move.to}"]`);
            if (!target) return;
            target.classList.add(move.captured ? "possible-capture" : "possible-move");
        });
    }

    function clearHighlights() {
        boardEl.querySelectorAll(".chess-square").forEach(square => {
            square.classList.remove("selected", "possible-move", "possible-capture");
        });
    }

    /* =========================================================
       COMPUTER AI
       EASY  = intentionally weak / mostly random
       MEDIUM = one-ply strategic choice with controlled variety
       HARD = alpha-beta search, 2 plies deep
       ========================================================= */

    function makeComputerMove() {
        try {
            if (game.game_over()) return;

            const moves = game.moves({ verbose: true });
            if (!moves.length) return;

            let selectedMove;

            if (difficulty === "easy") {
                selectedMove = chooseEasyMove(moves);
            } else if (difficulty === "medium") {
                selectedMove = chooseMediumMove(moves);
            } else {
                selectedMove = chooseHardMove(moves);
            }

            if (!selectedMove) {
                selectedMove = moves[Math.floor(Math.random() * moves.length)];
            }

            const result = game.move(selectedMove);

            if (result) {
                lastComputerMove = {
                    from: result.from,
                    to: result.to
                };
            }
        } catch (error) {
            console.error("Computer move error:", error);

            const fallbackMoves = game.moves({ verbose: true });
            if (fallbackMoves.length) {
                const fallback = fallbackMoves[Math.floor(Math.random() * fallbackMoves.length)];
                const result = game.move(fallback);
                if (result) {
                    lastComputerMove = {
                        from: result.from,
                        to: result.to
                    };
                }
            }
        } finally {
            computerThinking = false;
            createBoard();
        }
    }

    /* EASY: do not automatically grab every available capture.
       Prefer quiet moves and deliberately introduce mistakes. */
    function chooseEasyMove(moves) {
        const quietMoves = moves.filter(move => !move.captured);
        const pool = quietMoves.length ? quietMoves : moves;

        // Most easy moves are simply random. A small preference for quiet
        // moves makes the level less tactically dangerous than Medium.
        return pool[Math.floor(Math.random() * pool.length)];
    }

    /* MEDIUM: evaluate each move one ply and choose from the best few.
       This is stronger than Easy, but still has enough randomness to feel human. */
    function chooseMediumMove(moves) {
        const scored = moves.map(move => {
            game.move(move);
            const score = evaluatePosition() + positionalMoveBonus(move);
            game.undo();
            return { move, score };
        });

        scored.sort((a, b) => b.score - a.score);

        const topCount = Math.max(1, Math.min(4, Math.ceil(scored.length * 0.20)));
        const top = scored.slice(0, topCount);

        return top[Math.floor(Math.random() * top.length)].move;
    }

    /* HARD: black is the maximizing side. Search the computer move and
       the player's reply with alpha-beta pruning. */
    function chooseHardMove(moves) {
        let bestScore = -Infinity;
        let bestMoves = [];
        let alpha = -Infinity;
        const beta = Infinity;

        for (const move of moves) {
            game.move(move);
            const score = minimax(1, false, alpha, beta);
            game.undo();

            if (score > bestScore) {
                bestScore = score;
                bestMoves = [move];
            } else if (score === bestScore) {
                bestMoves.push(move);
            }

            alpha = Math.max(alpha, bestScore);
        }

        return bestMoves.length
            ? bestMoves[Math.floor(Math.random() * bestMoves.length)]
            : moves[0];
    }

    function minimax(depth, maximizingBlack, alpha, beta) {
        if (depth === 0 || game.game_over()) {
            return evaluatePosition();
        }

        const moves = game.moves({ verbose: true });

        if (maximizingBlack) {
            let best = -Infinity;

            for (const move of moves) {
                game.move(move);
                best = Math.max(best, minimax(depth - 1, false, alpha, beta));
                game.undo();
                alpha = Math.max(alpha, best);
                if (beta <= alpha) break;
            }

            return best;
        }

        let best = Infinity;

        for (const move of moves) {
            game.move(move);
            best = Math.min(best, minimax(depth - 1, true, alpha, beta));
            game.undo();
            beta = Math.min(beta, best);
            if (beta <= alpha) break;
        }

        return best;
    }

    function evaluatePosition() {
        if (game.in_checkmate()) {
            // At the position being evaluated, the side to move is checkmated.
            return game.turn() === "w" ? 999999 : -999999;
        }

        if (game.in_draw()) return 0;

        let score = 0;
        const board = game.board();

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (!piece) continue;

                const value = VALUE[piece.type] || 0;
                const sign = piece.color === "b" ? 1 : -1;
                score += sign * value;

                // Small centre-control bonus.
                const centerDistance = Math.abs(3.5 - col) + Math.abs(3.5 - row);
                const centerBonus = Math.max(0, 4 - centerDistance) * 4;
                score += sign * centerBonus;

                // Reward developed minor pieces and active pawns slightly.
                if (piece.type === "n" || piece.type === "b") {
                    const development = piece.color === "b"
                        ? Math.max(0, row - 0)
                        : Math.max(0, 7 - row);
                    score += sign * development * 2;
                }
            }
        }

        // Mobility matters, but not enough to overpower material.
        const mobility = game.moves().length;
        score += game.turn() === "b" ? mobility * 2 : -mobility * 2;

        if (game.in_check()) {
            score += game.turn() === "w" ? 35 : -35;
        }

        return score;
    }

    function positionalMoveBonus(move) {
        let bonus = 0;

        if (move.captured) {
            bonus += (VALUE[move.captured] || 0) * 0.8;
            bonus += 40;
        }

        const toFile = move.to.charCodeAt(0) - 97;
        const toRank = Number(move.to[1]);
        const centerDistance = Math.abs(3.5 - toFile) + Math.abs(4.5 - toRank);
        bonus += Math.max(0, 4 - centerDistance) * 6;

        if (move.san && move.san.includes("+")) bonus += 60;
        if (move.san && move.san.includes("#")) bonus += 10000;

        return bonus;
    }

    function updateStatus() {
        if (game.in_checkmate()) {
            setStatus(game.turn() === "w" ? "Checkmate! Black wins." : "Checkmate! You win!");
            return;
        }

        if (game.in_draw()) {
            setStatus("Draw game!");
            return;
        }

        if (game.in_check()) {
            setStatus(game.turn() === "w" ? "Your turn — IN CHECK!" : "Computer is in check!");
            return;
        }

        setStatus(game.turn() === "w" ? "Your turn" : "Computer's turn");
    }

    function setDifficulty(selected) {
        difficulty = selected;

        diffEasyBtn.classList.toggle("active", selected === "easy");
        diffMediumBtn.classList.toggle("active", selected === "medium");
        diffHardBtn.classList.toggle("active", selected === "hard");

        const levels = {
            easy: ["1", "EASY"],
            medium: ["2", "MEDIUM"],
            hard: ["3", "HARD"]
        };

        levelNumberEl.textContent = levels[selected][0];
        levelNameEl.textContent = levels[selected][1];
    }

    diffEasyBtn.addEventListener("click", () => setDifficulty("easy"));
    diffMediumBtn.addEventListener("click", () => setDifficulty("medium"));
    diffHardBtn.addEventListener("click", () => setDifficulty("hard"));

    newGameBtn.addEventListener("click", () => {
        if (thinkingTimer) {
            clearTimeout(thinkingTimer);
            thinkingTimer = null;
        }

        game.reset();
        selectedSquare = null;
        lastComputerMove = null;
        computerThinking = false;
        clearHighlights();
        createBoard();
    });

    undoBtn.addEventListener("click", () => {
        if (computerThinking) return;

        const history = game.history();
        if (!history.length) return;

        game.undo();
        if (game.history().length > 0) game.undo();

        selectedSquare = null;
        lastComputerMove = null;
        computerThinking = false;
        clearHighlights();
        createBoard();
    });

    setDifficulty("easy");
    createBoard();
});
