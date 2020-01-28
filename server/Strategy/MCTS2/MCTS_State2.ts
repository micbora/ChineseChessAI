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
    private result: Map<[Piece, [number, number]], [number, number]>;

    private SAFE_BORDER = 1000;


    /**
     * Konstruktor.
     * @param startState stan startowy
     * @param sims liczba symulacji
     */
    constructor(startState: State, sims: number) {
        this.startState = startState.copy();
        this.sims = sims;
        this.result = new Map<[Piece, [number, number]], [number, number]>();
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
            var chosenPiece = currentPlayer.getPieceByName(pieceKey);

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

            if(this.result.has([chosenPiece, chosenMove])) {
               var cur = this.result.get([chosenPiece, chosenMove])
               cur[1]++;
               if (res > 0) {
                   cur[0]++;
               }
               this.result.set([chosenPiece, chosenMove], cur);
            } else {
                this.result.set([chosenPiece, chosenMove], [ res > 0 ? 1 : 0, 1]);
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
        var state = st;
        var mainTeam = state.playingTeam;
        var iter = 0;

        state.get_playing_agent().movePieceTo(chosenPiece, chosenMove);

        while(state.getEndState() == 0) {
            state.switchTurn();
            if (Math.random() <= 0.55) {
            state.get_playing_agent().random_move();
            } else {
                state.get_playing_agent().greedy_move();
            }

            if (iter >= this.SAFE_BORDER) {
                break;
            }
            ++iter;
        }

        if (state.playingTeam == mainTeam) {
            return state.getEndState();
        } else {
            return -state.getEndState();
        }
    }

    public getBestMove() : [Piece, [number, number]] {
        var curBest = -1;
        var piece;
        var move;

        let k = this.result.keys();
        var res = k.next();
        while(!res.done) {
            var curObj = this.result.get(res.value);
            var curVal = curObj[0]/curObj[1];
            if (curVal > curBest) {
                curBest = curVal;
                piece = res.value[0];
                move = res.value[1];
            }
            res = k.next();
        }
        return [piece, move]

    }
}
