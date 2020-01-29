
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { StateFeatureExtractor } from '../State/StateFeatureExtractor'
import { MCTS_State2 } from './MCTS_State2'

export class MCTS2 extends Agent {

    strategy = 6;
    N_SIMULATION;

    constructor(team, pieces, N) {
        super(team, pieces);
        this.N_SIMULATION = N;
    }

    static copyFromDict(dict) {
        return new MCTS2(dict.team, this.piecesFromDict(dict.myPieces), dict.N_SIMULATION);
    }


    // return [piece:Piece, toPos];
    comptuteNextMove(state) {
        var root = new MCTS_State2(state, this.N_SIMULATION);
        root.simulate();
        return root.getBestMove();
    }


    copy(): Agent {
        var cp = super.copy();
        cp.strategy = this.strategy;
        return cp;
    }
}
