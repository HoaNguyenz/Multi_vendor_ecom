import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const response = await axios.post(
            "http://localhost:5000/verify",
            { email, code: verificationCode },
        );

        if (response.status === 200) {
            alert("Xác thực thành công.");
            navigate("/login"); // Điều hướng sang trang chủ sau khi xác minh
        }
    } catch (error) {
        setError("Mã xác minh không hợp lệ hoặc có lỗi xảy ra.");
        console.error(error);
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Xác minh tài khoản
        </h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-4 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-4" onSubmit={handleVerify}>
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

            <div>
              <label
                htmlFor="verificationCode"
                className="block text-sm font-medium text-gray-700"
              >
                Mã xác minh
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="verificationCode"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                <p>{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Đang xác thực..." : "Xác minh"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verify;