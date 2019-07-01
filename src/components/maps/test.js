
import { mapVar } from '@/components/maps/variable.js';
import { topoAnalysis } from '@/components/maps/topoAnalysis.js';

export const T = {
    tWoker: function () {
        let urlStr = 'http://80.2.30.20:10086/hub/getCircle';
        $.ajax({
            url: urlStr,
            type: 'get',
            data: { lat: '30.65049', lng: '104.06296', radius: 1000 },
            dataType: 'text',
            success: (data) => {
                data = JSON.parse(data);

                this.addJl(data.jlList);
                this.addTw(data.twList);
                this.addWf(data.wifiList);

                //this.handleData();
            },
            error: function (err) {
                _this.$message({
                    message: "连接服务器失败！",
                    type: "warning"
                });
            }
        });
    },
    addJl: function (data) {
        if (data.length > 0)
            data.forEach(atm => {
                let ptCord = new Point(parseFloat(atm.lng), parseFloat(atm.lat));
                let strHtml1 = '<div ><img style="height:18px;width:18px;" src="' + mapVar.imgFactory.jl + '"/> </div>';
                // let strHtml1 = '<div style="height:2px;width:2px;background-color:rgb(255,255,0)"> </div>';
                let marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [9, 9]);
                 mapVar.mapInstance.map.addOverlay(marker);
            });
    },
    addTw: function (data) {
        if (data.length > 0)
            data.forEach(atm => {
                let ptCord = new Point(parseFloat(atm.lng), parseFloat(atm.lat));
                let strHtml1 = '<div ><img style="height:18px;width:18px;" src="' + mapVar.imgFactory.tw + '"/> </div>';
                // let strHtml1 = '<div style="height:2px;width:2px;background-color:rgb(255,255,0)"> </div>';
                let marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [9, 9]);
                 mapVar.mapInstance.map.addOverlay(marker);
            });
    },
    addWf: function (data) {
        if (data.length > 0)
            data.forEach(atm => {
                let ptCord = new Point(parseFloat(atm.lng), parseFloat(atm.lat));
                let strHtml1 = '<div ><img style="height:18px;width:18px;" src="' + mapVar.imgFactory.wifi + '"/> </div>';
                // let strHtml1 = '<div style="height:2px;width:2px;background-color:rgb(255,255,0)"> </div>';
                let marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [9, 9]);
                 mapVar.mapInstance.map.addOverlay(marker);
            });
    },

    handleData: function (data) {

        // var worker = new Worker('/components/maps/worker.js');
        // worker.postMessage(5);
        // worker.onmessage = function (event) {
        data.forEach(atm => {
            let ptCord = new Point(parseFloat(atm.lng), parseFloat(atm.lat));
            let strHtml1 = '<div style="height:2px;width:2px;background-color:rgb(255,255,0)"><img style="height:10px;width:10px;" src="' + mapVar.imgFactory.tw + '"/> </div>';
            // let strHtml1 = '<div style="height:2px;width:2px;background-color:rgb(255,255,0)"> </div>';
            let marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [5, 5]);
             mapVar.mapInstance.map.addOverlay(marker);
        });
        // worker.terminate();
        // };
    },

    test: function () {

        //let layername = '(JWZH_NBDWBW_JYZ_PT JWZH_ZAGL_YLCS_PT JWZH_ZAGL_WLJDHY_PT JWZH_ZAGL_WBZLSCS_PT JWZH_ZAGL_LD_PT JWZH_ZAGL_WB_PT JWZH_FKFB_YLJZDW_PT JWZH_DWXX_DZJG_PT JWZH_DWXX_JY_PT JWZH_DWXX_QSYDW_PT DWXX_GAJG_PT JWZH_BZDZ_JLX_PT JWZH_BZDZ_MP_PT JWZH_BZDZ_LP_PT CS_GGHDCS_PT CS_JTCS_PT CS_YLCS_PT CS_SMCS_PT CS_LYCS_PT CS_TYCS_PT CS_WHCS_PT CS_JMFWCS_PT CS_HLWSWFWYYCS_PT CS_ZJCS_PT CS_ZSFWCS_PT CS_CYFWCS_PT CS_TSHYFWCS_PT CS_BNCS_PT SX_DZSX_PT SX_DZSXFSSS_PT JMDJSS_DZJMD_PT JMDJSS_DZJZW_PT JT_DZJTSS_PT GX_DZGX_PT DM_DZDM_PT JT_XZJTSS_QL_PT JT_XZJTSS_SD_PT)';
        let layername = '';
        var queryType = 'FQ'; //查询类型：全文检索
        //var queryType = 'PY'; //查询类型：全文检索
        var method = 'FULL'; //查询方法：全文查询
        var scope = '_FULLTEXT'; //查询范围：所有字段
        var spaceQueryStr = '';
        var where = 'LAYERNAME:' + layername;
        var parameter =
            'type=' +
            queryType +
            '&method=' +
            method +
            '&scope=' +
            scope +
            '&keywords=' + n +
            '&filterCustom=' +
            where +
            '&pageIndex=0&pageSize=10' +
            spaceQueryStr;
        var _this = this;
        DemoApp.EzPOISearch_sc(parameter, (data) => {
            console.log(data);
        })

    },
     


    onMessage : function (data) {

        //处理
        console.log(' here is test.js' + data);
        var d = ' data dealed with worker';
        postMessage(d);
    
    }

}



