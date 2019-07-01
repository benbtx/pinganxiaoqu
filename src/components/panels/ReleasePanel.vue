<template>
  <section class="swim-release" v-show="thisShow">
    <div class="ctn-hold spark bordered" style="padding-top:50px">
      <p class="release-tit ctn-head">指令<span style="cursor:pointer;position: absolute;right: 20px;" @click="hideThis">✖</span></p>
      <div class="release-con">
        <div class="group-input">
          <label class="title">指令编号：</label> 
          <div class="cus-content">
            <p class="entry value">{{releaseData.zlbh}}</p>
          </div>
        </div>
        <div class="group-input">
          <label class="title">指令名称：</label> 
          <div class="cus-content cus-input">
            <el-input v-model="releaseData.zlmc" class="dpzy" placeholder="请输入指令名称"></el-input>
          </div>
        </div>
        <div class="group-input">
          <label class="title">风险等级：</label> 
          <div class="cus-content cus-radio">
            <el-radio-group v-model="releaseData.yjjb">
              <el-radio :label="1" >一级</el-radio>
              <el-radio :label="2" >二级</el-radio>
              <el-radio :label="3" >三级</el-radio>
              <el-radio :label="4" >四级</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-for="(item,index) in releaseData.jsdxs" :key="index" class="group-input">
          <label class="title">{{item.groupName}}：</label>
            <!-- <input name='jsdw' type="checkbox" value="活动地公安机关" /><label>活动地公安机关</label>
            <input name='jsdw' type="checkbox" value="户籍地公安机关" /><label>户籍地公安机关</label>
            <input name='jsdw' type="checkbox" value="国保" /><label>国保</label>
            <input name='jsdw' type="checkbox" value="治安" /><label>治安</label>
            <input name='jsdw' type="checkbox" value="经侦" /><label>经侦</label> -->
            <div class="cus-content cus-select">
              <!-- <el-checkbox-group v-model="jsdw" @change="handleCheckedCitiesChange">
                <el-checkbox :label="subitem.dxjgmc" :key="subitem.dxjgmc" :value="subitem.dxjgmc" v-for="subitem in item.jsdxs">
                  {{subitem.dxjgmc}}
                </el-checkbox>
              </el-checkbox-group> -->
              <el-select v-model="jsdw[index].choose" multiple placeholder="请选择">
                <el-option v-for="item in item.jsdxs" :key="item.dxjgmc" :lable="item.dxjgmc" :value="item.dxjgmc">
                </el-option>
              </el-select>
          </div>
        </div>

        <div class="group-input" v-show="releasetype=='td'">
          <label class="title">周边警力：</label> 
          <div class="cus-content cus-radio">
            <el-radio-group v-model="jlfw" @change="changeZbjl">
              <el-radio :label="1000" >一公里</el-radio>
              <el-radio :label="2000" >二公里</el-radio>
              <el-radio :label="5000" >五公里</el-radio>
            </el-radio-group>
          </div>
        </div>

        <div class="group-input" v-show="releasetype=='td'">
            <label class="title"></label>
            <div class="cus-content cus-select">
              <el-select v-model="jsjl.choose" multiple placeholder="请选择">
                <el-option v-for="item in zbjl" :key="item.dxjgmc" :lable="item.dxjgmc" :value="item.dxjgmc">
                </el-option>
              </el-select>
          </div>
        </div>

        <div class="group-input">
          <label class="title">指令内容：</label> 
          <div class="cus-content cus-textarea">
            <textarea rows="5" v-model="releaseData.zlnr" style="color:#fff"></textarea>
          </div>
        </div>
        <div class="group-input">
          <label class="title">发布单位：</label> 
          <div class="cus-content">
            <p class="entry value">{{releaseData.fsrssdwmc}}</p>
          </div>
        </div>
        <div class="group-input">
          <label class="title">发布时间：</label> 
          <div class="cus-content">
            <p class="entry value">{{releaseData.zlsj}}</p>
          </div>
        </div>
        <div class="group-input">
          <label class="title">附件：</label> 
          <div class="cus-content">
            <img :src="item.fjdz" v-for="(item,index) in releaseData.fj "  :key="index" style="float: left;height: 100%; width: 100px; margin-right: 20px;">
          </div>
        </div>
        <!-- <p class="entry key">处置要求：</p>
        <p class="entry value">{{releaseData.zllx}}</p> -->
      </div>
      <div class="btn-con">
        <p class="release-btn btnys">导出</p>
        <p class="release-btn btnys" @click="confirmRelease">确认发送</p>
        <!-- <p class="release-btn" @click="hideThis">取消</p> -->
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue';
// import {passwayApi} from '@/http'
export default {
  name: 'ReleasePanel',
  props: ['releaseProps','releasetype'],
  data() {
    return {
      thisShow: false,
      releaseData: {
        zlbh: '',
        zlmc:'',
        yjjb: '',
        fsrmc: '',
        fsrdm: '',      
        fsrssdwdm: '',
        fsrssdwmc: '',
        zllx: '',
        jsdx: [
          {
            dxdm: '',
            dxmc: '',
            dxjgdm: '',
            dxjgmc: ''
          }
        ],
        zlnr: null,
        fj:[],
        
        zlmc: '',
        zlsj: ''
      },
      lat:'',
      lng:'',
      zbjl:[],    //周边警力
      jlfw:'',    //警力范围
      jsdw:[
        {'choose':[]},
        {'choose':[]},
        {'choose':[]},
        {'choose':[]}
      ],
      jsjl:{'choose':[]},//警力单位选择  
      fxdj:''
      // fj:[{fjdz:''},{fjdz:''}]
    };
  },
  watch: {
    // releaseProps (val) {
    //   // let jsdwinit=[];
    //   // for(var i=0;i<this.releaseProps.jsdxs.length;i++)
    //   // {
    //   //   var item={value:''};
    //   //   jsdwinit.push(item);
    //   // }
    //   // this.jsdw=JSON.parse(JSON.stringify(jsdwinit));
    //   this.releaseData = val.orginInstruct;
    //   this.lat = val.lat;
    //   this.lng = val.lng;
    //   this.zbjl = val.zbjl;
    //   this.jsdw=[
    //     {'choose':[]},
    //     {'choose':[]},
    //     {'choose':[]},
    //     {'choose':[]}
    //   ];
    //   this.jsjl={'choose':[]};
    //   this.jlfw=1000;
    // }
  },
  methods: {
    showThis () {
      this.thisShow = true;
    },
    hideThis () {
      this.thisShow = false;
    },
    changeZbjl(){
      let param = Object.create(null);
        param.lat = this.lat;
        param.lng = this.lng;
        param.radius = this.jlfw;
      return passwayApi
        .getzbjl(param)
        .then(response => {
          // loading.close();
          if(response.data.length!=0)
          { 
            this.zbjl = response.data;
          }
          else{
            this.$alert('经纬度信息为空，无法获取周边警力信息','提示',{
              comfirmButtonText:'确定',
              type:'warning'
            });
          }
        })

    },
    confirmRelease () {
      var temporary =[];
      var temporary1 =[];
      let releasedatacopy=JSON.parse(JSON.stringify(this.releaseData));
      let zbjlcopy = JSON.parse(JSON.stringify(this.zbjl));
      let jsdwarr=[];
      var jlarr = [];
      for(let i=0;i<this.jsdw.length;i++)
      {
        for(let j=0;j<this.jsdw[i].choose.length;j++)
        {
          jsdwarr.push(this.jsdw[i].choose[j]);
        }
      }
      for(var i=0;i<releasedatacopy.jsdxs.length;i++)
      {
        temporary =[];
        for(var z=0;z<releasedatacopy.jsdxs[i].jsdxs.length;z++)
        {
          for(var j=0;j<jsdwarr.length;j++)
          {
            if(releasedatacopy.jsdxs[i].jsdxs[z].dxjgmc==jsdwarr[j])
            {
              temporary.push(releasedatacopy.jsdxs[i].jsdxs[z]);
            }
          }   
        } 
        releasedatacopy.jsdxs[i].jsdxs=temporary;  
      }
        if(this.jsjl.choose.length!=0)
        {
          for(let j=0;j<this.jsjl.choose.length;j++)
          {
            jlarr.push(this.jsjl.choose[j]);
          }
          for(let x=0;x<this.zbjl.jsdxs.length;x++)
          {
            for(let z=0;z<this.jlarr.length;z++)
            {
                if(this.zbjl.jsdxs[x].dxjgmc==jlarr[z])
                {
                  temporary1.push(this.zbjl.jsdxs[x]);
                }
            }
          }
          
        }
        zbjlcopy = temporary1;
  //    this.releaseData.jsdxs=temporary;
    let param = Object.create(null);
        param.orginInstruct = releasedatacopy;
        param.lat = this.lat;
        param.lng = this.lng;
        param.zbjl = zbjlcopy;

      this.$emit("sendZl",param);
    },
    handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        var aa = this.jsdw;
        var bb;
      }
  },
};
</script>

<style lang="stylus" scoped>
.imgdiv{
width: 100%;  
height: 120px;
  }
.swim-release {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 1000px;
  height: 960px;
  left: 50%;
  top: 50%;
  margin-left: -500px;
  margin-top: -480px;
  padding: 20px 0 20px 30px;
  z-index:2000;
}

.bordered {
  border-radius: 10px;
  border: 1px solid #51808a;
}

.group-input {
  line-height: 46px;
}
.group-input .title {
  vertical-align: top;
  width: 140px;
}
.release-con .group-input label {
  color: #dcfffe;
}
.cus-content {
  display: inline-block;
  width: 80%;
}
.cus-input {
  border: 1px solid #18768b;
} 
.cus-radio label {
  margin: 0 5px;
}
.cus-checkbox {
  width: 80%;
  line-height: 24px;
}
.cus-textarea {
  width: 80%;
  height: 130px;
}
.cus-textarea textarea {
  display: inline-block;
  width:100%;
  min-height:100%
  resize: none;
}
.cus-select {
  width:80%;
  background: none;
  margin-bottom: 20px;
}




.release-tit {
  margin: 0 0 12px;
  color: #dcfffe;
  font-size: 18px;
}

.release-con {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 50px;
  font-size: 16rem;
  height: 620px;
  overflow-y: auto;
  .entry {
    line-height: 22px;
  }

  .key {
    color: #82c1ea;
  }

  .value {
    margin-bottom: 14px;
    color: #fff;
  }
  textarea {
    border 1px solid #18768b
    background none
    margin: 0 0 14px
    padding: 8px
    line-height: 24px
  }
}

.btn-con {
  display: flex;
  justify-content: space-around;
  height: 80px;
  padding: 6px 24px;
  margin-bottom: 6px;
  width: 380px;
  margin: 0 auto;

  .release-btn {
    width: 108px;
    height: 42px;
    text-align: center;
    line-height: 42px;
    cursor: pointer;
    color: #fff;
    font-size: 16rem;
  }
}
</style>