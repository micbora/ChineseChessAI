/**
 * Strategia ucząca TD.
 */
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { EvalFnAgent } from '../EvalFn/EvaluationFn'
import { Evaluation } from '../_Param/Evaluation'

export class TDLearner extends EvalFnAgent {
    strategy = 3;
    weights = [];
    feature_matrix = []; //[fea_vec]

    constructor(team: number, depth = 2, weights, myPieces = null, pastMoves = []) {
        super(team, depth, myPieces, pastMoves);
        this.weights = weights;
    }

    copy() {
        return new TDLearner(this.team, this.DEPTH, this.weights, this.myPieces.map(x => x.copy()), this.copyMoves());
    }

    merge_arr(x, y) {
        var r = [];
        for (var i = 0; i < x.length; i++) r.push(x[i] + y[i]);
        return r;
    }


    // result: 1-red win | -1:red lose
    update_weights(nSimulations, result) {
        if (result == 0) return this.weights;
        result *= this.team;
        var accu_fea = this.feature_matrix.reduce(this.merge_arr);
        accu_fea = accu_fea.map(x => x / this.feature_matrix.length)
        var eta = 2 / Math.sqrt(nSimulations); // learning rate
        for (var i = 0; i < accu_fea.length; i++) {
            this.weights[i] += eta * result * (eta * accu_fea[i]);
            this.weights[i] = Math.min(Math.max(this.weights[i], 0), 20);
        }
        console.log("CHINEESE TD UPDATED WEIGHT:", this.weights)
        return this.weights;
    }

    save_state(feature_vec) {
        this.feature_matrix.push(feature_vec);
    }



}
