import { defineStore } from 'pinia';

export const productsStore = defineStore('products', {
  state: () => ({
    products: [],
    cart: [],
    drawerCartState: false,
    tab: 'food',
  }),

  actions: {
    fetchDataFromDB() {
      fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(json => {
          this.products = json.products
        })
    },

    // increase(product) {
    //   const stock = this.products.find(item => item.id === product.id);
    //   // const a = this.stock.stock;
    //   console.log('a', stock.stock--)
    // },

    // localCartInstance() {
    //   const cartStore = localStorage.getItem('cart');
    //   if(!cartStore) {
    //     this.cart = [];
    //   } else { this.cart = JSON.parse(cartStore)}
    // },

    increaseItems(product) {
      let existingProduct = this.cart.find(item => item.id === product.id) || null;
      if (existingProduct) {
        existingProduct.count++;
        existingProduct.price += product.price;
      }
    },

    decreaseItems(product) {
      let existingProduct = this.cart.find(item => item.id === product.id);
      existingProduct.count--;
      existingProduct.price -= product.price;
      if ( existingProduct.count == 0 ) this.cart = this.cart.filter(item => item.id !== product.id);
    },

    addToCartAndIncrementCount(product) {
      let existingProduct = this.cart.find(item => item.id === product.id);
      if (existingProduct) {
        existingProduct.count++;
        existingProduct.price += product.price;
      } else {
        this.cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          count: 1,
          images: [...product.images],
          alt: product.title,
          description: product.description
        });
      }
    },

    removeFromCart(id) {
      this.cart = this.cart.filter(item => item.id !== id)
    },

    openDrawerCart(state) {
      this.drawerCartState = state;
    },

  },

  persist: {
    storage: localStorage,

  },
});
