/**
 * Symulacja zagrania tury przez gracza grającego polityką MCTS2.
 */
import {State} from '../State/State'
import {Piece} from "../../Objects/Piece";
import {Agent} from "../Agent/Agent";

export class MCTS_State2 {

    private startState: State;
    private sims: number;

    //mapa rezultatów - kluczem jest przesunięcie figury w nowe miejsce, a wartością - liczba zwycięstw i zagrań
    private result: Map<string, [number, number]>;
    private dataRes: Map<string, [Piece, [number, number]]>;

    //liczba iteracji w każdej symulacji
    private SAFE_BORDER = 100;
    //prawdopodobieństwo zachłannego ruchu przeciwnika
    private PLAYER_GREEDY = 0.8;
    //prawdopodobieństwo zachłannego ruchu agenta
    private MCTS_GREEDY = 0.5;
    // kara za porażkę
    private LOSE_PUN = 1;
    // kara za remis
    private DRAW_PUN = 0.3;
    //czy w przypadku dążenia do remisu wybierać ruch zachłanny
    private GET_GREEDY = true;
    //epsilon dla powyższej opcji
    private GREEDY_EPS = 0.1;
    //odrzucenie rzadkich wyników, zaburzających wynik MCTSa
    private MOVE_EPS = 0.01;


    /**
     * Konstruktor.
     * @param startState stan startowy
     * @param sims liczba symulacji
     */
    constructor(startState: State, sims: number) {
        this.startState = startState.copy();
        this.sims = sims;
        this.result = new Map<string, [number, number]>();
        this.dataRes = new Map<string, [Piece, [number, number]]>();
    }

    /**
     * Przeprowadza określoną liczbę symulacji startując z wyznaczonego stanu.
     */
    simulate() {
        for (let i = 0; i < this.sims; ++i) {
            var st = this.startState.copy();
            var currentPlayer = st.get_playing_agent();
            currentPlayer.updateState();
            currentPlayer.computeLegalMoves();
    //        console.log(currentPlayer.legalMoves);
            var possiblePiecesLen = Object.keys(currentPlayer.legalMoves).length;
            var chosenPieceIndex = Math.floor(Math.random() * (possiblePiecesLen + 1));
            if (chosenPieceIndex >= possiblePiecesLen) {
                chosenPieceIndex = possiblePiecesLen -1;
            }
            var pieceKey = Object.keys(currentPlayer.legalMoves)[chosenPieceIndex];
            var possibleMoves = currentPlayer.legalMoves[pieceKey];
            let chosenPiece = currentPlayer.getPieceByName(pieceKey);

            var possibleMovesLen = Object.keys(possibleMoves).length;
            var chosenMoveIndex = Math.floor(Math.random() * (possibleMovesLen + 1));
            if (chosenMoveIndex >= possibleMovesLen) {
                chosenMoveIndex = possibleMovesLen -1;
            }
            var moveKey = Object.keys(possibleMoves)[chosenMoveIndex];
            var chosenMove = possibleMoves[moveKey];

            // rozważyć inne symulacje
            currentPlayer.updateState();
            var res = this.greedy_simulation(st, chosenPiece, chosenMove);

            var cur = this.result.get(chosenPiece.toString())
            if(typeof cur !== "undefined") {
               cur[1]++;
               if (res == 0) {
                   cur[0] = cur[0] - this.DRAW_PUN;
               } else if (res < 0) {
                   cur[0] = cur[0] - this.LOSE_PUN;
               }
               this.result.set(chosenPiece.toString(), cur);
            } else {
                this.result.set(chosenPiece.toString(), [ res > 0 ? 1 : 0, 1]);
                this.dataRes.set(chosenPiece.toString(), [chosenPiece, chosenMove]);
            }

            console.log(i);
        }
    }

    /**
     * Symulacja opierająca się o zachłanną symulację.
     * @param st
     * @param chosenPiece wybrana figura
     * @param chosenMove wybrany ruch
     */
    private greedy_simulation(st:State, chosenPiece : Piece, chosenMove : [number, number]) : number {
        // console.log(chosenPiece);
        // console.log(chosenMove);
        let state = st;
        let mainTeam = state.playingTeam;
        let iter = 0;

        state = state.next_state(chosenPiece, chosenMove);

        while(state.getEndState() == 0) {
        //    state.switchTurn();
            let mv;
            state.get_playing_agent().updateState();
            if (state.get_playing_agent().team == 1) {
                if (Math.random() <= this.PLAYER_GREEDY) {
                    mv = state.get_playing_agent().greedy_move();
                } else {
                    mv = state.get_playing_agent().random_move();
                }
            } else {
                if (Math.random() <= this.MCTS_GREEDY) {
                    mv = state.get_playing_agent().greedy_move();
                } else {
                    mv = state.get_playing_agent().random_move();
                }
            }
            state = state.next_state(mv[0], mv[1]);
            if (iter >= this.SAFE_BORDER) {
                break;
            }
            ++iter;
        }

        if (state.playingTeam == mainTeam) {
            return state.getEndState();
        } else {
            return (-1) * state.getEndState();
        }
    }

    /**
     * Pobiera najlepszy ruch
     */
    public getBestMove() : [Piece, [number, number]] {
        var curBest = -1;
        let piece;

        let k = this.result.keys();
        var res = k.next();
        while(!res.done) {
            var curObj = this.result.get(res.value);
            if (curObj[1] >= this.MOVE_EPS * this.sims) {
                console.log(res.value + "  " + curObj[0] + "/" + curObj[1]);
                var curVal = curObj[0] / curObj[1];
                if (curVal > curBest) {
                    curBest = curVal;
                    piece = res.value;
                }
            }
            res = k.next();
        }
        if (this.GET_GREEDY) {
            if (this.DRAW_PUN - curVal < this.GREEDY_EPS) {
                let mov = this.startState.get_playing_agent().greedy_move();
                return [mov[0], mov[1]];
            }
            return this.dataRes.get(piece);
        } else {
            return this.dataRes.get(piece);
        }
    }
}
