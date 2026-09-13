import { createSlice } from "@reduxjs/toolkit";
// Redux = application ka global state manage aur update karne ke liye
const userSlice = createSlice({

    name: "user",
    initialState: {
        userData: null,
        currentCity: null,
        currentState: null,
        currentAddress: null,
        shopInMyCity: null,
        itemsInMyCity: null,
        cartItems: [],
        totalAmount: 0

        ,
        myOrders: []

    },

    /// data to update krne wla function
    reducers: {
        setUserData: (state,
            action) => {

            //action.playod===  se ayega data jo hame fronend se bejaa h
            //payload == useerDATA
            //state  ==== CURRENT WLA USERDATA   jise ham intail value jo pass krii h  usko change krengee




            // action.payload = jo data frontend se bheja
            // state = current redux state (initial value ko update karte hain)
            state.userData = action.payload



        },

        // $$$$   USER KI CITYY KE LIYYYE

        setCurrentCity: (state,
            action) => {

            //action.playod===  se ayega data jo hame fronend se bejaa h
            //payload == useerDATA
            //state  ==== CURRENT WLA USERDATA   jise ham intail value jo pass krii h  usko change krengee




            // action.payload = jo data frontend se bheja
            // state = current redux state (initial value ko update karte hain)
            state.currentCity = action.payload



        }


        ,
        // $$$$   USER KI STATE KE LIYYYE

        setCurrentState: (state,
            action) => {

            //action.playod===  se ayega data jo hame fronend se bejaa h
            //payload == useerDATA
            //state  ==== CURRENT WLA USERDATA   jise ham intail value jo pass krii h  usko change krengee




            // action.payload = jo data frontend se bheja
            // state = current redux state (initial value ko update karte hain)
            state.currentState = action.payload



        },
        // $$$$   USER KI STATE KE LIYYYE

        setCurrentAddress: (state,
            action) => {

            //action.playod===  se ayega data jo hame fronend se bejaa h
            //payload == useerDATA
            //state  ==== CURRENT WLA USERDATA   jise ham intail value jo pass krii h  usko change krengee




            // action.payload = jo data frontend se bheja
            // state = current redux state (initial value ko update karte hain)
            state.currentAddress = action.payload



        },

        setShopInMyCity: (state,
            action) => {
            state.shopInMyCity = action.payload



        },
        setItemsInMyCity: (state,
            action) => {
            state.itemsInMyCity = action.payload



        },


        // Add to cart ke liyye    redux slice 

        addToCart: (state, action) => {

            const cartItem = action.payload
            const existingItem = state.cartItems.find(i => i.id == cartItem.id)


            if (existingItem) {
                existingItem.quantity += cartItem.quantity


            } else {

                // purana item ni h to new item add hoga cart me

                state.cartItems.push(cartItem);



            }


            //toatalAmount ke liye after the addto cart
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)


            // console.log("cart", state.cartItems)
        },

        updateQuantity: (state, action) => {


            const { id, quantity } = action.payload
            const item = state.cartItems.find(i => i.id == id)

            if (item) {

                item.quantity = quantity
            }
            //toatalAmount ke liye after the addto cart
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

        },

        removeCartItem: (state, action) => {

            state.cartItems = state.cartItems.filter(i => i.id !== action.payload)
                //toatalAmount ke liye after the addto cart
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

        },


        setMyOrders: (state, action) => {
            state.myOrders = action.payload
        },

        addMyOrder: (state, action) => {
            state.myOrders = [action.payload, ...state.myOrders]
        },

        updateOrderStatus: (state, action) => {

            const { orderId, shopId, status } = action.payload;
            const order = state.myOrders.find(o => o._id === orderId);

            if (order) {
                const shopOrders = Array.isArray(order.shopOrders) ?
                    order.shopOrders :
                    order.shopOrders ? [order.shopOrders] : [];
                const shopOrder = shopOrders.find(shopOrder =>
                    String(shopOrder.shop && (shopOrder.shop._id || shopOrder.shop)) === String(shopId)
                );

                if (shopOrder) {
                    shopOrder.status = status;
                }

            }
        }
    }
})





export const {
    setUserData,
    setCurrentAddress,
    setCurrentState,
    setCurrentCity,
    setShopInMyCity,
    setItemsInMyCity,
    addToCart,
    updateQuantity,
    removeCartItem,
    setMyOrders,
    addMyOrder,
    updateOrderStatus
} = userSlice.actions;

export default userSlice.reducer