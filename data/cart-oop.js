function Cart(){
    const cart={
    cartItem:undefined,
    loadFromStorage(){
         this.cartItem= JSON.parse(localStorage.getItem('cart-oop'));
            if(!this.cartItem){
            this.cartItem=[{
                productId:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                quantity: 2,
                deliveryOptionId:'1'
},{
    productId:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
    deliveryOptionId:'2'
        }]
    }
  },
    saveToStorage(){
        localStorage.setItem('cart-oop',JSON.stringify(this.cartItem))
    },
    addToCart(productId){ 
        let matchingItem 
        this.cartItem.forEach((cartItem)=>{
            if(cartItem.productId===productId){ 
            matchingItem=cartItem 
        } 
        }); 
        if(matchingItem){
            matchingItem.quantity+=1 
        }else{ 
            this.cartItem.push({ productId:productId,
                quantity:1,
                deliveryOptionId:'1' 
            }); 
        } 
        this.saveToStorage()
    },
    
    removeFromCart(productId){
    const newCart=[]

    this.cartItem.forEach((cartItem)=>{
        if(cartItem.productId!==productId){
            newCart.push(cartItem)
        }
    })
    this.cartItem=newCart
    this.saveToStorage() 
},
     updateCartQuantity(){
          let cartQuantity=0
            this.cartItem.forEach((cartItem)=>{
                cartQuantity+=cartItem.quantity
            })
             document.querySelector('.cart-quantity').innerHTML=cartQuantity
 },
 
 updateCheckoutQuantity(){
          let cartQuantity=0
            this.cartItem.forEach((cartItem)=>{
                cartQuantity+=cartItem.quantity
            })

            document.querySelector('.js-checkout-item').innerHTML=cartQuantity
 },
   updateQuantity(productId,newQuantity){
    let matchingItem 
    this.cartItem.forEach((cartItem)=>{
        if(cartItem.productId===productId){ 
        matchingItem=cartItem 
    } 
    }); 
    matchingItem.quantity=newQuantity
    this.saveToStorage()
},
 updateDeliveryQuantity(productId, newQuantity){
    let matchingItem;
    this.cartItem.forEach((cartItem)=>{
        if(cartItem.productId===productId){ 
            matchingItem=cartItem;
        } 
    }); 
    matchingItem.deliveryOptionId =newQuantity
    this.saveToStorage()
}

    
}
return cart;
}

const cart=Cart()
const businessCart=Cart()
cart.loadFromStorage()


console.log(cart)
console.log(businessCart)