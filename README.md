# Các bước đặt hàng

1. User thêm các loại mẫu mã sản phẩm vào giỏ hàng <- post "/cart"
2. User bấm vào giỏ hàng thì có thể cập nhật lại số lượng từng mẫu mã sản phẩm hoặc xóa đi <- delete/put "/cart"
3. Bấm chọn các mẫu mã sản phẩm cần mua và đặt hàng (khi tạo trạng thái là "Chờ xác nhận") post <-> "/order"
4. Có thể hủy hoặc xem lại các đơn hàng theo trạng thái delete/get <-> "/order"

5. Người bán có thể xem các đơn hàng get <-> "/seller/orders"
6. Bấm xác nhận khi muốn tạo đơn put <-> "/confirm-order/:id
7. Bấm hoàn thành khi đơn đã giao xong put <-> "/confirm-delivery/:id"
