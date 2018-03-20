<template>
  <div>
    <top-back title="确认下单"></top-back>
    <section classs="formContent">
      <section class="deliveryAddress">
        <section class="deliveryAddressContent">
          <svg></svg>
          <section class="addressMessage">
            <div class="userMessage">
              <span class="userName"></span>
              <span class="userSex"></span>
              <span class="userPhone"></span>
            </div>
            <div class="addressDetail">
              <span class="address"></span>
              <span class="supplementAddress"></span>
            </div>
          </section>
        </section>
        <span class="addressSelect"></span>
      </section>
      <section class="deliveryTime">
        <h3 class="title">送达时间</h3>
        <section class="deliveryTimeRight">
          <span class="predictTime">尽快送达 | 预计</span>
          <span class="deliveryMode"></span>
        </section>
      </section>
      <section class="payMode">
        <h3 class="title">支付方式</h3>
        <span class="onlinePayment">在线支付</span>
      </section>
      <section class="orderDetail">
        <header class="shop">
          <img src="" alt="" class="shopIcon">
          <h3 class="shopName"></h3>
        </header>
        <ul class="orderListUl">
          <li class="orderListLi">
            <h4 class="foodName"></h4>
            <span class="foodNum"></span>
            <span class="price"></span>
          </li>
        </ul>
        <footer class="sum">
          <span class="sumPrice">合计</span>
          <div class="waitPay">
            <span class="waitPayName">待支付</span>
            <span class="waitPayPrice"></span>
          </div>
        </footer>
      </section>
      <section class="remarks">
        <ul class="remarksUl">
          <li class="remarksLi">
            <h4 class="remarksName"></h4>
            <p class="remarksContent"></p>
          </li>
        </ul>
      </section>
    </section>
    <footer class="submitOrder">
      <div class="waitePay">待支付</div>
      <div class="submitButton">确认下单</div>
    </footer>
  </div>
</template>

<script>
import TopBack from '../../components/common/TopBack'

export default {
  name: 'OrderConfirm',

  components: {
    TopBack
  }
}
</script>

<style lang="scss" scoped>
.formContent {
  .deliveryAddress {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: .5rem;
    padding: 0 .1rem;
    .deliveryAddressContent {
      display: flex;
      align-items: center;
      .addressMessage {
        .userMessage {
          .userName {
            font-size: .16rem;
            font-weight:bold;
          }
          .userSex {
            font-size: .14rem;
            color: #424242;
          }
          .userPhone {
            font-size: .14rem;
            color: #424242;
          }
        }
        .addressDetail {
          .address {
            color: #fff;
            background-color: #ec471d;
            border-radius: 2px;
            font-size: .12rem;
          }
          .supplementAddress {
            font-size: .12rem;
            color: #616161;
          }
        }
      }
    }
    .addressSelect {
      //
    }
  }
  .deliveryTime {
    padding: 0 .1rem;
    border-left: 3px solid #1a8bcc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1rem;
    .title {
      font-size: .2rem;
      font-weight: bold;
    }
    .deliveryTimeRight {
      .predictTime {
        color: #1a8bcc;
        font-size: .16rem;
      }
      .deliveryMode {
        color: #fff;
        background-color: #066da8;
        border-radius: 2px;
      }
    }
  }
  .payMode {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .1rem;
    .title {
      font-size: .18rem;
      color: #7c7c7c;
    }
    .onlinePayment {
      font-size: .14rem;
      color: #a8a8a8;
    }
  }
  .orderDetail {
    padding: 0 .1rem;
    .shop {
      vertical-align: center;
      height: .5rem;
      .shopIcon {
        width: .2rem;
      }
      .shopName {
        font-size: .18rem;
        color: #555;
      }
    }
    .orderListUl {
      .orderListLi {
        display: flex;
        justify-content: space-Between;
        align-items: center;
        .foodName {
          color: #7c7c7c;
          font-size: .13rem;
        }
        .foodNum {
          color: #f56b2b;
          font-size: .13rem;
        }
        .price {
          color: #7c7c7c;
          font-size: .13rem;
        }
      }
    }
    .sum {
      display: flex;
      justify-content: space-between;
      .sumPrice {
        color: #7c7c7c;
        font-size: .13rem;
      }
      .waitPay {
        display: block;
        .waitPayName {
          color: #f56b2b;
          font-size: .13rem;
        }
        .waitPayPrice {
          color: #f56b2b;
          font-size: .13rem;
        }
      }
    }
  }
  .remarks {
    padding: 0 .1rem;
    .remarksUl {
      .remarksLi {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .remarksName {
          font-size: .16rem;
          color: #7c7c7c;
        }
        .remarksContent {
          font-size: .14rem;
          color: #b3b3b3;
        }
      }
    }
  }
  .submitOrder {
    display: flex;
    justify-content: space-between;
    height: .2rem;
    .waitePay {
      font-size: .18rem;
      color: #ccc;
      width: 70%;
      background-color: #313131;
    }
    .submitButton {
      width: 30%;
      font-size: .18rem;
      color: #fff;
      background-color: #60f55b;
    }
  }
}
</style>

