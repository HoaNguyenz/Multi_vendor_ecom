import {React, useState} from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai"
import styles from '../../styles/styles'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [visible, setVisible] = useState(false) 
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent form from submitting the default way
  
      // Check which submit button was pressed
      const submitter = e.nativeEvent.submitter;
  
      if (submitter.name === "normalLogin" || submitter.name === "sellerLogin") {
        try {
          // Prepare the login data
          const data = { email, mat_khau: password };
  
          // Send login request to backend
          const response = await axios.post("http://localhost:5000/login", data);
  
          // If login is successful, handle response and navigate
          if (response.status === 200) {
            alert(response.data.message); // Display success message
  
            // After login, navigate to different pages based on user type
            if (submitter.name === "normalLogin") {
              navigate("/home"); // Regular user
            } else {
              navigate("/shop-dashboard"); // Seller user
            }
          }
        } catch (error) {
          console.error(error);
          alert("Đăng nhập thất bại. Vui lòng thử lại.");
        }
      }
    };
    

  return (
    <div className=" bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            {/* Mật khẩu */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {
                    visible ? (
                        <AiOutlineEye className="absolute right-2 top-2 cursor-pointer"
                size={25}
                onClick={()=> setVisible(false)}></AiOutlineEye>
                    ) : (
                        <AiOutlineEyeInvisible className="absolute right-2 top-2 cursor-pointer"
                size={25}
                onClick={()=> setVisible(true)}></AiOutlineEyeInvisible>
                    )
                }

              </div>
            </div>

            <div className={`${styles.noramlFlex} justify-between`}>
                <div className={`${styles.noramlFlex}`}>
                    <input type="checkbox" name="remember-me" id="remember-me" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Nhớ tài khoản
                    </label>
                </div>
                <div className="text-sm">
                    <a href="forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                        Quên mật khẩu?
                    </a>
                </div>
            </div>

            <div>
                <button type="submit" name="normalLogin" className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600">
                    Đăng nhập
                </button>
            </div>
            <div>
                <button type="submit" name="sellerLogin" className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-300">
                    Đăng nhập với tư cách người bán
                </button>
            </div>
            <div className={`${styles.noramlFlex} w-full`}>
                <h4>Chưa có tài khoản?</h4>
                <Link to="/sign-up" className="text-blue-600 pl-2">
                    Đăng kí
                </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
