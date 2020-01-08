/**
 * Strategia wyuczonego TD.
 */
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { EvalFnAgent } from '../EvalFn/EvaluationFn'
import { Evaluation } from '../_Param/Evaluation'

export class TDLearnerTrained2 extends EvalFnAgent {
    strategy = 12;

    copy() { return new TDLearnerTrained2(this.team, this.DEPTH, this.myPieces.map(x => x.copy()), this.copyMoves()); }



}
