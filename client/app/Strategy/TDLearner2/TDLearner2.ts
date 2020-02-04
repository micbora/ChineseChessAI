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
        var my_weights = weights.slice(0, 3);
        this.weights = my_weights;
    }

    copy() {
        var weights = this.weights.slice(0, 3);
        return new TDLearner2(this.team, this.DEPTH, weights, this.myPieces.map(x => x.copy()), this.copyMoves());
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
        // console.log("RESULT: ", result);
        // console.log("weights: ", this.weights);
        // console.log("feature_matrix: ", this.feature_matrix);
        var accu_fea = this.feature_matrix.reduce(this.merge_arr);
        accu_fea = accu_fea.map(x => x / this.feature_matrix.length)
        var last_fea = this.feature_matrix[this.feature_matrix.length - 1];
        // console.log("this.feature_matrix", this.feature_matrix);
        console.log("------==================-------");
        console.log("Last feature vector: ", accu_fea);
        console.log("Last accuracy feature vector: ", last_fea);
        console.log("Number of simulations:", nSimulations);
        var learning_rate = 1 / Math.sqrt(nSimulations);
        var gamma = 0.6;
        var tetta = 0.4;
        console.log("Learning rate:", learning_rate)
        for (var i = 0; i < accu_fea.length; i++) {
            this.weights[i] += learning_rate * (result + gamma * accu_fea[i] + tetta * last_fea[i] - this.weights[i]);
        }
        console.log("UPDATED WEIGHT OUR TDLEARNER:", this.weights);
        console.log("------==================-------");
        return this.weights;
    }

    save_state(feature_vec) {
        this.feature_matrix.push(feature_vec);
    }
}
