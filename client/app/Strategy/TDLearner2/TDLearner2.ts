/**
 * Nasza Strategia ucząca TD.
 */
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { EvalFnAgent } from '../EvalFn/EvaluationFn'
import { Evaluation } from '../_Param/Evaluation'

export class TDLearner2 extends EvalFnAgent {
    strategy = 7;
    weights = [];
    feature_matrix = [];

    constructor(team: number, depth = 2, weights, myPieces = null, pastMoves = []) {
        super(team, depth, myPieces, pastMoves);
        this.weights = weights;
    }

    copy() {
        return new TDLearner2(this.team, this.DEPTH, this.weights, this.myPieces.map(x => x.copy()), this.copyMoves());
    }

    merge_arr(x, y) {
        var r = [];
        for (var i = 0; i < x.length; i++) r.push(x[i] + y[i]);
        return r;
    }


    // result: 1-red win | -1:red lose
    //tylko atak
    update_weights(nSimulations, result) {
        if (result == 0) return this.weights;
        result *= this.team;
        // consolidate features vectors throught whole game into one
        var accu_fea = this.feature_matrix.reduce(this.merge_arr);
        accu_fea = accu_fea.map(x => x / this.feature_matrix.length)
        var last_fea = this.feature_matrix[this.feature_matrix.length - 1];
        console.log("this.feature_matrix[0].length:", this.feature_matrix[0].length);
        console.log("nSimulations:", nSimulations);
        var learning_rate = 1 / Math.sqrt(nSimulations);
        var gamma = 0.6;
        var tetta = 0.3;
        console.log("learning_rate:", learning_rate)
        for (var i = 0; i < this.feature_matrix[0].length; i++) {
            this.weights[i] += learning_rate * (result + gamma * accu_fea[i] + tetta * last_fea[i] - this.weights[i]);
        }
        console.log("UPDATED WEIGHT:", this.weights)
        console.log("------==================-------");
        return this.weights;
    }

    save_state(feature_vec) {
        this.feature_matrix.push(feature_vec);
    }
}
