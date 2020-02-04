//https://www.researchgate.net/publication/220194771_Reinforcement_learning_for_training_a_computer_program_of_Chinese_chess
//https://www.researchgate.net/publication/221049395_Temporal_Difference_Learning_in_Chinese_Chess


import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { StateFeatureExtractor } from '../State/StateFeatureExtractor'
import { Evaluation } from '../_Param/Evaluation'
import { Reorder } from '../Reorder/Reorder'

export class TDLearner2 extends Reorder {
    strategy = 7;
    weights = [];
    curr_state_fea_vec = [];

    constructor(team: number, myPieces, depth, weights) {
        super(team, myPieces, depth);
        var my_weights = weights.slice(0, 3);
        this.weights = my_weights;
    }

    static copyFromDict(dict) {
        var weights = dict.weights.slice(0, 3);
        return new TDLearner2(dict.team, this.piecesFromDict(dict.myPieces), dict.DEPTH, weights);
    }

    getValueOfState(state: State) {
        var score_vec = [];
        var playing = state.get_playing_agent();
        if (!playing.boardState) playing.updateBoardState();
        playing.updatePieceDict();
        if (!playing.myPiecesDic['k']) return playing.team * Infinity;
        playing.oppoAgent.updatePieceDict();
        if (!playing.oppoAgent.myPiecesDic['k']) return playing.team * (-Infinity);
        playing.computeLegalMoves();
        playing.oppoAgent.updateBoardState();
        playing.oppoAgent.computeLegalMoves();

        var fea_vec = this.extract_state_feature(state.redAgent, state, state.blackAgent);
        for (var i = 0; i < fea_vec.length; i++) score_vec.push(fea_vec[i] * this.weights[i]);
        var score = score_vec.reduce((x, y) => x + y);
        return score + this.getValueOfAgent(state.redAgent, state) - this.getValueOfAgent(state.blackAgent, state);
    }

    // return state feature for agent
    extract_state_feature(agent, state, oppo) {
        var fea_vec = this.extract_agent_feature(agent, state);
        var black_vec = this.extract_agent_feature(oppo, state);
        for (var i = 0; i < fea_vec.length; i++) fea_vec[i] -= black_vec[i];
        return fea_vec;
    }

    // extract feature vector of current state for agent
    // tylko atak
    extract_agent_feature(agent, state) {
        var num_threat = this.get_num_threatening(agent, state);
        var num_capture = this.get_num_captures(agent, state);
        var num_cannon = StateFeatureExtractor.num_center_cannon(agent) + StateFeatureExtractor.num_bottom_cannon(agent)''
        var feature_vec = [num_threat, num_capture, num_cannon];
        return feature_vec;
    }

    num_piece_moves(agent, piece_name) {
        var moves = agent.myPiecesDic[piece_name];
        if (!moves) return 0;
        return moves.length;
    }

    get_num_threatening(agent: Agent, state: State) {
        var n = 0;
        // console.log("agent.oppoAgent.myPiecesDic:", agent.oppoAgent.myPiecesDic)
        var oppoKing = agent.oppoAgent.myPiecesDic['k'].toString();
        for (var pieceName in agent.legalMoves) {
            for (var i in agent.legalMoves[pieceName]) {
                var move = agent.legalMoves[pieceName][i].toString();
                if (move == oppoKing) {
                    n++;
                    break;
                }
            }
        }
        return n;
    }

    // return number of pieces that can capture the oppo piece
    get_num_captures(agent: Agent, state: State) {
        var n = 0;
        for (var pieceName in agent.legalMoves) {
            for (var i in agent.legalMoves[pieceName]) {
                var move: string = agent.legalMoves[pieceName][i].toString();
                if (this.is_capture_move(agent, pieceName, move)) n++;
            }
        }
        return n;
    }


}
