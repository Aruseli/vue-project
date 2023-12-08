import { defineStore } from 'pinia';

export const productsStore = defineStore('products', {
  state: () => ({
    products: [],
    cart: [],
    drawerState: false,
  }),

  actions: {
    fetchDataFromDB() {
      fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(json => {
          this.products = json.products
        })
    },

    increase(product) {
      const stock = this.products.find(item => item.id === product.id);
      // const a = this.stock.stock;
      console.log('a', stock.stock--)
    },

    addToCart(product) {
      this.cart.push(product);
      this.increase(product);
      console.log(this.products)
      console.log(product)
      // console.log(stock)
      // this.cart =this.cart.filter(item => item.id !== product.id)
    },

    removeFromCart(id) {
      this.cart =this.cart.filter(item => item.id !== id)
    },

    openDrawer(state) {
      this.drawerState = state;
    },
  }

});
