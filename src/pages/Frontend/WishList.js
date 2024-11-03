import React, { useEffect, useState } from 'react';
// Firebase imports
import { collection, getDocs,setDoc, getDoc, doc, deleteDoc } from 'firebase/firestore/lite';
import { auth, firestore } from '../../config/firebase';
// Ant Design components
import { Row, Col, Card, Button, Empty, Spin, message } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading,setDeleteLoading] = useState(null)
  const [addCartLoading,setAddCartLoading ] =  useState(null)

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const wishlistRef = collection(firestore, `users/${user.uid}/wishlist`);
        const wishlistSnapshot = await getDocs(wishlistRef);

        const productPromises = wishlistSnapshot.docs.map(async (itemDoc) => {
          const productRef = doc(firestore, 'products', itemDoc.id);
          const productSnapshot = await getDoc(productRef);
          if (productSnapshot.exists()) {
            return { id: productSnapshot.id, ...productSnapshot.data() };
          } else {
            return null;
          }
        });

        const products = (await Promise.all(productPromises)).filter(Boolean);
        setWishlistItems(products);
      }
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      message.error('Failed to fetch wishlist items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppCart= async(productId)=>{
    setAddCartLoading(productId)
    try {
      const user = auth.currentUser; 
      if (user) {
        await setDoc(doc(firestore, `users/${user.uid}/cart`, productId), {
          productId, 
          quantity:  1, 
          addedAt: new Date(),
        } ,{ merge: true });
        window.toastify("Product added to cart!", "success");
        console.log(`Added to cart: ${productId}`);
      } else {
        window.toastify("Please log in to add to cart", "error");
      }
    } catch (error) {
      console.error("Error adding to cart: ", error);
      window.toastify("Failed to add to cart", "error");
    }
    finally{
      setAddCartLoading(null);
    }
  }
  const removeFromWishlist = async (itemId) => {
   setDeleteLoading(itemId)
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(firestore, `users/${user.uid}/wishlist`, itemId));
        setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        message.success('Item removed from wishlist');
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      message.error('Failed to remove item from wishlist');
    }
    finally{
      setDeleteLoading(null)
    }
  };

  return (
    <div className="wishlist-container">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spin size="large" />
        </div>
      ) : wishlistItems.length === 0 ? (
        <Empty description="Your wishlist is empty" />
      ) : (
        <Row gutter={[16, 16]}>
          {wishlistItems.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={<img alt={item.title} src={item.imageURL || 'default_image.jpg'} />}
              >
                <Card.Meta title={item.title} description={`$${item.price}`} />
                <div className="wishlist-actions">
                  <Button
                    type="primary"
                    disabled={item.id===addCartLoading}
                    icon={<ShoppingCartOutlined />}
                    loading={item.id===addCartLoading}
                    onClick={() => handleAppCart(item.id)}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    type="danger"
                     disabled={item.id === deleteLoading}
                     loading={item.id === deleteLoading} 
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Wishlist;
