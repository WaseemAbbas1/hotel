import React, { useEffect, useState } from 'react';
// Firebase imports
import { collection, getDocs, getDoc, doc, deleteDoc, setDoc } from 'firebase/firestore/lite';
import { auth, firestore } from '../../config/firebase';
// Ant Design components
import { Row, Col, Card, Button, Empty, Spin } from 'antd';
import { CheckCircleOutlined, DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined, CloseOutlined } from '@ant-design/icons';

const initialValue = { name: "", number: "", address: "" };
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData,setFormData] = useState(initialValue);
  const [isOrderLoading, setIsOrderLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const {name,address,number} = formData
  const fetchCartItems = async () => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (user) {
      try {
        const cartSnapshot = await getDocs(collection(firestore, `users/${user.uid}/cart`));
        const cartProductData = await Promise.all(
          cartSnapshot.docs.map(async (docSnap) => {
            const productId = docSnap.id;
            const productDoc = await getDoc(doc(firestore, 'products', productId));
            return productDoc.exists() ? { id: productId, ...productDoc.data(), quantity: docSnap.data().quantity } : null;
          })
        );
        setCartItems(cartProductData.filter(item => item)); // Filter out nulls
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = async (itemId, change) => {
    const user = auth.currentUser;
    if (user) {
      const cartItem = cartItems.find(item => item.id === itemId);
      const newQuantity = cartItem.quantity + change;

      if (newQuantity < 0) return; // Prevent negative quantity

      try {
        // Update the quantity in Firestore
        await setDoc(doc(firestore, `users/${user.uid}/cart`, itemId), {
          quantity: newQuantity,
        }, { merge: true });

        // Update the local state
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
  };

  const checkOrder = (item) => {
    setShowModal(true);
  };

  const removeFromCart = async (productId) => {
    setDeleteLoading(productId);
    const user = auth.currentUser;
    if (user) {
      try {
        await deleteDoc(doc(firestore, `users/${user.uid}/cart`, productId));
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      } catch (error) {
        console.error('Error removing item from cart:', error);
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const handleSaveOrder = async () => {
    if(!name ||!address||!number){
      window.toastify("please fill the inputs")
    }
    setIsOrderLoading(true); // Start the loading state
    const user = auth.currentUser;
  
    if (user) {
      try {
        // Construct order data
        const orderData = {
          userId: user.uid,
          name: name,
          address: address,
          phoneNumber: number,
          items: cartItems.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
          totalAmount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          orderDate: new Date(),
        };
  
        // Save the order to Firestore in an `orders` collection
        const orderRef = doc(collection(firestore, "orders"));
        await setDoc(orderRef, orderData);
  
        // Optionally, clear the cart items for the user after saving the order
        await Promise.all(
          cartItems.map(item => deleteDoc(doc(firestore, `users/${user.uid}/cart`, item.id)))
        );
        
        // Clear the cart in local sta
        // Clear the form data
        setFormData(initialValue);
  
        // Close the modal and stop the loading state
        setShowModal(false);
      } catch (error) {
        console.error("Error saving order:", error);
      } finally {
        setIsOrderLoading(false); // End the loading state
      }
    } else {
      console.error("No user logged in to place an order.");
      setIsOrderLoading(false);
    }
  };
  

  return (
    <div className="wishlist-container">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spin size="large" />
        </div>
      ) : cartItems.length === 0 ? (
        <Empty description="Your cart is empty" />
      ) : (
        <Row gutter={[16, 16]}>
          {cartItems.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={<img alt={item.title} src={item.imageURL || 'default_image.jpg'} />}
              >
                <Card.Meta className='mb-2' title={item.title} description={`Price: $${item.price}`} />
                <div>
                  <Button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}
                    style={{ fontSize: "15px" }}
                    type="text"
                    danger
                    icon={<MinusCircleOutlined />}
                  />
                  <span className="item-quantity mx-2">{item.quantity}</span>
                  <Button
                    onClick={() => updateQuantity(item.id, 1)}
                    style={{ fontSize: "15px" }}
                    type="primary"
                    icon={<PlusCircleOutlined />}
                  />
                </div>
                <div className="wishlist-actions">
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => checkOrder(item)}
                  >
                    Check Order
                  </Button>
                  <Button
                    type="danger"
                    disabled={item.id === deleteLoading}
                    loading={item.id === deleteLoading}
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </div>
                <div>
                  <span>Total:</span> ${item.price * item.quantity}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {showModal && (
        <CheckOrderModal
          onClose={() => setShowModal(false)}
          onChange={handleChange}
          isLoading={isOrderLoading}
          onSave={handleSaveOrder}
          data={formData}
        />
      )}
    </div>
  );
};

export default Cart;

const CheckOrderModal = ({ isLoading, onClose, data,onChange, onSave }) => {
  return (
    <>
      <div className="modal show" style={{ display: "block" }} onClick={onClose}>
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title ms-auto">Check Order</h5>
              <button type="button" className="btn btn-outline-dark ms-auto" onClick={onClose}>
                <CloseOutlined />
              </button>
            </div>
            <div className="modal-body">
              <form >
                <div className="form-group mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={onChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={data.address}
                    onChange={onChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="number"
                    value={data.number}
                    onChange={onChange}
                    className="form-control"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={onSave} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
                    Wait...
                  </>
                ) : (
                  "OK"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};
