
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { StateFeatureExtractor } from '../State/StateFeatureExtractor'
import { Evaluation } from '../_Param/Evaluation'
import { TDLearner2 } from './TDLearner2'
import { Reorder } from '../Reorder/Reorder'

export class TDLearnerTrained2 extends TDLearner2 {
    strategy = 8;
    weights = [0, 1, 2, 4, 8, 3, 1];

    //
    // static copyFromDict(dict) {
    //     return new TDLearnerTrained2(dict.team, this.piecesFromDict(dict.myPieces), dict.DEPTH, this.weights);
    // }


}
