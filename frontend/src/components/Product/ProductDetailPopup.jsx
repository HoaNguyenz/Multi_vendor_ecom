import React, { useState, useEffect } from "react";
import { FaCartPlus, FaRegEye } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// import { addToCart } from "../../../redux/actions/cart";
// import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import styles from "../../styles/styles"; // Assuming your styles are in this folder

const ProductDetailPopup = ({ setOpen, productData }) => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
//   const { cart } = useSelector((state) => state.cart);
//   const dispatch = useDispatch();

  const incrementCount = () => setCount(count + 1);
  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

//   const addToCartHandler = (product) => {
//     const isItemExists = cart && cart.find((item) => item.id === product.id);
//     if (isItemExists) {
//       toast.error("Item already in cart!");
//     } else if (product.stock < count) {
//       toast.error("Product stock is limited!");
//     } else {
//       const cartData = { ...product, qty: count };
//       dispatch(addToCart(cartData));
//       toast.success("Item added to cart successfully!");
//     }
//   };

  return (
    <div className="bg-[#fff]">
      {productData ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50"
              onClick={() => setOpen(false)}
            />

            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={productData.imageUrl || "https://via.placeholder.com/150"}
                  alt={productData.Ten_san_pham}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
                {/* <div className="mt-4">
                  <Link to={`/shop/preview/${productData.shop.id}`} className="flex items-center">
                    <img
                      src={productData.Url_logo || "https://via.placeholder.com/50"}
                      alt={productData.Ten}
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                    <div>
                      <h3 className={`${styles.shop_name}`}>{productData.Ten}</h3>
                      <p className="pb-3 text-sm">{productData.shop.ratings} Ratings</p>
                    </div>
                  </Link>
                </div> */}
              </div>

              <div className="w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]">
                <h1 className={`${styles.productTitle} text-[20px]`}>{productData.Ten_san_pham}</h1>
                <p>{productData.Thuong_hieu}</p>

                <div className="flex pt-3">
                    <h3 className="ml-2">
                      {productData.Gia} VND
                    </h3>
                </div>

                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">{count}</span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <FaCartPlus
                        size={30}
                        className="cursor-pointer"
                        // onClick={removeFromWishlistHandler}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <FaRegEye
                        size={30}
                        className="cursor-pointer"
                        // onClick={addToWishlistHandler}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>

                <div
                  className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center`}
                //   onClick={() => addToCartHandler(productData)}
                >
                  <span className="text-[#fff] flex items-center">
                    Add to cart <FaCartPlus className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailPopup;
