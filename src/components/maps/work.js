

import { topoAnalysis } from '@/components/maps/topoAnalysis.js';

onmessage = function (data) {

    //处理
    console.log(' here is test.js' + data);
    var d = ' data dealed with worker';
    postMessage(d);

}