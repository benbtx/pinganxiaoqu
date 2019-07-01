<template>
  <div class="list-h">
    <ul class="list-ul">
      <li>
        <p>
          <span>【金牛区】下周</span>
          <span class="emphasis">抢劫</span>
          <span>类警情</span>
          <span class="big-sym sym-down"></span>

        </p>
      </li>
      <li>
        <p>
          <span>【成华区】下周</span>
          <span class="emphasis">抢夺</span>
          <span>类警情</span>
          <span class="big-sym sym-up"></span>
        </p>
      </li>
      <li>
        <p>
          <span>【青羊区】下周</span>
          <span class="emphasis">入室盗窃</span>
          <span>类警情</span>
          <span class="big-sym sym-up"></span>
        </p>
      </li>
      <li>
        <p>
          <span>【武侯区】下周</span>
          <span class="emphasis">扒窃</span>
          <span>类警情</span>
          <span class="big-sym sym-down"></span>
        </p>
      </li>
      <li>
        <p>
          <span>【锦江区】下周</span>
          <span class="emphasis">盗窃机动车</span>
          <span>类警情</span>
          <span class="big-sym sym-down"></span>
        </p>
      </li>
      <li>
        <p>
          <span>【新都区】下周</span>
          <span class="emphasis">盗窃电动自行车</span>
          <span>类警情</span>
          <span class="big-sym sym-up"></span>
        </p>
      </li>
      <li>
        <p>
          <span>【龙泉驿区】下周</span>
          <span class="emphasis">盗窃车内财物</span>
          <span>类警情</span>
          <span class="big-sym sym-up"></span>
        </p>
      </li>
      <li>
        <p>
          <span>【温江区】下周</span>
          <span class="emphasis">诈骗</span>
          <span>类警情</span>
          <span class="big-sym sym-down"></span>
        </p>
      </li>
      <li>
        <p>
          <span>【青羊区】下周</span>
          <span class="emphasis">入室盗窃</span>
          <span>类警情</span>
          <span class="big-sym sym-up"></span>
        </p>
      </li>
      <li>
        <p>
          <span>【武侯区】下周</span>
          <span class="emphasis">扒窃</span>
          <span>类警情</span>
          <span class="big-sym sym-down"></span>
        </p>
      </li>
      <li>
        <p>
          <span>【锦江区】下周</span>
          <span class="emphasis">盗窃机动车</span>
          <span>类警情</span>
          <span class="big-sym sym-down"></span>
        </p>
      </li>

    </ul>

  </div>

</template>

<script>
export default {
  name: 'PoliceForesee'
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
}

ul.list-ul > li p {
  display: flex;
  line-height: 26px;
  letter-spacing: 1px;
}

ul.list-ul > li p span {
  display: block;
}

.emphasis {
  color: #eb4c46;
}

.decrese {
  color: #3dcc80;
}

.big-sym {
  width: 20px;
  height: 26px;
  text-align: center;
  font-size: 16rem;
  font-family: fontawesome;
}
.big-sym.sym-up:after {
  color: #eb4c46;
  content: '\f176'
}
.big-sym.sym-down:after {
  color: #3dcc80;
  content: '\f175'
}
</style>