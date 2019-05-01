import React from 'react'
import classnames from "classnames";

//This method will map all the items in the cart database and show the ones corresponding to the current user
const CartList = (user,updateQuantity) => {
    const alldata = user.state.products.length ? (
        user.state.products.map(cart => {
            var total = cart.price 
            return(
                <tr key={cart._id}>
                    <th scope="col">{cart.title}</th> 
                    <th scope="col"><i className="fas fa-dollar-sign"></i> {cart.price}</th> 
                    <th scope="col"><input type="text" className="form-control quantity" onChange={() => updateQuantity} defaultValue="1" /></th> 
                    <th scope="col"><i className="fas fa-dollar-sign"></i> {cart.price * 1}</th> 
                </tr>
            )
        })
    ) : (
        <tr>
            <th>No items on your cart</th>
        </tr>
        
    )

    //Renders the products and the functionality to checkout    
    return (
        <div className="collection container">
            <h1>{user.user}s Cart</h1>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Total</th>
                    <th scope="col"></th>
                </tr>
                </thead>
                <tbody>
                    {alldata}
                </tbody>
            </table>
        </div>
    )
}

export default CartList;