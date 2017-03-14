<template>
  <transition  name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
         <img :src="food.image" alt="">
         <div class="back" @click="hideFlag">
           <i class="icon-arrow_lift"></i>
         </div>

       </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
          <div class="price">
            <span class="now">¥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
          </div>
          <div class="buy"
              @click="addFirst"
              v-show="!food.count||food.count===0">加入购物车</div>
          <div class="cartcontrol-wrapper">
           <cartcontrol :food="food"
                        @target="receiveTarget"></cartcontrol>
         </div>
        </div>
        <split></split>
        <div class="info" v-show="food.info">
          <div class="title">
            商品信息
          </div>
          <p class="text">
            {{food.info}}
          </p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect
            :select-type="selectType"
            :only-content="onlyContent"
            :desc="desc"
            @sendType="receiveType"
            @sendContent="receiveContent"
            :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-for="rating in food.ratings"
                  class="rating-item"
                  v-show="needShow(rating.rateType,rating.text)">
                <div class="user">
                  <span class="name">
                    {{rating.username}}
                  </span>
                  <img class="avatar" :src="rating.avatar" alt="">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,
                  'icon-thumb_down':rating.rateType===1}">
                  </span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">暂无评价</div>

          </div>
        </div>
       </div>
      <div class="ball-container">
        <div v-for="ball in balls" >
          <transition v-on:before-enter="beforeEnter"
                      v-on:enter="enter"
                      v-on:after-enter="afterEnter"
                      v-bind:css="false"
          >
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook">
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import  cartcontrol from '../cartcontrol/cartcontrol.vue';
  import  split from '../split/split.vue';
  import  ratingselect from '../ratingselect/ratingselect.vue';
  import {formatDate} from '../../common/js/date';
  const ALL=2;
  export default {
      props:{
          food:{
              type:Object
          }
      },
      data(){
        return{
          showFlag:false,
          balls:[
            {
              show:false
            },
            {
              show:false
            },
            {
              show:false
            },
            {
              show:false
            },
            {
              show:false
            },
          ],
          dropBall:[],
          selectType:ALL,
          onlyContent:false,
          ykl:true,
          desc:{
            all:'全部',
            positive:'推荐',
            negative:'吐槽'
          },
          allShow:false
        }
      },
      computed:{

      },
      methods:{
        needShow(type,text){
            if(this.onlyContent && !text){
              return false;
            }
            if(this.selectType===ALL){
              return true;
            }else{
                return type===this.selectType;
            }
        },
        receiveContent(content){
          this.onlyContent=content;
          this.$nextTick(()=>{
            this.scroll.refresh();
          })
        },
        receiveType(type){
          this.selectType=type;
          this.$nextTick(()=>{
              this.scroll.refresh();
          })
        },
        receiveTarget(target){
          this.$nextTick(()=>{
            this.ballTarget(target);
          })

        },
        addFirst(event){
          if(!event._constructed){
              return ;
          }
          Vue.set(this.food,'count',1);
        },
        show(){
          this.showFlag=true;
          this.selectType=ALL;
          this.onlyContent=false;
          this.$nextTick(()=>{
              if(!this.scroll){
                  this.scroll=new BScroll(this.$refs.food,{
                      click:true
                  })
              }else{
                  this.scroll.refresh();
              }
          });
        },
        hideFlag(){
          this.showFlag=false;
        },
        ballTarget(target){
          console.log(target)
          for(let i=0;i<this.balls.length;i++){

            let ball=this.balls[i];
            if(!ball.show){
              ball.show=true;
              ball.target=target;
              this.dropBall.push(ball);
              console.log(this.dropBall)
              return;
            }
          }


        },
        beforeEnter: function (el) {
          let count=this.balls.length;
          while(count--){
            let ball=this.balls[count];
            if(ball.show){
              let rect=ball.target.getBoundingClientRect();
              let x=rect.left-32;
              let y=-(window.innerHeight-rect.top-22)
              el.style.display="";
              el.style.webkitTransform=`translate3D(0,${y}px,0)`;
              el.style.transform=`translate3D(0,${y}px,0)`;
              let inner=el.getElementsByClassName("inner-hook")[0];
              inner.style.webkitTransform=`translate3D(${x}px,0,0)`;
              inner.style.transform=`translate3D(${x}px,0,0)`;
            }
          }
        },
        enter: function (el, done) {
          /* eslint-disable no-unused-vars*/
          let rf=el.offsetHeight;//浏览器重绘
          this.$nextTick(()=>{
            el.style.webkitTransform='translate3d(0,0,0)';
            el.style.transform='translate3d(0,0,0)';
            let inner=el.getElementsByClassName("inner-hook")[0];
            inner.style.webkitTransform='translate3d(0,0,0)';
            inner.style.transform='translate3d(0,0,0)';
            el.addEventListener("transitionend",done);//important
          })
        },
        afterEnter:function(el){
          let ball=this.dropBall.shift();
          if(ball){
            ball.show=false;
            el.style.display="none";
          }
        }
      },
      filters:{
        formatDate(time){
            let date=new Date(time);
            return formatDate(date,'yyyy-MM-dd hh:mm')
        }
      },
      components:{
        cartcontrol:cartcontrol,
        split:split,
        ratingselect:ratingselect
      }
    }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../common/less/index.less';
  .food{
    position: fixed;
    left:0;
    top:0;
    bottom: 48px;
    z-index: 30;
    width:100%;
    background: #fff;
    transition:all 0.2s linear;
    transform: translate3d(0,0,0);
    &.move-enter{
      transform: translate3d(0,0,0);
    }
    &.move-enter-active{
      transform: translate3d(100%,0,0);
    }
    &.move-leave{
      transform: translate3d(0,0,0);
    }
    &.move-leave-active{
      transform: translate3d(100%,0,0);
    }
    .ball-container{
      .ball{
        position:fixed;
        left:32px;
        bottom: 22px;
        z-index:200;
        transition:all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);
        .inner{
          width:16px;
          height:16px;
          border-radius: 50%;
          background: #00a0dc;
          transition:all 0.4s linear;
        }
      }
    }
    .food-content{


      .image-header{
        position: relative;
        width:100%;
        height: 0;
        padding-bottom: 100%;
        img{
          position: absolute;
          left:0;
          top:0;
          height:100%;
        }
        .back{
          position: absolute;
          top:0;
          left:0;
          .icon-arrow_lift{
            display: block;
            padding:10px;
            font-size: 20px;
            color:#fff;
          }
        }

      }
      .content{
        position: relative;
        padding:18px;
        .title{
          font-size: 14px;
          color:rgb(7,17,27);
          font-weight:700;
          line-height: 14px;
          margin-bottom: 8px;
        }
        .detail{
          margin-bottom:18px;
          line-height: 10px;
          font-size: 0;
          .sell-count,.rating{
            font-size: 10px;
            color:rgb(147,153,159);
          }
          .sell-count{
            margin-right:12px;
          }
        }
        .price{
          font-weight:700;
          line-height: 24px;
          .now{
            margin-right:8px;
            font-size: 14px;
            color:rgb(240,20,20);
          }
          .old{
            text-decoration: line-through;
            font-size: 10px;
            color:rgb(147,153,159);
          }
        }
        .cartcontrol-wrapper{
          position: absolute;
          right:12px;
          bottom: 12px;
        }
        .buy{
          position: absolute;
          right:18px;
          bottom: 18px;
          z-index:10;
          height:24px;
          line-height: 24px;
          padding:0 12px;
          box-sizing: border-box;
          font-size: 10px;
          border-radius: 12px;
          color:#fff;
          background:rgb(0,160,220) ;
        }
      }
      .info{
        padding:18px;
        .title{
          line-height: 14px;
          margin-bottom: 16px;
          font-size: 14px;
          color:rgb(7,17,27);
          font-weight:700;
        }

        .text{
          line-height: 24px;
          font-size: 12px;
          padding:0;
          color:rgb(77,85,93)
        }
      }
      .rating{
        padding-top:18px;
        .title{
          line-height: 14px;
          margin-left: 18px;
          font-size: 14px;
          color:rgb(7,17,27);
          font-weight:700;
        }
        .rating-wrapper{
          padding:0 18px;
          .rating-item{
            position: relative;
            padding:16px 0;
            .border-1px(rgba(7,17,27,0.1));
            .user{
              position: absolute;
              right:0;
              top:16px;
              font-size: 0;
              line-height: 12px;
              .name{
                display: inline-block;
                font-size: 10px;
                vertical-align: top;
                color:rgb(147,153,159);
                margin-right:6px;

              }
              .avatar{
                width:10px;
                border-radius: 50%;
              }
            }
            .time{
              margin-bottom: 6px;
              font-size:10px;
              line-height:12px;
              color:rgb(147,153,159);
            }
            .text{
              line-height: 16px;
              font-size: 12px;
              color:rgb(7,17,27);
              .icon-thumb_up, .icon-thumb_down{
                  line-height: 16px;
                margin-right:4px;
                font-size: 12px;
                color:rgb(0,160,220);
              }
              .icon-thumb_down{
                color:rgb(147,153,159);
              }
            }
          }
          .no-ratings{
            color:rgb(147,153,159);
            font-size: 12px;
            padding:16px 0;
          }
        }
      }
    }

  }
</style>
