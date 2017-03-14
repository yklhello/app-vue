<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite">
          <span class="icon-favorite" @click='toggleFavorite' :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content">
            {{seller.bulletin}}
          </p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item" v-for="(item, index) in seller.supports">
            <span class="icon" v-bind:class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="pic in seller.pics">
              <img width="120" height="90" :src="pic">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title">
          商家信息
        </h1>
        <ul>
          <li class="info-item" v-for="info in seller.infos">
            {{info}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import  star from '../star/star.vue';
  import  split from '../split/split.vue';
  import BScroll from 'better-scroll';
  import {saveToLocal,loadFromLocal} from '../../common/js/store'

  export default {
    props:{
        seller:{
            type:Object
        }
    },
    data(){
        return{
          favorite:(()=>{
              return loadFromLocal(this.seller.id,'favorite',false)
          })()
        }
    },
    computed:{
      favoriteText(){
        return this.favorite ? '已收藏':'收藏'
      }
    },
    created(){
      this.classMap=[
        'decrease','discount',"special","invoice","guarantee"
      ];
    },
    watch:{
        seller:function(){

            this._initScroll();
        }
    },
    methods:{
      _initScroll(){
          if(!this.scroll){
            this.scroll=new BScroll(this.$refs.seller,{
              click:true
            })
          }else{
              this.scroll.refresh();
          }
      },
      toggleFavorite(event){
          if(!event._constructed){
              return;
          }

          this.favorite=!this.favorite;
          saveToLocal(this.seller.id,'favorite',this.favorite)
      }
    },
    mounted(){

          this._initScroll();

        if(this.seller.pics){
            let picWidth=120;
            let margin=6;
            let width=(picWidth+margin)*this.seller.pics.length-margin;
            this.$refs.picList.style.width=width+'px';
            this.$nextTick(()=>{
                this.picScroll=new BScroll(this.$refs.picWrapper,{
                    click:true,
                    scrollX:true,
                    eventPassthrough:'vertical'
                })
            })
        }
//        this.scroll=new BScroll(this.$refs.picList,{
//          click:true
//        })
    },
    components:{
      star:star,
      split:split
    }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../common/less/index.less';
  .seller{
    position: absolute;
    top:174px;
    bottom: 0;
    width:100%;
    left:0;
    overflow: hidden;
    .overview{
      position: relative;
      padding:18px;
      .title{
        font-size: 14px;
        line-height: 14px;
        margin-bottom: 8px;
        color:rgb(7,17,27);
      }
      .desc{
        padding-bottom: 18px;

        font-size: 0;
        .border-1px(rgba(7,17,27,0.1));
        .star{
          display: inline-block;
          vertical-align: top;
          margin-right: 8px;
        }
        .text{
          display: inline-block;
          vertical-align: top;
          line-height: 18px;
          margin-right:12px;
          color:rgb(77,85,93);
          font-size: 10px;
        }
      }
      .remark{
        display: flex;
        padding-top:18px;
        .block{
          flex: 1;
          text-align: center;
          border-right:1px solid rgba(7,17,27,0.1);
          &:last-child{
          border:0;
          }
          h2{
            font-size: 10px;
            line-height: 10px;
            color:rgb(147,153,159);
            margin-bottom: 4px;
          }
          .content{
            line-height: 24px;
            font-size: 10px;
            color:rgb(7,17,27);
            .stress{
              font-size: 24px;
            }
          }
        }
      }
      .favorite{
        position: absolute;
        right:11px;
        top:18px;
        text-align: center;
        width:50px;
        .icon-favorite{
          display: block;
          line-height: 24px;
          height:24px;
          font-size: 24px;
          color:#d4d6d9;
          margin-bottom: 4px;
          &.active{
            color:rgb(240,20,20);
          }
        }
        .text{
          font-size: 10px;
          line-height: 10px;
          color:rg(77,85,93);
        }
      }
    }
    .bulletin{
      padding:18px 18px 0 18px;
      .title{
        font-size: 14px;
        line-height: 14px;
        margin-bottom: 8px;
        color:rgb(7,17,27);
      }
      .content-wrapper{
        padding:0 12px 16px 12px;
        .border-1px(rgba(7,17,27,0.1));
        .content{
          line-height: 24px;
          font-size: 12px;
          color:rgb(240,20,20);
        }
      }
      .supports{
        .support-item{
          padding:16px 12px;
          .border-1px(rgba(7,17,27,0.1));
          font-size: 0;
          &:last-child{
            .border-none();
          }
          .icon{
            display: inline-block;
            width:16px;
            height:16px;
            vertical-align: top;
            margin-right:6px;
            background-size:16px 16px;
            background-repeat: no-repeat;
            &.decrease{
              .best_bg(decrease_4);
            }
            &.discount{
              .best_bg(discount_4);
            }
            &.guarantee{
              .best_bg(guarantee_4)
            }
            &.invoice{
              .best_bg(invoice_4)
            }
            &.special{
              .best_bg(special_4)
            }
          }
          .text{
            line-height: 16px;
            font-size: 12px;
          }
        }
      }
    }
    .pics{
      padding:18px;
      .title{
        font-size: 14px;
        line-height: 14px;
        margin-bottom: 12px;
        color:rgb(7,17,27);
      }
      .pic-wrapper{
        width:100%;
        overflow: hidden;
        white-space:nowrap;
        .pic-list{
          font-size: 0;
          .pic-item{
            display: inline-block;
            margin-right:6px;
            width:120px;
            height:90px;
            &:last-child{
              margin:0;
            }
          }
        }
      }
    }
    .info{
      padding:18px 18px 0 18px;
      .title{
        font-size: 14px;
        line-height: 14px;
        padding-bottom: 8px;
        color:rgb(7,17,27);
        .border-1px(rgba(7,17,27,0.1));
      }
      .info-item{
        .border-1px(rgba(7,17,27,0.1));
        padding:16px 12px;
        line-height: 16px;
        color:rgb(7,17,27);
        font-size: 12px;
        &:last-child{
          .border-none();
        }
      }
    }
  }
</style>
