import React, { useState, useEffect } from 'react';
// 
import { collection, getDocs,setDoc,doc } from 'firebase/firestore/lite';
import { auth, firestore } from '../../config/firebase';
// 
import { useAuthContext } from 'context/AuthContext';
// 
import { Button, Card, Col, Empty, Row, Skeleton } from 'antd';
import {HeartOutlined, MinusCircleOutlined, PlusCircleOutlined, ShoppingCartOutlined} from "@ant-design/icons"
import {Typography} from "antd"
const {Paragraph} = Typography
const Products = () => {
  const {role ,isAuth} = useAuthContext()
const [counts ,setCounts] = useState({}) 
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState({})

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const productsCol = collection(firestore, 'products');
      const productSnapshot = await getDocs(productsCol);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCounts(productList.reduce((acc, product) => ({ ...acc, [product.id]: 1 }), {})); 
      setProducts(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const handleIncrement = (productId) => {
    if(role ==="admin"){
window.toastify("admin not able to buy any product" ,"error") 
return   
}
if(!isAuth){
  window.toastify("please sign in to get features" ,"error") 
  return   
  }
  

    setCounts(prevCounts => ({
      ...prevCounts,
      [productId]: prevCounts[productId] + 1,
    }));
  };

  const handleDecrement = (productId) => {
    
    if(role ==="admin"){
      window.toastify("admin not able to buy any product" ,"error") 
    return  
    }
    if(!isAuth){
      window.toastify("please sign in to get features" ,"error") 
      return   
      }
    setCounts(prevCounts => ({
      ...prevCounts,
      [productId]: Math.max(1, prevCounts[productId] - 1),
    }));
  };
  
const addToWishlist = async (productId) => {
  
  if(role ==="admin"){
    window.toastify("admin not able to buy any product" ,"error") 
  return     
  }
  if(!isAuth){
    window.toastify("Please log in to add to wishlist", "error"); 
  return     
  }
  setIsAddingToWishlist(prev => ({ ...prev, [productId]: true }));
  try {
    const user = auth.currentUser; 
    if (user) {
      await setDoc(doc(firestore, `users/${user.uid}/wishlist`, productId), {
        productId,
        addedAt: new Date(),
      },{ merge: true });
      window.toastify("Product added to wishlist!", "success");
      console.log(`Added to wishlist: ${productId}`);
    } else {
      window.toastify("Please log in to add to wishlist", "error");
    }
  } catch (error) {
    console.error("Error adding to wishlist: ", error);
    window.toastify("Failed to add to wishlist", "error");
  }
  finally{
    setIsAddingToWishlist(prev => ({ ...prev, [productId]: false }));
  }
};

const addToCart = async (productId) => {
 
  if(role ==="admin"){
    window.toastify("admin not able to buy any product" ,"error") 
  return      
  }
  
  if(!isAuth){
    window.toastify("Please log in to add to wishlist", "error"); 
  return     
}
setIsAddingToCart(prev => ({ ...prev, [productId]: true }))
  try {
    const user = auth.currentUser; 
    if (user) {
      await setDoc(doc(firestore, `users/${user.uid}/cart`, productId), {
        productId,
        quantity:  counts[productId], 
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
    setIsAddingToCart(prev => ({ ...prev, [productId]: false }));
  }
};
  return (
    <div className="product-display">  
      <Row gutter={[16, 16]}>
        {isLoading ? (
          [...Array(6)].map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Skeleton active />
            </Col>
          ))
        ) : products.length === 0 ? (
          <Col span={24}>
            <Empty description="No products found" />
          </Col>
        ) : (
          products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.title}
                    src={
                      product.imageURL ||
                      'https://img.freepik.com/free-photo/side-view-shawarma-with-fried-potatoes-board-cookware_176474-3215.jpg?t=st=1730624007~exp=1730627607~hmac=e7c2aeae3214e9c0388532dc22abb7b78d7ac6eb248a72eb74472ff3326086ab&w=740'
                    }
                  />
                }
                className="product-card"
              >
                <Card.Meta title={product.title} description={`$${product.price}`} />
                <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'Read more' }}>
                  {product.description}
                </Paragraph>
                <div >
                <Button
                style={{fontSize :"15px"}}
                    type="primary"
                    icon={<PlusCircleOutlined />}
                  onClick={()=>handleIncrement(product.id)}
                  >
                  </Button>
                  <span className="mx-2">{counts[product.id] || 1}</span>
                  <Button
                  style={{fontSize :"15px"}}
                    type="text"
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={()=>handleDecrement(product.id)}>
                      
                  </Button>
                </div>
                <div className="product-actions">
                  <Button
                    type="text"
                    icon={<HeartOutlined />}
                    disabled={isAddingToWishlist[product.id]}
                    loading={isAddingToWishlist[product.id]}
                    onClick={() => addToWishlist(product.id)}
                  >
                  </Button>
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    loading={isAddingToCart[product.id]}
                    disabled={isAddingToCart[product.id]}     
                    onClick={() => addToCart(product.id)}
                  >

                  </Button>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default Products;
