import React, { Component } from 'react';
import Product from './Product'

//Simplilly call the Product component
class ProductList extends Component {
    render() {

      return (
        <div className="">
            <Product />
        </div>
      );
    }
  }
  
  export default ProductList;