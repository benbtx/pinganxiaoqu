
<script>
export default {
  name: 'PoliceDispose',
  render(h) {
    return (
      <div class="list-h">
        <ul class="list-ul">
          {
            this.disposeList.map((o) => {
              return (
                <li>
                  <p class="ls-title">【{o.type}】{o.area}</p>
                  <p>{o.time}&nbsp;{o.detail}&emsp;状态：{o.status}</p>
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  },
  data() {
    return {
      disposeList: [
        {
          type: '抢劫',
          area: '成都市高新区',
          time: '2018-05-05 00:23:03',
          detail:
            '华阳大道221号御府花都B区-东门门口发生抢劫案件，造成1人受伤，涉案金额20000余元。',
          status: '接警'
        },
        {
          type: '盗窃',
          area: '成都市双流区',
          time: '2018-05-05 05:25:03',
          detail: '牧华路889号双流万达广场发生盗窃事件，涉案金额50000多元。',
          status: '处置中'
        },
        {
          type: '诈骗',
          area: '成都市锦江区',
          time: '2018-05-05 09:06:56',
          detail:
            '静安路368号雅郡电梯公寓B座雅郡商务酒店发生诈骗事件，涉案金额30000多元。',
          status: '上报'
        }
      ]
    };
  }
};
</script>

<style lang="stylus" scoped>
.list-h {
  flex: 1;
  overflow: auto;
}

ul.list-ul {
}

ul.list-ul > li {
  display: block;
  margin-top: 5px;
}

ul.list-ul > li p {
  display: flex;
  line-height: 24px;
}

ul.list-ul > li p.ls-title {
  color: #64e6e7;
}
</style>