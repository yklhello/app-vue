<template>
  <div class="ratings" ref="ratings">
 		<div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect
        :selectType="selectType"
        :onlyContent="onlyContent"
        :desc="desc"
        :ratings="ratings"
        @sendType="receiveType"
        @sendContent="receiveContent"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings"
              v-show="needShow(rating.rateType,rating.text)"
              class="rating-item">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar" alt="">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery"
                v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>

              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommand" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="recommand in rating.recommend">{{recommand}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import  star from '../star/star.vue';
  import BScroll from 'better-scroll';
  import  split from '../split/split.vue';
  import  ratingselect from '../ratingselect/ratingselect.vue';
  import {formatDate} from '../../common/js/date';
  const ALL=2;
  const POSITIVE=0;
  const NEGATIVE=1;
  const ERR_OK=0;
export default {
    props:{
        seller:{
            type:Object
        },

    },
    data(){
      return {
        ratings: [],
        onlyContent: false,
        selectType: ALL,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        },
      }
    },
    created(){
      this.$http.get('./api/ratings').then(response => {
      response=response.body;
      if(response.errno===ERR_OK){
        this.ratings=response.data;
        this.$nextTick(()=>{
            this.scroll=new BScroll(this.$refs.ratings,{
                click:true
            })
        })
      }

    }, response => {
      })
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
        console.log(type);
        this.selectType=type;
        this.$nextTick(()=>{
          this.scroll.refresh();
        })
      },
    },
    filters:{
      formatDate(time){
        let date=new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm')
      }
    },
    components:{
      star:star,
      ratingselect:ratingselect,
      split:split
    }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../common/less/index.less';
  .ratings{
    position: absolute;
    top:174px;
    bottom: 0;
    width:100%;
    left:0;
    overflow: hidden;
    .overview{
      display: flex;
      padding:18px 0;
      .overview-left{
        flex:0 0 137px;
        width:137px;
        padding:6px 0;
        text-align: center;
        border-right:1px solid rgba(7,17,27,0.1);
        @media only screen and (max-width:320px){
          flex:0 0 120px;
          width:120px;
        }

        .score{
          width:100%;
          line-height: 28px;
          font-size: 24px;
          color:rgb(255,153,0);
          margin-bottom: 6px;
        }
        .title{
          line-height: 12px;
          font-size: 12px;
          color:rgb(7,17,27);
          margin-bottom: 8px;
        }
        .rank{
          line-height: 10px;
          font-size: 10px;
          color:rgb(147,153,159);

        }

      }
      .overview-right{
        flex: 1;
        padding:6px 0 6px 24px;
        @media only screen and (max-width:320px){
          padding-left:6px;
        }
        .score-wrapper{

          margin-bottom: 8px;
          font-size: 0;
          .title{
            display: inline-block;
            color:rgb(7,17,27);
            font-size: 12px;
            vertical-align: top;
            line-height: 18px;
          }
          .star{
            display: inline-block;
            margin:0 12px;
            vertical-align: top;

          }
          .score{
            color:rgb(255,153,0);
            line-height: 18px;
            vertical-align: top;
            display: inline-block;
            font-size: 12px;
          }
        }
        .delivery-wrapper{
          font-size: 0;
          .title{
            color:rgb(7,17,27);
            font-size: 12px;
            line-height: 18px;
          }
          .delivery{
            font-size: 12px;
            color:rgb(147,153,159);
            margin-left:12px;
          }
        }
      }
    }
    .rating-wrapper{
      padding:0 18px;
      .rating-item{
        display: flex;
        padding:18px 0;
        .border-1px(rgba(7,17,27,0.1));
        .avatar{
          flex: 0 0 28px;
          width: 28px;
          margin-right:12px;
          img{
            border-radius: 50%;
          }
        }
        .content{
          flex: 1;
          position: relative;
          .name{
            font-size: 10px;
            line-height: 12px;
            color:rgb(7,17,27);
            margin-bottom: 4px;
          }
          .star-wrapper{
            margin-bottom: 6px;
            font-size: 0;
            .star{
              display: inline-block;
              vertical-align: top;
              margin-right:6px;
            }
            .delivery{
              display: inline-block;
              vertical-align: top;
              font-size: 10px;
              line-height: 12px;
              color:rgb(147,153,159);
            }
          }
          .text{
            line-height: 18px;
            font-size: 12px;
            color:rgb(7,17,27);
            margin-bottom: 8px;
          }
          .recommand{
            font-size: 0;
            line-height: 16px;
            color:rgb(147,153,159);
            .icon-thumb_up,.item{
              display: inline-block;
              margin:0 8px 4px 0;
              font-size: 9px;
            }
            .icon-thumb_up{
              color:rgb(0,160,220)
            }
            .item{
              padding:0 6px;
              border:1px solid rgba(7,17,27,0.1);
              border-radius: 1px;
              color:rgb(147,153,159);
              background: #fff;
            }
          }
          .time{
            font-size: 10px;
            line-height: 12px;
            position: absolute;
            top:0;
            right:0;
            color:rgb(147,153,159);
          }
        }
      }
    }

  }
</style>
