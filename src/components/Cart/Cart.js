import { useContext, useState } from 'react';

import Checkout from './Checkout';
import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import { Fragment } from 'react/cjs/react.production.min';

const Cart = (props) => {

  const [isCheckout,setIsCheckout] = useState(false);
  const[isSubmitting, setIsSubmitting] = useState(false);
  const[didSubmit, setDidSubmit] = useState(false);

  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };


  const orderHandler = () => {
    setIsCheckout(true);
  }

  const SubmitOrderHandler = async (userData) => {
    setIsSubmitting(true); 
    await fetch('https://food-order-app-4331e-default-rtdb.firebaseio.com/orders.json', {
      method: 'POST',
      body: JSON.stringify({
       user: userData,
       orderedItems: cartCtx.items,
      }),
    });

    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCard();
  }


  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalActions = <div className={classes.actions}>
  <button className={classes['button--alt']} onClick={props.onClose}>
    Close
  </button>
  {hasItems && <button className={classes.button} onClick={orderHandler} >Order</button>}
</div>


const CartModalContent = <Fragment>
  {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>

      { isCheckout &&(
        <Checkout onConfirm={SubmitOrderHandler} onClose={props.onClose} />)}
      {!isCheckout && modalActions}
      
</Fragment>

  const isSubmittingContent = <p>Sending order data....</p>
  const didSubmitModalContent = <p>Successfully sent the order!</p>


  return (
    <Modal onClose={props.onClose}>
          {!isSubmitting && !didSubmit &&CartModalContent}
          {isSubmitting && isSubmittingContent}
          {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;