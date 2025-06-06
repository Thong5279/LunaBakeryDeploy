import React from "react";

const checkout = {
  _id: "checkout12345",
  createdAt: new Date(),
  checkoutItems: [
    {
      productId: "product1",
      name: "Bánh Tiramisu",
      price: 50000,
      size: "12cm",
      flavor: "Socola",
      description:
        "Bánh tiramisu là một loại bánh ngọt truyền thống của Ý, nổi tiếng với hương vị cà phê đậm đà và lớp kem mascarpone mịn màng.",
      img: "https://picsum.photos/150?random=1",
      quantity: 2,
    },
    {
      productId: "product2",
      name: "Bánh Kem Dâu",
      price: 60000,
      size: "14cm",
      flavor: "Dâu tây",
      description:
        "Bánh kem dâu là một loại bánh ngọt nhẹ nhàng, thường được làm từ lớp bánh bông lan mềm mịn, phủ kem tươi và trang trí bằng dâu tây tươi.",
      img: "https://picsum.photos/150?random=2",
      quantity: 1,
    },
  ],
  shippingAddress: {
    adress: "123 Đường ABC",
    city: "Hà Nội",
    firstname: "Nguyễn",
    lastname: "Văn A",
    phonenumber: "0123456789",
  },
};

const OderconfirmationPage = () => {
  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    const estimatedDeliveryDate = new Date(orderDate);

    orderDate.setDate(orderDate.getDate() + 2); // Giả sử giao hàng trong vòng 5 ngày
    return orderDate.toLocaleDateString();
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Xác nhận đơn hàng thành công
      </h1>

      {checkout && (
        <div className="p-6 rounded-lg border mb-20">
          <div className="flex-4xl font-bold text-center text-emerald-700 mb-8">
            <h2 className="text-xl font-semibold mb-3">
              Mã đơn hàng:{" "}
              <span className="text-emerald-600">{checkout._id}</span>
            </h2>
            <div className="grid grid-cols-2 gap-8">
              <p className=" text-gray-500">
                Ngày mua:{" "}
                {new Date(checkout.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {/* estimated delivery dự kiến giao hàng */}
              <div>
                <p className="text-gray-600 text-sm">
                  Dự kiến giao hàng từ :{" "}
                  {calculateEstimatedDelivery(checkout.createdAt)} -{" "}
                  {calculateEstimatedDelivery(checkout.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* order items */}
          <div className="mb-15 mt-15">
            {checkout.checkoutItems.map((item) => (
              <div key={item.productId} className="flex items-center mb-4">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-gray-600">
                    Vị: {item.flavor} - Kích thước: {item.size}
                  </p>
                  <p className="text-gray-500">Số lượng: {item.quantity}</p>
                  <div></div>
                </div>
                <div>
                  <p className="text-gray-800 font-bold">
                    Giá:{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* delivery info */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Thanh Toán</h4>
              <p>PayPal</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Giao hàng</h4>
              <p className="">
                địa chỉ : {checkout.shippingAddress.adress} ,thành phố{" "}
                {checkout.shippingAddress.city},
              </p>

              <p>
                tên: {checkout.shippingAddress.firstname}{" "}
                {checkout.shippingAddress.lastname},
              </p>
              <p>Số điện thoại: {checkout.shippingAddress.phonenumber}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OderconfirmationPage;
