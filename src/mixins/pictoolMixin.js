import  {excontrolApi} from "@/https";
export const pictoolMixin = {
  data() {
    return {
      dialogpiccrop: false, //图片裁剪框的显示
      imgsrc:"",//裁剪图片源
      dialogpiclarge:false,//图片放大框显示
      largeimg:"",//放大图片源
    }
  },
  methods: {
    showlargeimg(src){
      this.dialogpiclarge=true;
      this.largeimg=src;
    },
    startpiccrop(src) {
       let para={
         imageUrl:src
       };
       return excontrolApi
        .getimgbase64(para)
        .then(res => res.data)
        .then(data => {
           this.imgsrc=data;
           this.dialogpiccrop = true;
           this.$nextTick(()=>{
           this.$refs.piccrop.initcrop();
          });
        });
    },   
  }
}