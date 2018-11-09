Vue.component("tweet-form", {
  data: function () {
    return ({
      text: ""
    })
  },
  methods: {
    postTweet: function () {
      this.$emit("tw-post", this.text);
      this.text = "";
    }
  },
  template: `
  <form v-on:submit.prevent="postTweet">
    <textarea v-model="text"></textarea>
    <button type="submit">Tweet</button>
  </form>`
})

Vue.component("card", {
  props: {
    card: Object
  },
  data: function () {
    return ({
      liked: 0,
      selfLiked: false,
      retweeted: 0
    })
  },
  methods: {
    handleClick: function (ev) {
      const clname = ev.target.className; // ChromeとFirefoxでev.targetが違う
      if (clname.indexOf("heart") >= 0 || clname.indexOf("like")) {
        this.liked += this.selfLiked ? -1 : 1;
        this.selfLiked = !this.selfLiked;
      }
    }
  },
  created: function () {
    let tm = 1000, sum = 0;
    const countup = () => {
      const exp1 = Math.max(1.5, Math.random() * 2), exp2 = Math.max(1.5, Math.random() * 2);
      this.liked += Math.max(1, Math.ceil(Math.pow(sum / 1000, exp1)));
      this.retweeted += Math.max(1, Math.ceil(Math.pow(sum / 1000, exp2)));
      tm = 1000 + randInt(1000, 2000);
      sum += tm;
      if (this.liked < 1000000 && this.retweeted < 1000000) {
        setTimeout(countup, tm);
      }
    }
    setTimeout(countup, 2000 + randInt(0, 1000));
  },
  // {{ card.content }} の行は空白入れるとまずい
  template: `
  <div class="tw-card">
    <div class="card-content">{{ card.content }}</div>
    <div class="card-footer">
      <ul>
        <li>
          <button class="tw-action-button tw-comment">
            <i class="far fa-comment"></i>
          </button>
        </li>
        <li>
          <button name="retweet" class="tw-action-button tw-retweet">
            <i class="fas fa-retweet"></i>
            <span>{{ retweeted || "" }}</span>
          </button>
        </li>
        <li>
          <button name="like" v-on:click="handleClick" class="tw-action-button tw-like" v-bind:class="{'self-liked': selfLiked}">
            <i v-if="selfLiked" class="fas fa-heart"></i>
            <i v-else class="far fa-heart"></i>
            <span>{{ liked || "" }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>`
});

const app = new Vue({
  el: "#app",
  data: {
    cards: []
  },
  methods: {
    pushCard: function (text) {
      this.cards.unshift({ content: text, id: this.cards.length });
    }
  },
  template: `
  <div>
    <tweet-form v-on:tw-post="pushCard"></tweet-form>
    <div>
      <card v-for="card in cards" v-bind:card="card" v-bind:key="card.id"></card>
    </div>
  </div>`
})

function randInt(lb, ub) {
  return Math.floor(Math.random() * (ub - lb)) + lb;
}
