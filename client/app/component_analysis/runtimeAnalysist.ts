import {Component} from '@angular/core'

@Component({
    selector: 'runtimeAnalysist',
    templateUrl: '../client/app/component_analysis/runtimeAnalysist.html',
    styleUrls: ['../client/app/component_analysis/runtimeAnalysist.css', '../client/app/component_analysis/winRate.css'],
})


export class RuntimeAnalysist {
    //TODO dopisanie naszych klas
    names = [
        'Greedy',
        'Alpha-Beta Pruning',
        'Alpha-Beta Pruning with Move Reorder',
        'Temporal Difference Learning',
        'Temporal Difference Learning (Trained)',
        'Monte Carlo Tree Search',
        'Monte Carlo Tree Search - Nasza implementacja',
        'TD Learning - Nasza implementacja',
        'TD Trained - Nasza implementacja'
    ]
    // INPUT
    runtime_dict;
    // Output
    runtime_arr;

    update(dic) {
        this.runtime_dict = dic;
        this.process()
    }

    process() {
        this.runtime_arr = [];
        for (var k in this.runtime_dict) {
            var strategy = this.names[parseInt(k.split('-')[0])];
            var depth = k.split('-')[1];
            var time = this.runtime_dict[k][0];
            this.runtime_arr.push({'strategy': strategy, 'depth': depth, 'time': time});
        }
    }


    sort_strategy() {
        this.runtime_arr.sort((x, y) => (
            this.names.indexOf(x.strategy) - this.names.indexOf(y.strategy)
        ));
    }

    sort_time() {
        this.runtime_arr.sort((x, y) => (
            x.time - y.time
        ));
    }

    sort_depth() {
        this.runtime_arr.sort((x, y) => (
            x.depth - y.depth
        ));
    }

}
